# JAM Testnet 

[JAM](https://jam.web3.foundation/) is the anticipated future protocol for Polkadot, being implemented by multiple teams across different programming languages. The [JAM Gray Paper](https://graypaper.com/) outlines the protocol, and the Web3 Foundation has shared initial test vectors with participating teams [here](https://github.com/w3f/jamtestvectors).

This repository serves as a collaborative space for teams to develop and test JAM Testnets independently and work towards cross-team compatibility in the JAM Toaster.   See [docs.jamcha.in](https://docs.jamcha.in/). 

## Dev Accounts, Chain specs, Genesis States

### Dev Accounts

To support testing in a wide variety of network sizes from "tiny"
(V=6) to "full" (V=1023), we follow the W3F test vectors in having
public secret keys derived deterministically from publicly known
seeds for Ed25519, Bandersnatch, and BLS keys.

Using these seeds, secret and public keys can be programmatically generated, ensuring each JAM team can run the public testnet consistently. This is strictly for development purposes.

An open-source `key` program is used to map seeds into  Bandersnatch/Ed25519/BLS secret and public keys.  See [here](./key) showing how to map any seed.

See [Dev Accounts](https://docs.jamcha.in/basics/dev-accounts) 32-byte seeds.

### Chain Specs

Chain specs for 8 network sizes have been modeled and published.
* [jamtestnet (JSON)](./chainspecs.json)
* [docs.jamcha.in](https://docs.jamcha.in/basics/chain-spec)
* [JAM Chain specs (Google Sheets)](https://docs.google.com/spreadsheets/d/1ueAisCMOx7B-m_fXMLT0FXBxfVzydJyr-udE8jKwDN8/edit?gid=615049643#gid=615049643)

## State Transition Test Vectors

Sharing excerpts of blockchain state and validating state transitions is a valuable prerequisite before 2 or more teams can set up a JAM Testnet.

By using a public genesis state, teams can collaborate by sharing state transitions (pre-state, block, post-state). This allows for verifying that different implementations can read key objects and
perform the identical state transitions in accordance with the GP Spec and prepare to pass "M1 Import Blocks".

* blocks: `$epoch_$phase.json`  `$epoch_$phase.bin` -- follows [w3f block test vectors](https://github.com/w3f/jamtestvectors/blob/master/codec/data/block.json)
* state_snapshots: `$epoch_$phase.json`  `$epoch_$phase.bin` -- JSON + Codec developer-friendly states following [w3f STF test vectors](https://github.com/w3f/jamtestvectors/tree/master/safrole/tiny)
* state_transitions: `$epoch_$phase.json`  `$epoch_$phase.bin` --  JSON + Codec machine-friendly state transitions

In Go:
```
type StateTransition struct {
	PreState  StateSnapshotRaw `json:"pre_state"`
	Block     Block            `json:"block"`
	PostState StateSnapshotRaw `json:"post_state"`
}

type StateSnapshotRaw struct {
	StateRoot common.Hash `json:"state_root"`
	KeyVals   KeyVals     `json:"keyvals"`
}

type KeyVals []KeyVal
type KeyVal [2][]byte
```

The combination of JSON + codec is useful for debugging purposes.

Here is a sample output:
```
# ls safrole/blocks/
407402_000.bin   407402_004.bin   407402_008.bin   407403_000.bin   407403_004.bin   407403_008.bin   407404_000.bin   407404_004.bin   407404_008.bin   407405_000.bin   407405_004.bin   407405_008.bin   407406_000.bin
407402_000.json  407402_004.json  407402_008.json  407403_000.json  407403_004.json  407403_008.json  407404_000.json  407404_004.json  407404_008.json  407405_000.json  407405_004.json  407405_008.json  407406_000.json
407402_001.bin   407402_005.bin   407402_009.bin   407403_001.bin   407403_005.bin   407403_009.bin   407404_001.bin   407404_005.bin   407404_009.bin   407405_001.bin   407405_005.bin   407405_009.bin   407406_001.bin
407402_001.json  407402_005.json  407402_009.json  407403_001.json  407403_005.json  407403_009.json  407404_001.json  407404_005.json  407404_009.json  407405_001.json  407405_005.json  407405_009.json  407406_001.json
407402_002.bin   407402_006.bin   407402_010.bin   407403_002.bin   407403_006.bin   407403_010.bin   407404_002.bin   407404_006.bin   407404_010.bin   407405_002.bin   407405_006.bin   407405_010.bin
407402_002.json  407402_006.json  407402_010.json  407403_002.json  407403_006.json  407403_010.json  407404_002.json  407404_006.json  407404_010.json  407405_002.json  407405_006.json  407405_010.json
407402_003.bin   407402_007.bin   407402_011.bin   407403_003.bin   407403_007.bin   407403_011.bin   407404_003.bin   407404_007.bin   407404_011.bin   407405_003.bin   407405_007.bin   407405_011.bin
407402_003.json  407402_007.json  407402_011.json  407403_003.json  407403_007.json  407403_011.json  407404_003.json  407404_007.json  407404_011.json  407405_003.json  407405_007.json  407405_011.json

# ls safrole/state_snapshots/
407402_000.bin   407402_004.bin   407402_008.bin   407403_000.bin   407403_004.bin   407403_008.bin   407404_000.bin   407404_004.bin   407404_008.bin   407405_000.bin   407405_004.bin   407405_008.bin   407406_000.bin
407402_000.json  407402_004.json  407402_008.json  407403_000.json  407403_004.json  407403_008.json  407404_000.json  407404_004.json  407404_008.json  407405_000.json  407405_004.json  407405_008.json  407406_000.json
407402_001.bin   407402_005.bin   407402_009.bin   407403_001.bin   407403_005.bin   407403_009.bin   407404_001.bin   407404_005.bin   407404_009.bin   407405_001.bin   407405_005.bin   407405_009.bin   407406_001.bin
407402_001.json  407402_005.json  407402_009.json  407403_001.json  407403_005.json  407403_009.json  407404_001.json  407404_005.json  407404_009.json  407405_001.json  407405_005.json  407405_009.json  407406_001.json
407402_002.bin   407402_006.bin   407402_010.bin   407403_002.bin   407403_006.bin   407403_010.bin   407404_002.bin   407404_006.bin   407404_010.bin   407405_002.bin   407405_006.bin   407405_010.bin
407402_002.json  407402_006.json  407402_010.json  407403_002.json  407403_006.json  407403_010.json  407404_002.json  407404_006.json  407404_010.json  407405_002.json  407405_006.json  407405_010.json
407402_003.bin   407402_007.bin   407402_011.bin   407403_003.bin   407403_007.bin   407403_011.bin   407404_003.bin   407404_007.bin   407404_011.bin   407405_003.bin   407405_007.bin   407405_011.bin
407402_003.json  407402_007.json  407402_011.json  407403_003.json  407403_007.json  407403_011.json  407404_003.json  407404_007.json  407404_011.json  407405_003.json  407405_007.json  407405_011.json

# ls safrole/state_transitions/
407402_000.bin   407402_004.bin   407402_008.bin   407403_000.bin   407403_004.bin   407403_008.bin   407404_000.bin   407404_004.bin   407404_008.bin   407405_000.bin   407405_004.bin   407405_008.bin   407406_000.bin
407402_000.json  407402_004.json  407402_008.json  407403_000.json  407403_004.json  407403_008.json  407404_000.json  407404_004.json  407404_008.json  407405_000.json  407405_004.json  407405_008.json  407406_000.json
407402_001.bin   407402_005.bin   407402_009.bin   407403_001.bin   407403_005.bin   407403_009.bin   407404_001.bin   407404_005.bin   407404_009.bin   407405_001.bin   407405_005.bin   407405_009.bin
407402_001.json  407402_005.json  407402_009.json  407403_001.json  407403_005.json  407403_009.json  407404_001.json  407404_005.json  407404_009.json  407405_001.json  407405_005.json  407405_009.json
407402_002.bin   407402_006.bin   407402_010.bin   407403_002.bin   407403_006.bin   407403_010.bin   407404_002.bin   407404_006.bin   407404_010.bin   407405_002.bin   407405_006.bin   407405_010.bin
407402_002.json  407402_006.json  407402_010.json  407403_002.json  407403_006.json  407403_010.json  407404_002.json  407404_006.json  407404_010.json  407405_002.json  407405_006.json  407405_010.json
407402_003.bin   407402_007.bin   407402_011.bin   407403_003.bin   407403_007.bin   407403_011.bin   407404_003.bin   407404_007.bin   407404_011.bin   407405_003.bin   407405_007.bin   407405_011.bin
407402_003.json  407402_007.json  407402_011.json  407403_003.json  407403_007.json  407403_011.json  407404_003.json  407404_007.json  407404_011.json  407405_003.json  407405_007.json  407405_011.json
```

## Import Blocks 

Based on [JAM0 - JAM Implementers Meetup @ sub0/Devcon 7](https://forum.polkadot.network/t/jam0-jam-implementers-meetup-sub0-devcon-7-bangkok-nov-11-nov-16-2024/10866/1) we built a [importblocks](importblocks) with support for 4 different modes:

* [fallback](./fallback)
* [safrole](./safrole)
* [assurances](./assurances)
* [orderedaccumulation](./orderedaccumulation)


| `mode`                    | `fallback`|   `safrole` | `assurance` | `orderedaccumulation` | 
|---------------------------|-----------|-------------|-------------|-----------------------|
| Tickets: E_T              |           |       x     |     x       |     x      |
| Guarantees: E_G           |           |             |     x       |     x      | 
| Assurances: E_A           |           |             |     x       |     x      |
| Preimages: E_P            |           |             |     x       |     x      |
| Refine/Accumulate PVM     |           |             |     x       |     x      |
| Bootstrap Services        |           |             |     x       |     x      |
| Ordered Accumulation      |           |             |             |     x      |

The importblocks tool is documented [here](./importblocks).  

### `fallback`

The `fallback` mode does not involve any PVM execution or extrinsics.  See [Sealing Test Vectors](https://github.com/jam-duna/jamtestnet/issues/21).

See [fallback.txt](./fallback/fallback.txt) for execution.

### `safrole`

The `safrole` mode adds extrinsic tickets.  Here is a draft of the shape of `mode=safrole` here:

* [JAM Safrole Model](https://docs.google.com/spreadsheets/d/1ueAisCMOx7B-m_fXMLT0FXBxfVzydJyr-udE8jKwDN8/edit?gid=615049643#gid=615049643)

See [safrole.txt](./safrole/safrole.txt) for execution.

### `assurances`

The `assurances` mode adds a few tiny services (bootstrap, fib) and requires E_G, E_A, E_P extrinsics as well as a basic PVM implementation with a few host functions implemented.

See [services](./services) for `bootstrap` and `fib` code.

See [assurances.txt](./safrole/safrole.txt) for execution.

### `orderedaccumulation`

The `orderedaccumulation` mode uses both cores to run through simple cases of package dependencies and ordered accumulation with "trib" and "megatron" services.

### JAM DUNA 

Nov 2024:
* added fallback based on JAM0 meeting
* genesis state fixes [thanks to Daniel from Jamixir] 
* made the phases 3 digits (000, 001, ... 011) rather than variable (0, 1, .. 11) [thank you Boy Maas]
* fixed parent hash to be header hash rather than block hash [thank you Arjan, PyJAMaz]

Dec 2024:
* mode=orderedaccumulation added (C14+C15)
* C3 Recent Blocks support consistent with E.2 0.5.2 Beefy root and w3f STF reports test vectors 
* 64-bit PVM support with [new opcodes](https://docs.google.com/spreadsheets/d/1R7syeL7GYq4KH2B3Zh03v3CAFnK1iNNF0J4c2r-vKWw/edit?gid=1743195954#gid=1743195954) (with 96% coverage (see [community test vectors](https://github.com/FluffyLabs/jamtestvectors/pull/5)))
* state_transitions output with service k,v metadata

Feb 2025:
* [0.6.1 Traces](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.1.0)
* [0.6.1 importblocks](importblocks)

## JAM Implementers

Everyone must follow JAM Prize rules and can politely refuse collaboration with any team for any reason.

To contribute, submit a PR to:
- add additional state transitions: `${mode}/${team}` (e.g. `safrole/jam-duna`).  If you have a new mode, just describe it and add it
- add your service code (in any language, including privileged services).  Put it in `services/${team}/${servicename}` (e.g.  `services/strongly-web3/fib`)

## Join us on Telegram + Matrix/Element

* [JAM Testnet on Telegram](https://t.me/jamtestnet) - Public, anyone can join
* [JAM0 on Matrix/Element](https://docs.google.com/spreadsheets/d/1_Ar0CWH8cDq_mAoVkqZ20fXjfNQQ9ziv1jsVJBAfd1c/edit?gid=0#gid=0) - Private, ask for an invite from a fellow JAM Implementer (e.g. @sourabhniyogi)
