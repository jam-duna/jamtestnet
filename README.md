# JAM TestNet

[JAM](https://jam.web3.foundation/) is the expected future protocol for Polkadot and is being implemented by dozens of teams in a variety of languages.  The [JAM Gray paper](https://graypaper.com/) details the protocol, and initial test vectors have been shared with teams by Web3 Foundation.  

This repo is for teams to collaborate in getting working JAM TestNets, on their own at first and then compatible with each other.  

The way it works at present
* *JAM Binaries*: Each team submits a binary into the `bin` directory within a subfolder.  Each binary should be able to read "basic" arguments concerning genesis state an in the same way.

```
jam --ts 1727976792 --port=9005 --validatorindex=5 --genesis=genesis.json --datadir /tmp/node5
```

* *JAM TestNet is spawned*:  A local testnet is spawned with `jamtestnet --config=tiny.toml` using a TOML file that launches `V` binaries, with each binary representing a single validator.  Within the config of the testnet is information to spawn all validators. We are starting with [tiny.toml](./tiny.toml) and a [genesis.json](./genesis.json) with V=6 validators.  All genesis validators have secret keys deterministically derived from publicly known seeds (0x00...00 through 00x00..05) for Ed25519, Bandersnatch, and BLS Keys.  See below.

* *JAM Validators run!*: Each binary uses JAMNP's QUIC to share tickets, blocks and reach consensus.  At this point, we are not aiming for Guaranteeing, Assuring, Auditing and Preimages -- or finalization, GRANDPA or BEEFY -- only ticket sharing and basic block authoring.  Each validator should output logs to stdout with a date/time in ISO form a JSON blob (starting with `{` for objects, `[` for arrays) _and_ then a JAM codec in hex string form (with 0x prefix) for:
 - blocks: (a) after authoring and broadcasting a block to V-1 validators (b) when receiving a block
 - tickets: after broadcasting a ticket

* *JAM Network is shutdown*: A kill signal on `jamtestnet` should shut down all the validators

## Build

This will build the `jamtestnet` binary that spawns a JAM testnet using a TOML config file:

```
make jamtestnet
```

## Spawn the TestNet


This will spawn the testnet:

```
./jamtestnet --config=tiny.toml --delay=12
```

Each of the binaries should log their blocks and tickets.

## TestNet Configurations

`tiny.toml`:
  - `V`=6: # of validators.
  - `C`=2: # of cores.
  - `E`=12: The length of an epoch in timeslots.
  - `P`=6: The slot period, in seconds.
  - `Y`=8: The number of slots into an epoch at which ticket-submission ends.

It is not possible to have `full` (V=1023, C=341) running locally but we would expect to be able to increase to:
* `small.toml` (V=9, C=3)
* `medium.toml` (V=12, C=4)
* `large.toml` (V=15, C=5)
* `xlarge.toml` (V=18, C=6)
* `xxlarge.toml` (V=21, C=7)
* `xxxlarge.toml` (V=24, C=8)
with a greater number of validators and cores.

## JAM Binary Submission

Fork this repo and submit a PR.  This approach depends on teams supplying binaries rather than
compiling from source.  The PR should:
- adjust `Makefile` to to wget/curl fetch your teams binary into `bin/${YOURTEAM}/${BINARY}`
- adjust `.gitignore` to reference the expected location of your binary

Please use a team name and binary name that is identical or very
similar to that of [clients list](https://jamcha.in/clients).

Important: Every team should vet every other team for trustworthiness and
exercise suitable precaution.  Do not run testnets ONLY on machines
connected to any critical infrastructure.  

## JAM Binary arguments

```
Usage: jam [options]
  -bandersnatch string
    	Bandersnatch Seed (only for development)
  -bls string
    	BLS Seed (only for development)
  -datadir string
    	Specifies the directory for the blockchain, keystore, and other data.
  -ed25519 string
    	Ed25519 Seed (only for development)
  -genesis string
    	Specifies the genesis state json file.
  -metadata string
    	Node metadata (default "Alice")
  -port int
    	Specifies the network listening port. (default 9900)
  -ts int
    	Epoch0 Unix timestamp (will override genesis config)
  -validatorindex int
    	Validator Index (only for development)
```

To make every node start their validators "at the same time" there is
a single parameter `ts` that has a UNIX timestamp.  The `jamtestnet` can programmatically generate and supply this input.  In particular the `tiny.toml` shows a set of macros usable 
* `TIMESTAMP`  - the time at which nodes can expect the first epoch to start after a fixed delay while binaries are bing launched
* `VALIDATORINDEX` - the integer index within a validator set (0...V-1)
* `NODENAME" - a string to 

## Sharable Logs

TBD


## Genesis: Public Secret Keys

The basic strategy is to have `V` 32-byte seeds (0x00....00 through
0x00..05 for tiny `V`=6) generate secret keys and public keys
programmatically, and have a programmatically `genesis.json` that
every JAM team can run their own `tiny.toml` on their own.  This is
for development purposes only.


### Ed25519

```
--Seed: 0000000000000000000000000000000000000000000000000000000000000000
Secret: 00000000000000000000000000000000000000000000000000000000000000003b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29
Public: 3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29

--Seed: 0000000000000000000000000000000000000000000000000000000000000001
Secret: 00000000000000000000000000000000000000000000000000000000000000014cb5abf6ad79fbf5abbccafcc269d85cd2651ed4b885b5869f241aedf0a5ba29
Public: 4cb5abf6ad79fbf5abbccafcc269d85cd2651ed4b885b5869f241aedf0a5ba29

--Seed: 0000000000000000000000000000000000000000000000000000000000000002
Secret: 00000000000000000000000000000000000000000000000000000000000000027422b9887598068e32c4448a949adb290d0f4e35b9e01b0ee5f1a1e600fe2674
Public: 7422b9887598068e32c4448a949adb290d0f4e35b9e01b0ee5f1a1e600fe2674

--Seed: 0000000000000000000000000000000000000000000000000000000000000003
Secret: 0000000000000000000000000000000000000000000000000000000000000003f381626e41e7027ea431bfe3009e94bdd25a746beec468948d6c3c7c5dc9a54b
Public: f381626e41e7027ea431bfe3009e94bdd25a746beec468948d6c3c7c5dc9a54b

--Seed: 0000000000000000000000000000000000000000000000000000000000000004
Secret: 0000000000000000000000000000000000000000000000000000000000000004fd50b8e3b144ea244fbf7737f550bc8dd0c2650bbc1aada833ca17ff8dbf329b
Public: fd50b8e3b144ea244fbf7737f550bc8dd0c2650bbc1aada833ca17ff8dbf329b

--Seed: 0000000000000000000000000000000000000000000000000000000000000005
Secret: 0000000000000000000000000000000000000000000000000000000000000005fde4fba030ad002f7c2f7d4c331f49d13fb0ec747eceebec634f1ff4cbca9def
Public: fde4fba030ad002f7c2f7d4c331f49d13fb0ec747eceebec634f1ff4cbca9def
```

### Bandersnatch

TODO: map the same seeds above (in Rust) to Bandersnatch Public keys

### BLS

TODO: map the same seeds above (in Rust) to BLS-12 Public keys (G1 + G2)


# JAM Testnet Roadmap

Here is a 6-9 month plan of how teams can execute together:

* Q4 2024: We hope 5-10 teams can succeed on their own in Q4 and begin collaborating each other at sub0@Devcon7+JAM0 in mid-November.
* Q1 2024: We hope a similar number of teams can run through guaranteeing, assuring and auditing with preimages with a small battery of work packages.  We imagine M1 test vectors would be available at this time for teams to test against as well.  
* Q2 2024: We hope a similar number of teams can finalize with GRANDPA and BEEFY, use BLS and reach conformed



