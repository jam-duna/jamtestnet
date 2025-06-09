# JAM DUNA Releases

[JAM](https://jam.web3.foundation/) is the anticipated future protocol for Polkadot, being implemented by multiple teams across different programming languages. The [JAM Gray Paper](https://graypaper.com/) outlines the protocol, and the Web3 Foundation has shared initial test vectors with participating teams [here](https://github.com/w3f/jamtestvectors).

This repo contains the latest `jamduna` binaries (Linux + Mac) targeting 0.6.5 and how to get a multiclient **tiny** testnet going.

## Status

Current release is 0.6.5.x -- the `jamduna` binary can do fallback + safrole with both `polkajam` and `javajam` in tiny testnets.  We have gotten first work report hash to match (CE137) as well with 3-way guaranteeing!  Working together, we expect assuring and auditing followed by 0.6.7 compliance. 

## Launch a Local MULTI-CLIENT "Tiny" Testnet

The approach is Makefile based.  To launch a 6 client testnet with THREE clients:

1. Get the latest binaries from 3 clients:
   - [jamduna](https://github.com/jam-duna/jamtestnet) [Go]
   - [polkajam](https://github.com/paritytech/polkajam-releases/releases) [Rust]
   - [javajam](https://github.com/javajamio/javajam-releases) [Java] 
2. Do `make runtiny` 
3. To shut down `make kill`

Our testing has been on Mac with [jamduna-spec.json](conf/jamduna-spec.json).

## JAM DUNA Guide

For the `jamduna` binary, we attempted to match that of `polkajam` and request that other teams match this closely.

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
  -l, --log-level string   Log level (trace, debug, info, warn, error) (default "debug")
  -t, --temp               Use a temporary data directory, removed on exit. Conflicts with data-path
  -v, --version            Prints the version of the program.

Use "./jamduna [command] --help" for more information about a command.
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

June 2025:
* Multiclient JAM Testnet with polkajam, javajam and others.  

# Got JAM?  Lets JAM!

Terrific - please let everyone know in [Lets JAM Matrix Room](https://matrix.to/#/#jam:polkadot.io)
