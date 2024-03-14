#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
dealer="Random"
vul="Matching"
flip="no"
scoring="IMP"

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -c) compiler="$2"; shift ;;
        -f) filepath="$2"; shift ;;
        -n) number_of_deals="$2"; shift ;;
        -d) dealer="$2"; shift ;;
        -v) vul="$2"; shift ;;
        -i) flip="$2"; shift ;;
        -s) scoring="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

scoring=${scoring^^}

# The required arguments: compiler, filepath, number_of_deals
if [ -z "$compiler" ] || [ -z "$filepath" ] || [ -z "$number_of_deals" ]; then
    echo "Missing required arguments. Usage:"
    echo "-c <chai/latte> -f <filepath> -n <number of deals> [-d <Matching/N/S/W/E/Random>] [-v <Matching/NS/EW/None/All/Random>] [-i <90/180/no>]"
    exit 2
fi

if [[ "${compiler,,}" == "chai" ]]; then
    HSKL="$SCRIPT_DIR/Chai/chai_py"
elif [[ "${compiler,,}" == "latte" ]]; then
    HSKL="$SCRIPT_DIR/Latte/latte_py"
else
    echo "Unrecognized compiler."
    exit 3
fi

TEMPFILE=$(mktemp "$SCRIPT_DIR"/deal_output.XXXXXX)

HSKL_OUTPUT=$("$HSKL" "$filepath" 2>&1)
if [ $? -ne 0 ]; then
    echo "Execution of haskell compiler failed."
    echo "$HSKL_OUTPUT"
    rm "$TEMPFILE"
    exit 4
fi

echo "$HSKL_OUTPUT" > "$TEMPFILE"

REDEAL_OUTPUT=$(python3 -mredeal --max 100000 -n "$number_of_deals" --format=pbn "$TEMPFILE" 2>&1)

if [ $? -ne 0 ]; then
    echo "Execution of redeal failed."
    echo "$REDEAL_OUTPUT"
    rm "$TEMPFILE"
    exit 5
fi

# Intentionally left here for debugging purposes
#echo "$REDEAL_OUTPUT"
#echo "Dealer: $dealer"
#echo "Vulnerability: $vul"
#echo "Flip: $flip"

rm "$TEMPFILE"

# Function to get a random dealer
random_dealer() {
  dealers=("N" "E" "S" "W")
  echo "${dealers[$RANDOM % 4]}"
}

# Function to get random vulnerability
random_vulnerability() {
  vulnerabilities=("None" "All" "NS" "EW")
  echo "${vulnerabilities[$RANDOM % 4]}"
}

# Function to adjust dealer based on flip/rotation
adjust_dealer() {
  local current_dealer="$1"
  local move="$2"
  local dealers=("N" "E" "S" "W")
  local index=0

  for i in "${!dealers[@]}"; do
    if [[ "${dealers[$i]}" == "$current_dealer" ]]; then
      index=$i
      break
    fi
  done

  new_index=$(( (index + move) % 4 ))
  echo "${dealers[$new_index]}"
}

# Function to flip the deal if needed
flip_deal() {
  local deal="$1"
  local rotation="$2"
  local rotated_deal=""
  # Extract hands without [Deal "N: and "]
  local hands=$(echo "$deal" | sed -e 's/\[Deal "N://g' -e 's/"\]//g')
  IFS=' ' read -r -a hand_array <<< "$hands"
  echo "[Deal \"N:${hand_array[2]} ${hand_array[1]} ${hand_array[0]} ${hand_array[3]}\"]"
}

# Function to rotate the deal
rotate_deal() {
  local deal="$1"
  local rotation="$2"
  local rotated_deal=""
  # Extract hands without [Deal "N: and "]
  local hands=$(echo "$deal" | sed -e 's/\[Deal "N://g' -e 's/"\]//g')
  IFS=' ' read -r -a hand_array <<< "$hands"

  case $rotation in
    1) # Rotate once
      rotated_deal="[Deal \"N:${hand_array[3]} ${hand_array[0]} ${hand_array[1]} ${hand_array[2]}\"]"
      ;;
    2) # Rotate twice
      rotated_deal="[Deal \"N:${hand_array[2]} ${hand_array[3]} ${hand_array[0]} ${hand_array[1]}\"]"
      ;;
    3) # Rotate three times
      rotated_deal="[Deal \"N:${hand_array[1]} ${hand_array[2]} ${hand_array[3]} ${hand_array[0]}\"]"
      ;;
    *) # No rotation
      rotated_deal="$deal"
      ;;
  esac

  echo "$rotated_deal"
}

