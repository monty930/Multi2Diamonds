#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

for file in "$SCRIPT_DIR"/grammar/Bridgechai/*.hs; do
    if [[ $(basename "$file") != "Test.hs" ]]; then
        sed 's/Bridgechai\.//g' "$file" > "$SCRIPT_DIR/src/$(basename "$file")"
    fi
done

if [ $# -eq 0 ]; then
    echo "Grammar files copied but no filepath provided."
    echo "Usage: $0 <filepath> <number of deals>"
    exit 1
fi

FILEPATH=$1

TEMPFILE=$(mktemp /tmp/chai_output.XXXXXX)

output=$("$SCRIPT_DIR/chai_py" "$FILEPATH" 2>&1)

if [ $? -ne 0 ]; then
    echo "Execution of chai_py failed."
    echo "$output"
    exit 1
fi

echo "$output" > "$TEMPFILE"

num_of_deals=$2

output2=$(python -mredeal --max 100000 -n $num_of_deals --format=pbn "$TEMPFILE" 2>&1)

if [ $? -ne 0 ]; then
    echo "Execution of redeal failed."
    echo "$output2"
    exit 1
fi

echo "$output2"

rm "$TEMPFILE"
