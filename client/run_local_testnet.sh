#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# 1) Environment sanity
# -----------------------------------------------------------------------------
: "${JAMDUNA:?Please set JAMDUNA=./jamduna-<os>-<arch>}"
: "${NETWORK:?Please set NETWORK (e.g. tiny)}"
: "${NUM_NODES:?Please set NUM_NODES (e.g. 6)}"
: "${DEFAULT_PORT:?Please set DEFAULT_PORT (e.g. 40000)}"

# -----------------------------------------------------------------------------
# 2) Pre-run: generate & show keys
# -----------------------------------------------------------------------------
echo "🔑 Generating validator keypairs…"
"$JAMDUNA" gen-keys

echo "🗝  Listing all keys:"
"$JAMDUNA" list-keys

# -----------------------------------------------------------------------------
# 3) Tear down any leftovers
# -----------------------------------------------------------------------------
echo "🧹 Cleaning up old data & processes…"
pkill -f "$JAMDUNA" >/dev/null 2>&1 || true
rm -rf ~/.jamduna/jam-*

# -----------------------------------------------------------------------------
# 4) Start NUM_NODES validators in the background
# -----------------------------------------------------------------------------
mkdir -p logs
echo "🚀 Launching $NUM_NODES validators on network='$NETWORK':"

for (( i=0; i<NUM_NODES; i++ )); do
  PORT=$(( DEFAULT_PORT + i ))

  # one‐liner fallback date, works in bash or zsh
  START_TIME="$(
    date -d "5 seconds" '+%Y-%m-%d %H:%M:%S' 2>/dev/null \
    || date -v+5S        '+%Y-%m-%d %H:%M:%S'
  )"

  echo "  • Validator #$i → port $PORT  (start at $START_TIME)"
  "$JAMDUNA" run \
    --net-spec      "$NETWORK" \
    --port          "$PORT" \
    --dev-validator "$i" \
    --start-time    "$START_TIME" \
    > "logs/node-$i.log" 2>&1 &
done

# -----------------------------------------------------------------------------
# 5) Wait and exit
# -----------------------------------------------------------------------------
wait
echo "✅ All $NUM_NODES validators are up (logs in ./logs/)."

