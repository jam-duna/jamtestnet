#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Pass “--run” to actually execute, otherwise it will dry‐run
DRY_RUN=true
if [[ "$1" == "--run" ]]; then
  DRY_RUN=false
fi

SCHEMA_DIR=./schema
DATA_DIR=./dune_jam

#DEBUG_TABLES=(segments workpackagebundles)
DEBUG_TABLES=()

# Build list of schema files to process:
if [ ${#DEBUG_TABLES[@]} -gt 0 ]; then
  schemas=()
  for tbl in "${DEBUG_TABLES[@]}"; do
    file="$SCHEMA_DIR/$tbl.json"
    if [ -f "$file" ]; then
      schemas+=("$file")
    else
      echo "⚠️  Warning: schema file not found: $file"
    fi
  done
else
  mapfile -t schemas < <(printf "%s\n" "$SCHEMA_DIR"/*.json)
fi

do_insert() {
  local datafile=$1 table=$2
  if [ ! -s "$datafile" ]; then
    echo "⚠️  No data or empty file for $table → skipping INSERT"
    return
  fi
  if $DRY_RUN; then
    echo "    → node dune_rec_insert.js --dry-run \"$datafile\" \"$table\""
    node ./dune_rec_insert.js --dry-run "$datafile" "$table"
  else
    echo "    → node dune_rec_insert.js \"$datafile\" \"$table\""
    node ./dune_rec_insert.js "$datafile" "$table"
  fi
}

for schema in "${schemas[@]}"; do
  name=$(basename "$schema" .json)
  table=jam_"$name"
  datafile="$DATA_DIR"/"$name".jsonl

  echo
  echo "=== Processing table: $table ==="
  echo "Step 1 → CREATE | Step 2 → CLEAR | Step 3 → INSERT"

  echo "  Step 1 → CREATE"
  if $DRY_RUN; then
    node ./dune_tbl_create.js --dry-run "$schema" "$table" "JAM ${name^}"
  else
    node ./dune_tbl_create.js "$schema" "$table" "JAM ${name^}"
  fi

  echo "  Step 2 → CLEAR"
  if $DRY_RUN; then
    node ./dune_tbl_clear.js "$table"
  else
    node ./dune_tbl_clear.js --run "$table"
  fi

  echo "  Step 3 → INSERT"
  do_insert "$datafile" "$table"
done