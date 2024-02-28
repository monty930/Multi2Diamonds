#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

for file in "$SCRIPT_DIR"/grammar/Bridgelatte/*.hs; do
    if [[ $(basename "$file") != "Test.hs" ]]; then
        sed 's/Bridgelatte\.//g' "$file" > "$SCRIPT_DIR/src/$(basename "$file")"
    fi
done

make