echo "[Date \"$(date +'%Y.%m.%d')\"]"
echo ""

IFS=$'\n' read -d '' -r -a deals <<< "$REDEAL_OUTPUT"
board=1

# Vulnerability: Matching
# The vulnerability of each pair is pre-determined by the board number.
# NS is vulnerable in boards 2, 4, 5, 7, 10, 12, 13, 15 and
# repeats for each 16 boards. EW is vulnerable in boards
# 3, 4, 6, 7, 9, 10, 13, 16 and repeats for each 16 boards. 

for deal in "${deals[@]}"; do
  if [[ $deal == \[Deal* ]]; then
    # Set dealer for each deal if random, else use provided dealer
    if [[ $dealer == "Random" ]]; then
      current_dealer=$(random_dealer)
    elif [[ $dealer == "Matching" ]]; then
      if (( $board % 4 == 1 )); then
        current_dealer="N"
      elif (( $board % 4 == 2 )); then
        current_dealer="E"
      elif (( $board % 4 == 3 )); then
        current_dealer="S"
      elif (( $board % 4 == 0 )); then
        current_dealer="W"
      fi
    else
      current_dealer=${dealer:0:1}
    fi

    # Set vulnerability for each deal if random, pre-determined if matching,
    # else use provided vulnerability
    if [[ $vul == "Random" ]]; then
      current_vulnerability=$(random_vulnerability)
    elif [[ $vul == "Matching" ]]; then
      current_vulnerability="None"
      if  (( $board % 16 == 2 )) || (( $board % 16 == 4 )) || (( $board % 16 == 5 )) || 
          (( $board % 16 == 7 )) || (( $board % 16 == 10 )) || (( $board % 16 == 12 )) || 
          (( $board % 16 == 13 )) || (( $board % 16 == 15 )); then
        current_vulnerability="NS"
      fi
      if  (( $board % 16 == 3 )) || (( $board % 16 == 4 )) || (( $board % 16 == 6 )) || 
          (( $board % 16 == 7 )) || (( $board % 16 == 9 )) || (( $board % 16 == 10 )) || 
          (( $board % 16 == 13 )) || (( $board % 16 == 16 )); then
        if [[ $current_vulnerability == "None" ]]; then
          current_vulnerability="EW"
        else
          current_vulnerability="All"
        fi
      fi
    else
      current_vulnerability=$vul
    fi

    # Process flip if necessary
    if [[ $flip == "Flip180st" ]]; then
      if (( RANDOM % 2 )); then
        deal=$(flip_deal "$deal")
        if [[ $current_dealer == "N" ]]; then
          current_dealer="S"
        elif [[ $current_dealer == "S" ]]; then
          current_dealer="N"
        fi
      fi
    elif [[ $flip == "Flip90st" ]]; then
      rotation=$(( RANDOM % 4 ))
      deal=$(rotate_deal "$deal" $rotation)
      current_dealer=$(adjust_dealer "$current_dealer" "$rotation")

      if [[ $rotation == 1 ]] || [[ $rotation == 3 ]]; then
        if [[ $current_vulnerability == "NS" ]]; then
          current_vulnerability="EW"
        elif [[ $current_vulnerability == "EW" ]]; then
          current_vulnerability="NS"
        fi
      fi
    fi

    # Extract deal string without [Deal and ] to keep consistent format
    deal_string=$(echo $deal | sed -e 's/\[Deal "//' -e 's/"\]//')

    echo "[Board \"$board\"]"
    echo "[Dealer \"$current_dealer\"]"
    echo "[Vulnerable \"$current_vulnerability\"]"
    echo "[Deal \"$deal_string\"]"
    echo ""
    ((board++))
  fi
done

echo "Number of deals: $((board-1))"
echo "Compiler: $compiler"
echo "Vulnerability: $vul"
echo "Dealer: $dealer"
echo "Flip: $flip"
echo "Scoring: $scoring"

IFS=$'\n' read -d '' -r -a lines <<< "$REDEAL_OUTPUT"
board=1
tries=""

for line in "${lines[@]}"; do
  if [[ $line == Tries:* ]]; then
    tries=$line
  fi
done

echo "$tries"

if [ ! -s "$filepath" ]; then
    echo "No constraints applied."
else
    echo "Constraints:"
    cat "$filepath"
fi