#!/bin/bash
set -e

# Ensure jq is installed, if not, install it (or document the dependency)
if ! command -v jq &> /dev/null; then
  echo "jq is required but not installed. Please install jq first."
  exit 1
fi

# Loop through JSON files and run the test command
find data/*/state_transitions -type f -name '*.json' | sort | while IFS= read -r file; do
  echo "Processing $file"
  echo "Running: curl -s -q -X POST https://jamduna.org/api/stf -H 'accept: application/json' -H 'Content-Type: application/json' -d @\"$file\" | jq -r"
  curl -s -q -X POST https://dev.jamduna.org/api/stf \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d @"$file" | jq -r
done

