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

## State Transitions Data

Based on [JAM0 - JAM Implementers Meetup @ sub0/Devcon 7](https://forum.polkadot.network/t/jam0-jam-implementers-meetup-sub0-devcon-7-bangkok-nov-11-nov-16-2024/10866/1) we built the following datasets:

* [fallback](./data/fallback) -- The `fallback` mode does not involve any PVM execution or extrinsics.  See [Sealing Test Vectors](https://github.com/jam-duna/jamtestnet/issues/21).
* [safrole](./data/safrole) -- The `safrole` mode adds extrinsic tickets.  Here is a draft of the shape of `mode=safrole` here:
* [assurances](./data/assurances) -- The `assurances` mode adds a few tiny services (bootstrap, fib) and requires E_G, E_A, E_P extrinsics as well as a basic PVM implementation with a few host functions implemented (new, write, read).
* [orderedaccumulation](./data/orderedaccumulation) -- The `orderedaccumulation` mode uses both cores to run through simple cases of package dependencies and ordered accumulation with "fib", "trib" and "megatron" services.

Within each directory is a trace of logging activity, as generated by JAM DUNA.  This may assist in identifying discrepancies between implementations.

See [services](./services) for `bootstrap` and `fib` service code, which has been compiled with polkatool.

| `mode`                    | `fallback`|   `safrole` | `assurance` | `orderedaccumulation` | 
|---------------------------|-----------|-------------|-------------|-----------------------|
| Tickets: E_T              |           |       x     |     x       |     x      |
| Guarantees: E_G           |           |             |     x       |     x      | 
| Assurances: E_A           |           |             |     x       |     x      |
| Preimages: E_P            |           |             |     x       |     x      |
| Refine/Accumulate PVM     |           |             |     x       |     x      |
| Bootstrap Services        |           |             |     x       |     x      |
| Ordered Accumulation      |           |             |             |     x      |

As of Feb 2025, Several teams have reported success at importing both fallback and safrole.


## Fuzzed State Transitions

In additiion, inside `data` are additional "fuzzed" datasets consisting of **INVALID** state transitions:

  * [safrole/state_transitions_fuzzed](./data/safrole/state_transitions_fuzzed)
  * [assurances/state_transitions_fuzzed](./data/assurances/state_transitions_fuzzed)

StateTransition Errors are organized into 4 categories, tracking W3F official error codes and descriptions:

  * [x] **T** - Safrole Ticket Errors
  * [x] **A** - Assurances Errors
  * [ ] **G** - Guarantee & Work Reports Errors 
  * [ ] **D** - Disputes Errors

We enumerate them below.

### Safrole Ticket Errors


| Error Code | Error Name              | Description                                                          |
|-----------:|-------------------------|----------------------------------------------------------------------|
| T1         | BadTicketAttemptNumber  | Submit an extrinsic with a bad ticket attempt number.                |
| T2         | TicketAlreadyInState    | Submit one ticket already recorded in the state.                     |
| T3         | TicketsBadOrder         | Submit tickets in bad order.                                         |
| T4         | BadRingProof            | Submit tickets with a bad ring proof.                                |
| T5         | EpochLotteryOver        | Submit tickets when the epoch's lottery is over.                     |
| T6         | TimeslotNotMonotonic    | Progress from slot X to slot X. Timeslot must be strictly monotonic. |

### Assurances Errors

| Error Code | Error Name              | Description                                                    |
|-----------:|-------------------------|----------------------------------------------------------------|
| A1         | BadSignature           | One assurance has a bad signature.                              |
| A2         | BadValidatorIndex      | One assurance has a bad validator index.                        |
| A3         | BadCore                | One assurance targets a core without any assigned work report.  |
| A4         | BadParentHash          | One assurance has a bad attestation parent hash.                |
| A5         | StaleReport            | One assurance targets a core with a stale report.               |
| A6         | DuplicateAssurer       | Duplicate assurer.                                              |
| A7         | NotSortedAssurers      | Assurers not sorted.                                            |

### Guarantee & Work Reports Errors

| Error Code | Error Name                                 | Description                                                                                         |
|-----------:|--------------------------------------------|-----------------------------------------------------------------------------------------------------|
| G1         | BadCodeHash                                | Work result code hash doesn't match the one expected for the service.                               |
| G2         | BadCoreIndex                               | Core index is too big.                                                                              |
| G3         | BadSignature                               | Invalid report guarantee signature.                                                                 |
| G4         | CoreEngaged                                | A core is not available.                                                                            |
| G5         | DependencyMissing                          | Prerequisite is missing.                                                                            |
| G6         | DuplicatePackageTwoReports                 | Report contains a duplicate package (two reports from the same package).                            |
| G7         | FutureReportSlot                           | Report refers to a slot in the future with respect to container block slot.                         |
| G8         | InsufficientGuarantees                     | Report without enough guarantors' signatures.                                                       |
| G9         | DuplicateGuarantors                        | Guarantors' indices are not sorted or unique.                                                       |
| G10        | OutOfOrderGuarantee                        | Reports' cores are not sorted or unique.                                                            |
| G11        | WorkReportGasTooHigh                       | Work report per-core gas is too high.                                                               |
| G12        | ServiceItemTooLow                          | Accumulate gas is below the service minimum.                                                        |
| G13        | BadValidatorIndex                          | Validator index is too big.                                                                         |
| G14        | WrongAssignment                            | Unexpected guarantor for a work report core.                                                        |
| G15        | AnchorNotRecent                            | Context anchor is not recent enough.                                                                |
| G16        | BadBeefyMMRRoot                            | Context Beefy MMR root doesn't match the one at anchor.                                             |
| G17        | BadServiceID                               | Work result service identifier doesn't have any associated account in state.                        |
| G18        | BadStateRoot                               | Context state root doesn't match the one at anchor.                                                 |
| G19        | DuplicatePackageRecentHistory              | Package was already available in recent history.                                                    |
| G20        | ReportEpochBeforeLast                      | Report guarantee slot is too old with respect to the block slot.                                    |
| G21        | SegmentRootLookupInvalidNotRecentBlocks    | Segments tree root lookup item not found in recent blocks history.                                  |
| G22        | SegmentRootLookupInvalidUnexpectedValue    | Segments tree root lookup found in recent blocks history but with an unexpected value.              |
| G23        | CoreWithoutAuthorizer                      | Target core without any authorizer.                                                                 |
| G24        | CoreUnexpectedAuthorizer                   | Target core with an unexpected authorizer.                                                          |

### Disputes Errors

| Error Code | Error Name                          | Description                                                                                     |
|-----------:|-------------------------------------|-------------------------------------------------------------------------------------------------|
| D1         | NotSortedWorkReports                | Not sorted work reports within a verdict.                                                       |
| D2         | NotUniqueVotes                      | Not unique votes within a verdict.                                                              |
| D3         | NotSortedValidVerdicts              | Not sorted, valid verdicts.                                                                     |
| D4         | NotHomogenousJudgements             | Not homogeneous judgements; positive votes count is incorrect.                                  |
| D5         | MissingCulpritsBadVerdict           | Missing culprits for bad verdict.                                                               |
| D6         | SingleCulpritBadVerdict             | Single culprit for bad verdict.                                                                 |
| D7         | TwoCulpritsBadVerdictNotSorted      | Two culprits for bad verdict, not sorted.                                                       |
| D8         | AlreadyRecordedVerdict              | Report an already recorded verdict with culprits.                                               |
| D9         | CulpritAlreadyInOffenders           | Culprit offender already in the offenders list.                                                 |
| D10        | OffenderNotPresentVerdict           | Offender relative to a not-present verdict.                                                     |
| D11        | MissingFaultsGoodVerdict            | Missing faults for good verdict.                                                                |
| D12        | TwoFaultOffendersGoodVerdict        | Two fault offenders for a good verdict, not sorted.                                             |
| D13        | AlreadyRecordedVerdictWithFaults    | Report an already recorded verdict, with faults.                                                |
| D14        | FaultOffenderInOffendersList        | Fault offender already in the offenders list.                                                   |
| D15        | AuditorMarkedOffender               | Auditor marked as offender, but vote matches the verdict.                                       |
| D16        | BadSignatureInVerdict               | Bad signature within the verdict judgements.                                                    |
| D17        | BadSignatureInCulprits              | Bad signature within the culprits sequence.                                                     |
| D18        | AgeTooOldInVerdicts                 | Age too old for verdicts judgements.                                                            |

# JAM Network Settings

Only the following network chain specs are supported at present:

- `tiny`: [Doc Reference](https://docs.jamcha.in/basics/dev-accounts)

# Feedback?

[JAM Testnet on Telegram](https://t.me/jamtestnet)


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

Feb/March 2025:
* [0.6.2.x Dataset](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.2.9)


## JAM Implementers

Everyone must follow JAM Prize rules and can politely refuse collaboration with any team for any reason.

To contribute, submit a PR to:
- add additional state transitions: `${mode}/${team}` (e.g. `safrole/jam-duna`).  If you have a new mode, just describe it and add it
- add your service code (in any language, including privileged services).  Put it in `services/${team}/${servicename}` (e.g.  `services/strongly-web3/fib`)

## Join us on Telegram

* [JAM Testnet on Telegram](https://t.me/jamtestnet) - Public, anyone can join
