#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
dealer="Random"
vul="Random"
flip="no"

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -c) compiler="$2"; shift ;;
        -f) filepath="$2"; shift ;;
        -n) number_of_deals="$2"; shift ;;
        -d) dealer="$2"; shift ;;
        -v) vul="$2"; shift ;;
        -i) flip="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# The required arguments: compiler, filepath, number_of_deals
if [ -z "$compiler" ] || [ -z "$filepath" ] || [ -z "$number_of_deals" ]; then
    echo "Missing required arguments. Usage:"
    echo "-c <chai/latte> -f <filepath> -n <number of deals> [-d <N/S/W/E/Random>] [-v <NS/EW/None/All/Random>] [-i <90/180/no>]"
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

echo "$REDEAL_OUTPUT"

echo "Compiler: $compiler"
echo "Dealer: $dealer"
echo "Vulnerability: $vul"
echo "Flip: $flip"
echo "Constraints:"
cat "$filepath"

rm "$TEMPFILE"
