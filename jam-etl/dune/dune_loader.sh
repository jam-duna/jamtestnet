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

# ——— DEBUG: if you only want to run a few tables, list them here (without the “jam_” prefix):
# e.g. DEBUG_TABLES=(workreports blocks)
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
  # no debug list → pick up everything
  mapfile -t schemas < <(printf "%s\n" "$SCHEMA_DIR"/*.json)
fi

for schema in "${schemas[@]}"; do
  name=$(basename "$schema" .json)
  table=jam_"$name"
  datafile="$DATA_DIR"/"$name".jsonl

  echo
  echo "=== Processing table: $table ==="

  if $DRY_RUN; then
    echo "[DRY-RUN] $schema"
    echo "Step 1 → CREATE | Step 2 → CLEAR | Step 3 → INSERT"
    echo "  Step 1 → CREATE"
    node ./dune_tbl_create.js --dry-run "$schema" "$table" "JAM ${name^}"
    echo "  Step 2 → CLEAR"
    node ./dune_tbl_clear.js "$table"
    echo "  Step 3 → INSERT"
    node ./dune_rec_insert.js --dry-run "$datafile" "$table"
  else
    echo "[RUN] $schema"
    echo "Step 1 → CREATE | Step 2 → CLEAR | Step 3 → INSERT"
    echo "  Step 1 → CREATE"
    node ./dune_tbl_create.js "$schema" "$table" "JAM ${name^}"
    echo "  Step 2 → CLEAR"
    node ./dune_tbl_clear.js --run "$table"
    echo "  Step 3 → INSERT"
    node ./dune_rec_insert.js "$datafile" "$table"
  fi
done