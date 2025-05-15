# JamDuna Quickstart Guide

## Intro

**Beta Release**  
Welcome to the first alpha release of JamDuna binary! This is a work in progress—frequent updates are expected. We appreciate your feedback and bug reports on GitHub.


---


| Binary                        | Platform                   | Available for Release |
|------------------------------|----------------------------|:--------------------:|
| `jamduna-linux-amd64`        | Linux (x86_64)             | ✅                   |
| `jamduna-linux-arm64`        | Linux (aarch64)            | ✅                   |
| `jamduna-mac-amd64`          | macOS (x86_64)             | ⚠️  Experimental     |
| `jamduna-mac-arm64`          | macOS (aarch64)            | ⚠️  Experimental     |

> Replace the binary name using the `$JAMDUNA` environment variable for your platform.

---

### Select Binaries
> Run the following cmd to set `$JAMDUNA` env variable for your platform.


```bash
# Set the JamDuna binary for your platform:
# detect and normalize OS and ARCH
case "$(uname -s)" in
  Linux) OS=linux ;;
  Darwin) OS=mac ;;
  *) echo "Unsupported OS: $(uname -s)" >&2; exit 1 ;;
esac

case "$(uname -m)" in
  x86_64)   ARCH=amd64 ;;
  aarch64|arm64) ARCH=arm64 ;;
  *) echo "Unsupported ARCH: $(uname -m)" >&2; exit 1 ;;
esac

export JAMDUNA=./jamduna-${OS}-${ARCH}
echo "Selected binary: $JAMDUNA"
```

---

### Supported Commands and Flags

Jamduna supports the following cmd and flags. More examples will be added in the future.

> These examples assume you have downloaded and unpacked the appropriate platform binary with $JAMDUNA env var set

```bash
# Binary Preview
$JAMDUNA --help
```

---
```
JAM DUNA node

Usage:
  ./jamduna [command]

Available Commands:
  gen-keys    Generate Keys for validators, pls generate keys for all validators before running the node
  gen-spec    Generate new chain spec from the spec config
  help        Help about any command
  list-keys   List keys for validators
  run         Run the JAM DUNA node
  test-refine Run the refine test
  test-stf    Run the STF Validation

Flags:
  -c, --config string       Path to the config file
  -h, --help                Displays help information about the commands and flags.
  -l, --log-level string    Log level (debug, info, warn, error) (default "debug")
      --pvm-output string   For both test-refine and test-stf, generates JSONNL separated execution trace with {step, pc, g, r} params
  -s, --pvm-sampling int    If --pvm-output is supplied, only outputs a line when step % pvm-sampling is 0 (default 1) (default 1)
  -t, --temp                Use a temporary data directory, removed on exit. Conflicts with data-path
  -v, --version             Prints the version of the program.

Use "./jamduna [command] --help" for more information about a command.
```

---
## QuickStart - Local Testnet 

### run_local_testnet.sh
`run_local_testnet.sh` script provides an convenient way to spin up the local testnet:


```bash
# set your platform binary and parameters once:
export JAMDUNA=./jamduna-linux-amd64   # or -mac-amd64, -mac-arm64, etc.
export NETWORK=tiny
export NUM_NODES=6
export DEFAULT_PORT=40000

# then simply:
./run_local_testnet.sh

# follow all node logs at once:
tail -F logs/node-*.log

```


---

## Generate and Inspect Validator Keys

```bash
# Generate a fresh keypair
$JAMDUNA gen-keys

# List your new keys
$JAMDUNA list-keys

--------------------------------------------------
file:          seed_0
seed:          0000000000000000000000000000000000000000000000000000000000000000
ed25519:       0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29
bandersnatch:  0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d
bls:           0xb27150a1f1cd24bccc792ba7ba4220a1e8c36636e35a969d1d14b4c89bce7d1d463474fb186114a89dd70e88506fefc9830756c27a7845bec1cb6ee31e07211afd0dde34f0dc5d89231993cd323973faa23d84d521fd574e840b8617c75d1a1d0102aa3c71999137001a77464ced6bb2885c460be760c709009e26395716a52c8c52e6e23906a455b4264e7d0c75466e
metadata:      0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
dns_alt_name:  ehnvcppgow2sc2yvdvdicu3ynonsteflxdxrehjr2ybekdc2z3iuq

[...output truncated for brevity...]
```
***Note***: full key info (key0...key5) can be found at [tiny-keys-dump](https://gist.github.com/mkchungs/6182667f9c6e752d3931d61e53718485)

---

## Run a Single Local Node

```bash
# determine appropriate date command for portability
if date -d "5 seconds" "+%Y-%m-%d %H:%M:%S" >/dev/null 2>&1; then
  DATE_CMD='date -d "5 seconds" "+%Y-%m-%d %H:%M:%S"'
else
  DATE_CMD='date -v+5S "+%Y-%m-%d %H:%M:%S"'
fi

# stop any running node
pkill -f "$JAMDUNA" || true

# run one node on port 9805
echo "Starting single node on port 9805…"
$JAMDUNA run \
  --net-spec tiny \
  --port 9805 \
  --start-time "$($DATE_CMD)"
```

> *On macOS, replace the `date -d` invocation with `date -v+5S`.*

---

## Launch a Local "Tiny" Testnet

```bash
# Run Tiny Testnet
pkill -f "$JAMDUNA" 2>/dev/null || true; \
for d in "$HOME"/.jamduna/jam-*; do [ -e "$d" ] && rm -rf "$d"; done; \
for i in $(seq 0 5); do \
  START=$( date -d '5 seconds' '+%Y-%m-%d %H:%M:%S' 2>/dev/null \
         || date -v+5S '+%Y-%m-%d %H:%M:%S' ); \
  PORT=$((40000 + i)); \
  echo "Launching validator #$i on port $PORT at $START"; \
  "$JAMDUNA" run \
    --net-spec      tiny \
    --port          "$PORT" \
    --dev-validator "$i" \
    --start-time    "$START" & \
done; \
wait; \
echo; echo "Background jobs:"; jobs
```

---

## Shutdown All Local Nodes

```bash
# Terminate all JamDuna instances
pkill -f "$JAMDUNA"
```


## Q&A

> For any questions, pls open an issue.
