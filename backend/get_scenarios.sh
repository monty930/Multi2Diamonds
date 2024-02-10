#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

for file in "$SCRIPT_DIR"/grammar/Bridgelatte/*.hs; do
    if [[ $(basename "$file") != "Test.hs" ]]; then
        sed 's/Bridgelatte\.//g' "$file" > "$SCRIPT_DIR/src/$(basename "$file")"
    fi
done

if [ $# -eq 0 ]; then
    echo "No filepath provided. Usage: $0 <filepath>"
    exit 1
fi

FILEPATH=$1

TEMPFILE=$(mktemp /tmp/latte_output.XXXXXX)

output=$("$SCRIPT_DIR/latte_py" "$FILEPATH" 2>&1)

if [ $? -ne 0 ]; then
    echo "Execution of latte_py failed."
    echo "$output"
    exit 1
fi

echo "$output" > "$TEMPFILE"

output2=$(python -mredeal --max 100000 -n 1 --format=pbn "$TEMPFILE" 2>&1)

if [ $? -ne 0 ]; then
    echo "Execution of redeal failed."
    echo "$output2"
    exit 1
fi

echo "$output2"

rm "$TEMPFILE"
