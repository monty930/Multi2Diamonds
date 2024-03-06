#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
FILEPATH=$2
N_DEALS=$3

if [ $# -ne 3 ]; then
    echo "Usage: $0 <chai/latte> <filepath> <number of deals>"
    exit 1
fi

if [[ "${1,,}" == "latte" ]]; then
    HSKL="$SCRIPT_DIR/Latte/latte_py"
elif [[ "${1,,}" == "chai" ]]; then
    HSKL="$SCRIPT_DIR/Chai/chai_py"
else
    echo "Unrecognized compiler."
    exit 1
fi

TEMPFILE=$(mktemp "$SCRIPT_DIR"/chai_output.XXXXXX)

HSKL_OUTPUT=$("$HSKL" "$FILEPATH" 2>&1)
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
