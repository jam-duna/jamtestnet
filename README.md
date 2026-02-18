# JAM DUNA Releases

[JAM](https://jam.web3.foundation/) is the anticipated future protocol for Polkadot, being implemented by multiple teams across different programming languages. The [JAM Gray Paper](https://graypaper.com/) outlines the protocol, and the Web3 Foundation has many 20+ teams undergoing [jam-conformance](https://github.com/w3f/jam-conformance) fuzzing processes.    

This repo contains the latest `duna_target` in support of [JAM DUNA M1 milestone delivery](https://github.com/w3f/jam-milestone-delivery/pull/22) and a [JAM DUNA PoC JAM Toaster release](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.2.13-toaster) (Linux AMD64) suitable for PoC JAM Toaster testing.

# JAM DUNA PoC JAM Toaster Release 

This repo contains JAM DUNA binary releases suitable to start testing in the JAM Toaster: (GP 0.7.2 Linux)
- bring up a reproducible tiny JAM testnet (6 validators) either in a single-machine local testnet (same as corevm/doom) or multi-machine deployment (a few nodes in a JAM Toaster)
- run FIB flow (`fib-stream-runner`) after validators are healthy (optional)

It is expected this can support further testing with real services (smart contract/privacy services) in larger testnets in a multi-client settingg.

## Choose Your Path First

Use this bundle in one of these modes:

1. Single-machine local testnet (recommended)
- Use the included `Makefile` directly.
- This is the default and documented path.

2. Multi-machine deployment (JAM Toaster)
- Use your own deployment/orchestration system (nomad)
- See **Multi-machine flow** at the end.

If you are not sure, use **single-machine**.

## Download the latest release

Download  the latest release [here](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.2.13-toaster) to a folder of your choice. 

## What Is Included

- `jamduna`
- `fib-stream-runner`
- bundled FIB deps:
  - `runner/fib-builder`
  - `runner/fib-feeder`
- minimal genesis bundle for `gen-spec`:
  - `release_genesis_services/auth_copy.pvm`
  - `release_genesis_services/fib.jam`
  - `release_genesis_services/null_authorizer.pvm`
- `chainspecs/local-dev-config.json`
- `chainspecs/jamduna-spec.json`
- `Makefile`

## Prerequisites

- Linux AMD64
- `bash`, `make`
- Free local ports:
  - P2P: `40000..40005`
  - JSON-RPC: `19800..19805`
  - FIB RPC (optional): `8601`

## Single-Machine Quick Start (Recommended)

Run from this release directory (the folder containing this README and Makefile).

### 0) Always reset local state first

If this folder was reused or unpacked from someone else, reset first:

```bash
make clean-state
```

### 1) See available targets

```bash
make help
```

### 2) Generate keys

```bash
make gen-keys
```

This creates `seed_0..seed_6` under `state/keys/`.

Important:
- validators are `0..5`
- `seed_6` is reserved for optional builder role (FIB), not a validator process

### 3) Generate chainspec

```bash
make gen-spec
```

### 4) Start validators

```bash
make run-validators
```

### 5) Check process and activity health

```bash
make status
make health
```

`make health` checks:
- validator logs for `Imported Block`
- optional FIB logs for submission activity patterns

## Optional FIB Flow (After Validators Are Healthy)

You have two ways to run FIB:

1. Foreground mode:
```bash
make run-fib-stream
```
- blocks current shell
- stop with `Ctrl+C`

2. Background mode:
```bash
make run-fib-stream-bg
```
- daemon-like behavior for ops workflows
- stop with:
```bash
make stop-fib
```

## Operational Checks (Concrete)

Validator block production (example for validator 0):

```bash
grep -n "Imported Block" logs/jamduna-v0.log | tail
```

FIB work-package submissions (if FIB is running):

```bash
grep -n "Work package SUBMITTED\|SubmitBundleToCore CE146 SUCCESS" logs/fib-builder-stream-runner.log | tail
```

Feeder submission activity:

```bash
grep -n "submitted call=" logs/fib-feeder-stream-runner.log | tail
```

## Cleanup

Stop validators and background FIB runner:

```bash
make stop
```

Reset state:

```bash
make clean-state
```

## Using `jamduna` Binary Directly

If your deployment system manages startup itself, you can bypass the release Makefile.

1. Generate keys:

```bash
./jamduna gen-keys --data-path /var/lib/jamduna
```

2. Generate chainspec:

```bash
./jamduna gen-spec /etc/jam/chain-config.json /etc/jam/jamduna-spec.json
```

3. Start validator node (example index 0):

```bash
./jamduna run \
  --data-path /var/lib/jamduna \
  --chain /etc/jam/jamduna-spec.json \
  --dev-validator 0 \
  --pvm-backend compiler \
  --rpc-port 19800
```

Repeat for `--dev-validator 1..5`.

## Minimal Multi-Machine Example (3 Machines, 6 Validators)

Use this when you want a concrete deployment shape, not just principles.

### A) Topology

- Machine A (`10.0.0.11`): validator `0`, `1`
- Machine B (`10.0.0.12`): validator `2`, `3`
- Machine C (`10.0.0.13`): validator `4`, `5`

Optional proxy/builder node:
- Machine C also runs `--dev-validator 6 --role builder`

### B) Chain config (do this once on deploy controller)

Create a multi-machine chain config (do not use localhost addresses):

```json
{
  "genesis_validators": [
    {"index": 0, "net_addr": "10.0.0.11:40000"},
    {"index": 1, "net_addr": "10.0.0.11:40001"},
    {"index": 2, "net_addr": "10.0.0.12:40002"},
    {"index": 3, "net_addr": "10.0.0.12:40003"},
    {"index": 4, "net_addr": "10.0.0.13:40004"},
    {"index": 5, "net_addr": "10.0.0.13:40005"}
  ]
}
```

Then generate one shared chainspec:

```bash
./jamduna gen-spec /etc/jam/chain-config.json /etc/jam/jamduna-spec.json
```

Distribute exactly the same `jamduna` binary and `jamduna-spec.json` to all machines.

### C) Start commands per machine

Machine A:

```bash
./jamduna run --data-path /var/lib/jamduna --chain /etc/jam/jamduna-spec.json --dev-validator 0 --pvm-backend compiler --rpc-port 19800
./jamduna run --data-path /var/lib/jamduna --chain /etc/jam/jamduna-spec.json --dev-validator 1 --pvm-backend compiler --rpc-port 19801
```

Machine B:

```bash
./jamduna run --data-path /var/lib/jamduna --chain /etc/jam/jamduna-spec.json --dev-validator 2 --pvm-backend compiler --rpc-port 19802
./jamduna run --data-path /var/lib/jamduna --chain /etc/jam/jamduna-spec.json --dev-validator 3 --pvm-backend compiler --rpc-port 19803
```

Machine C:

```bash
./jamduna run --data-path /var/lib/jamduna --chain /etc/jam/jamduna-spec.json --dev-validator 4 --pvm-backend compiler --rpc-port 19804
./jamduna run --data-path /var/lib/jamduna --chain /etc/jam/jamduna-spec.json --dev-validator 5 --pvm-backend compiler --rpc-port 19805
```

Builder on Machine C: (optional)

```bash
./jamduna run --data-path /var/lib/jamduna --chain /etc/jam/jamduna-spec.json --dev-validator 6 --role builder --pvm-backend compiler --rpc-port 19806
```

### D) Rollout order

1. Start all validator processes (`0..5`) in a tight rollout window.
2. Verify each node shows block import activity in logs.
3. Start optional builder/proxy node (`6`) only after validator network is stable.

## Multi-Machine Flow 

Use this only when validators run on separate machines.

1. Generate one shared chainspec from one chain config.
2. Distribute the exact same `jamduna` binary and chainspec to all machines.
3. Distribute keys so node `i` has access to `seed_i` under its `--data-path/keys/`.
4. Start validator processes (`0..5`) in a tight rollout window.
5. Optionally run a proxy/builder node as `--dev-validator 6 --role builder` for external sync/debug integration.

This release bundle remains optimized for single-machine testing; multi-machine is an extension for now.

# Join JAM Community

If you want to join the JAM community, join [Let's JAM Matrix Room](https://matrix.to/#/#jam:polkadot.io) and [JAM Conformance Matrix Room](https://matrix.to/#/#jam-conformance:matrix.org)
