#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path_to_pbn_file>"
    exit 1
fi

echo "This will be lin:"
echo "$1"
