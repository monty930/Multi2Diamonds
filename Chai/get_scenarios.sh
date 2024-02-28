#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

if [ $# -eq 0 ]; then
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
