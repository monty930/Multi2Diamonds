#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

for file in "$SCRIPT_DIR"/grammar/Bridgechai/*.hs; do
    if [[ $(basename "$file") != "Test.hs" ]]; then
        sed 's/Bridgechai\.//g' "$file" > "$SCRIPT_DIR/src/$(basename "$file")"
    fi
done

make
