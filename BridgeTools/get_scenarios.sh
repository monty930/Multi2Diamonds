#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
HSKL="$SCRIPT_DIR/$1"
FILEPATH=$2
N_DEALS=$3

if [ $# -eq 0 ]; then
    echo "Usage: $0 <chai_py/latte_py> <filepath> <number of deals>"
    exit 1
fi

TEMPFILE=$(mktemp "$SCRIPT_DIR"/chai_output.XXXXXX)

CHAI_OUTPUT=$("$HSKL" "$FILEPATH" 2>&1)
if [ $? -ne 0 ]; then
    echo "Execution of haskell compiler failed."
    echo "$HSKL_OUTPUT"
    rm "$TEMPFILE"
    exit 1
fi
echo "$HSKL_OUTPUT" > "$TEMPFILE"


REDEAL_OUTPUT=$(python3 -mredeal --max 100000 -n "$N_DEALS" --format=pbn "$TEMPFILE" 2>&1)
if [ $? -ne 0 ]; then
    echo "Execution of redeal failed."
    echo "$REDEAL_OUTPUT"
    rm "$TEMPFILE"
    exit 1
fi
echo "$REDEAL_OUTPUT"

rm "$TEMPFILE"
