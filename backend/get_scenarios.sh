#!/bin/bash

# Get the directory of the script
SCRIPT_DIR=$(dirname "$0")

# New section to copy .hs files except Test.hs from ./grammar/BridgeLatte to ./src
# and remove every occurrence of "Bridgelatte."
for file in "$SCRIPT_DIR"/grammar/Bridgelatte/*.hs; do
    if [[ $(basename "$file") != "Test.hs" ]]; then
        # Use sed to remove occurrences of "Bridgelatte." and copy the modified content to the destination
        sed 's/Bridgelatte\.//g' "$file" > "$SCRIPT_DIR/src/$(basename "$file")"
    fi
done

# Check if an argument was provided
if [ $# -eq 0 ]; then
    echo "No filepath provided. Usage: $0 <filepath>"
    exit 1
fi

# The first argument is the filepath
FILEPATH=$1

# Generate a temporary file. mktemp will create a temp file and return its name.
TEMPFILE=$(mktemp /tmp/latte_output.XXXXXX)

# Execute latte_py with the provided filepath and redirect output to the temporary file
"$SCRIPT_DIR/latte_py" "$FILEPATH" > "$TEMPFILE"

# Check if latte_py execution was successful
if [ $? -ne 0 ]; then
    echo "Execution of latte_py failed."
    exit 1
fi

# Use the temporary file as an input for python -m redeal and output the result
python -mredeal --max 10000 -n 1 --format=pbn "$TEMPFILE"

# Optionally, remove the temporary file after use
rm "$TEMPFILE"
