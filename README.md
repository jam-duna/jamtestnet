# JAM DUNA Releases

[JAM](https://jam.web3.foundation/) is the anticipated future protocol for Polkadot, being implemented by multiple teams across different programming languages. The [JAM Gray Paper](https://graypaper.com/) outlines the protocol, and the Web3 Foundation has shared initial test vectors with participating teams [here](https://github.com/w3f/jamtestvectors).

This repo contains the latest `jamduna` binaries (Linux + Mac) targeting 0.6.5 and some [data](./data).  

## Status

Current release is 0.6.5.x -- the `jamduna` binary can do fallback + safrole with `polkajam` in tiny testnets (1+5, 2+4, 3+3, 4+2, 5+1).  

## Quickstart Guide

```bash
% jamduna -h
JAM DUNA node

Usage:
  ./jamduna [command]

Available Commands:
  gen-keys    Generate keys for validators, pls generate keys for all validators before running the node
  gen-spec    Generate new chain spec from the spec config
  help        Help about any command
  list-keys   List keys for validators
  print-spec  Generate new chain spec from the spec config
  run         Run the JAM DUNA node
  test-stf    Run the STF Validation

Flags:
  -c, --config string      Path to the config file
  -h, --help               Displays help information about the commands and flags.
  -l, --log-level string   Log level (debug, info, warn, error) (default "trace")
  -t, --temp               Use a temporary data directory, removed on exit. Conflicts with data-path
  -v, --version            Prints the version of the program.

Use "./jamduna [command] --help" for more information about a command.
```

## Run a Single Local Node

```bash
rm -rf ~/.jamduna; bin/jamduna gen-keys \
bin/jamduna run --chain chainspecs/jamduna-spec.go --dev-validator 0
```

## Launch a Local "Tiny" Testnet

```bash
rm -rf ~/.jamduna; bin/jamduna gen-keys \
for i in $(seq 0 5); do \
  bin/jamduna run --chain chainspecs/jamduna-spec.json --dev-validator "$i"  & \
done; \
```

## Shutdown All Local Nodes

```bash
pkill -f jamduna
```

# History

Nov 2024 - Dec 2025:
* initial setup of fallback/safrole datasets, now covered in [this dataset](https://github.com/davxy/jam-test-vectors/pull/45)

Feb - early March 2025:
* [0.6.2.12 Dataset](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.2.12)

Late March 2025 - Early April 2025:
* [0.6.4.4 Dataset](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.4.4)

May 2025:
* [0.6.5.2 jamduna binary](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.5.2) 


# Found an Issue?

Terrific - submit an issue with your findings!   See the [Releases](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.4.4) for how we resolved previous issues with others.   Please avoid sharing code, however, and instead use GP references and links to a specific state transition file.  We have been able solve almost all problems within 48-72 hours or raise questions in the W3F repo or [Lets JAM Matrix Room](https://matrix.to/#/#jam:polkadot.io)

