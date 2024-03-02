#!/bin/bash


SCRIPT_DIR=$(dirname "$0")
CHAI="$SCRIPT_DIR/$1"
TEMPFILE=$(mktemp "$SCRIPT_DIR"/chai_output.XXXXXX)
FILEPATH=$2
N_DEALS=$3

if [ $# -eq 0 ]; then
    echo "Usage: $0 <filepath> <number of deals>"
    exit 1
fi

CHAI_OUTPUT=$("$CHAI" "$FILEPATH" 2>&1)
if [ $? -ne 0 ]; then
    echo "Execution of chai_py failed."
    echo "$CHAI_OUTPUT"
    rm "$TEMPFILE"
    exit 1
fi
echo "$CHAI_OUTPUT" > "$TEMPFILE"


REDEAL_OUTPUT=$(python3 -mredeal --max 100000 -n "$N_DEALS" --format=pbn "$TEMPFILE" 2>&1)
if [ $? -ne 0 ]; then
    echo "Execution of redeal failed."
    echo "$REDEAL_OUTPUT"
    rm "$TEMPFILE"
    exit 1
fi
echo "$REDEAL_OUTPUT"

rm "$TEMPFILE"
