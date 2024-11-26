
# Traces 

Sharing traces of blockchain state is a valuable prerequisite before 2 or more teams can set up a tiny JAM Testnet, to ensure both team can validate
each others state transitions (including state roots) and check each others JAM codec encoding/decoding abilities.  


If your team has a sequence of Blocks + States, please submit a PR going into this directory, containing at minimum easily parsed / decoded files for each `epoch` and $phase`

* Blocks: `$epoch_$phase.json`  `$epoch_$phase.bin` 
* States: `$epoch_$phase.json`  `$epoch_$phase.bin`

The combination of JSON + codec is useful for debugging purposes.

Here is a sample output:
```
# ls safrole/jam_duna/blocks/
395479_000.bin   395479_004.bin   395479_008.bin   395480_000.bin   395480_004.bin   395480_008.bin   395481_000.bin   395481_004.bin   395481_008.bin   395482_000.bin   395482_004.bin   395482_008.bin   395483_000.bin
395479_000.json  395479_004.json  395479_008.json  395480_000.json  395480_004.json  395480_008.json  395481_000.json  395481_004.json  395481_008.json  395482_000.json  395482_004.json  395482_008.json  395483_000.json
395479_001.bin   395479_005.bin   395479_009.bin   395480_001.bin   395480_005.bin   395480_009.bin   395481_001.bin   395481_005.bin   395481_009.bin   395482_001.bin   395482_005.bin   395482_009.bin   395483_001.bin
395479_001.json  395479_005.json  395479_009.json  395480_001.json  395480_005.json  395480_009.json  395481_001.json  395481_005.json  395481_009.json  395482_001.json  395482_005.json  395482_009.json  395483_001.json
395479_002.bin   395479_006.bin   395479_010.bin   395480_002.bin   395480_006.bin   395480_010.bin   395481_002.bin   395481_006.bin   395481_010.bin   395482_002.bin   395482_006.bin   395482_010.bin
395479_002.json  395479_006.json  395479_010.json  395480_002.json  395480_006.json  395480_010.json  395481_002.json  395481_006.json  395481_010.json  395482_002.json  395482_006.json  395482_010.json
395479_003.bin   395479_007.bin   395479_011.bin   395480_003.bin   395480_007.bin   395480_011.bin   395481_003.bin   395481_007.bin   395481_011.bin   395482_003.bin   395482_007.bin   395482_011.bin
395479_003.json  395479_007.json  395479_011.json  395480_003.json  395480_007.json  395480_011.json  395481_003.json  395481_007.json  395481_011.json  395482_003.json  395482_007.json  395482_011.json
# ls safrole/jam_duna/state_snapshots
395479_000.bin   395479_004.bin   395479_008.bin   395480_000.bin   395480_004.bin   395480_008.bin   395481_000.bin   395481_004.bin   395481_008.bin   395482_000.bin   395482_004.bin   395482_008.bin   395483_000.bin
395479_000.json  395479_004.json  395479_008.json  395480_000.json  395480_004.json  395480_008.json  395481_000.json  395481_004.json  395481_008.json  395482_000.json  395482_004.json  395482_008.json  395483_000.json
395479_001.bin   395479_005.bin   395479_009.bin   395480_001.bin   395480_005.bin   395480_009.bin   395481_001.bin   395481_005.bin   395481_009.bin   395482_001.bin   395482_005.bin   395482_009.bin   395483_001.bin
395479_001.json  395479_005.json  395479_009.json  395480_001.json  395480_005.json  395480_009.json  395481_001.json  395481_005.json  395481_009.json  395482_001.json  395482_005.json  395482_009.json  395483_001.json
395479_002.bin   395479_006.bin   395479_010.bin   395480_002.bin   395480_006.bin   395480_010.bin   395481_002.bin   395481_006.bin   395481_010.bin   395482_002.bin   395482_006.bin   395482_010.bin   genesis.bin
395479_002.json  395479_006.json  395479_010.json  395480_002.json  395480_006.json  395480_010.json  395481_002.json  395481_006.json  395481_010.json  395482_002.json  395482_006.json  395482_010.json  genesis.json
395479_003.bin   395479_007.bin   395479_011.bin   395480_003.bin   395480_007.bin   395480_011.bin   395481_003.bin   395481_007.bin   395481_011.bin   395482_003.bin   395482_007.bin   395482_011.bin
395479_003.json  395479_007.json  395479_011.json  395480_003.json  395480_007.json  395480_011.json  395481_003.json  395481_007.json  395481_011.json  395482_003.json  395482_007.json  395482_011.json
# ls safrole/jam_duna/traces
395479_000.bin   395479_004.bin   395479_008.bin   395480_000.bin   395480_004.bin   395480_008.bin   395481_000.bin   395481_004.bin   395481_008.bin   395482_000.bin   395482_004.bin   395482_008.bin   395483_000.bin
395479_000.json  395479_004.json  395479_008.json  395480_000.json  395480_004.json  395480_008.json  395481_000.json  395481_004.json  395481_008.json  395482_000.json  395482_004.json  395482_008.json  395483_000.json
395479_001.bin   395479_005.bin   395479_009.bin   395480_001.bin   395480_005.bin   395480_009.bin   395481_001.bin   395481_005.bin   395481_009.bin   395482_001.bin   395482_005.bin   395482_009.bin   395483_001.bin
395479_001.json  395479_005.json  395479_009.json  395480_001.json  395480_005.json  395480_009.json  395481_001.json  395481_005.json  395481_009.json  395482_001.json  395482_005.json  395482_009.json  395483_001.json
395479_002.bin   395479_006.bin   395479_010.bin   395480_002.bin   395480_006.bin   395480_010.bin   395481_002.bin   395481_006.bin   395481_010.bin   395482_002.bin   395482_006.bin   395482_010.bin   genesis.bin
395479_002.json  395479_006.json  395479_010.json  395480_002.json  395480_006.json  395480_010.json  395481_002.json  395481_006.json  395481_010.json  395482_002.json  395482_006.json  395482_010.json  genesis.json
395479_003.bin   395479_007.bin   395479_011.bin   395480_003.bin   395480_007.bin   395480_011.bin   395481_003.bin   395481_007.bin   395481_011.bin   395482_003.bin   395482_007.bin   395482_011.bin
395479_003.json  395479_007.json  395479_011.json  395480_003.json  395480_007.json  395480_011.json  395481_003.json  395481_007.json  395481_011.json  395482_003.json  395482_007.json  395482_011.json
```

Teams should be able to take a directory of `$mode/$TEAM_NAME/blocks` and:
- read a genesis state `genesis.json` for the `$mode`
- read blocks/*.bin and decode all blocks successfully with the JAM Codec
- validate each block, checking the stateroot and block hash at a minimum

Here is a sample run of a `validatetraces` that does the above:
```
# ./validatetraces ~/jam-duna/jamtestnet/traces/assurances/jam_duna
VALIDATED Block 349462_0.bin => State 349462_0.bin | [N3] H_t=4193544 H_r=0910..b69d  EpochMarker(η1=151f..3ead)
VALIDATED Block 349462_1.bin => State 349462_1.bin | [N3] H_t=4193545 H_r=27d0..5869   |E_T|=3
VALIDATED Block 349462_2.bin => State 349462_2.bin | [N2] H_t=4193546 H_r=6413..540d   |E_T|=3
VALIDATED Block 349462_3.bin => State 349462_3.bin | [N1] H_t=4193547 H_r=134b..f686   |E_T|=3  |E_G|=1
VALIDATED Block 349462_4.bin => State 349462_4.bin | [N4] H_t=4193548 H_r=4329..66d0   |E_T|=3  |E_A|=5
VALIDATED Block 349462_5.bin => State 349462_5.bin | [N2] H_t=4193549 H_r=5c46..e964   |E_T|=3
VALIDATED Block 349462_6.bin => State 349462_6.bin | [N1] H_t=4193550 H_r=4aaa..94e2   |E_T|=3
VALIDATED Block 349462_7.bin => State 349462_7.bin | [N1] H_t=4193551 H_r=9f96..ceb4 
VALIDATED Block 349462_8.bin => State 349462_8.bin | [N1] H_t=4193552 H_r=3e82..7b05 
VALIDATED Block 349462_9.bin => State 349462_9.bin | [N3] H_t=4193553 H_r=5838..d51c 
VALIDATED Block 349462_10.bin => State 349462_10.bin | [N3] H_t=4193554 H_r=f300..38c6   WinningTickets(12)
VALIDATED Block 349462_11.bin => State 349462_11.bin | [N5] H_t=4193555 H_r=111d..3ca5 
Trace validation completed successfully.
```

Note that JAM codec versions are used, not JSON files.  JSON files are
provided for debugging only.  In particular, JSON object attribute
names to be as close as possible to w3f `codec` test vectors.
However, different teams are likely to choose slightly different JSON
attribute names for some state variables outside the test vectors, so
validation between two teams should be based on the JAM codec files
instead of the JSON content.

## States

Both a "human-readable" JSON representation and "machine-readable" JAM Codec for the genesis state _and_ all subsequent states should be included:
* `traces` has the machine-readable state, where key-value follows [GP here](https://graypaper.fluffylabs.dev/#/293bf5a/33be0033be00)
* `state_snapshots` has the human-reasonable state, following the attribute names from the [codec testvectors] as closely as possible

C1-C15 coverage and a small number of service keys (δ, a_s, a_p, a_l) -- the latter is not easily distinguishable without teams adding additional metadata.  We all do so though with a little extra work though.


## Modes

* For mode `fallback`, no tickets are included.
* For mode `safrole`, only the first 4 epochs are useful or needed following this [JAM Safrole Model](https://docs.google.com/spreadsheets/d/1ueAisCMOx7B-m_fXMLT0FXBxfVzydJyr-udE8jKwDN8/edit?gid=615049643#gid=615049643)
* For mode `assurance`, `finality`, and `conformance` additional epochs may be required using sample work packages.
* Additional modes can be added between based on JAM implementer community interest.

## Team Notes

Once you have a trace that you think others should validate, submit a PR!

This is a PoC at this point and any team submission should not be taken as authoritative in any way.  

### JAM DUNA 

Nov 2024:
* added fallback based on JAM0 meeting
* genesis state fixes [thanks to Daniel from Jamixir] 
* made the phases 3 digits (000, 001, ... 011) rather than variable (0, 1, .. 11) [thank you Boy Maas]
* fixed parent hash to be header hash rather than block hash [thank you Arjan, PyJAMaz]

In progress: C14+C15 (Ordered Accumulation), 64-bit PVM, [jamblocks](https://hackmd.io/nk0Tr0iIQHmLm7WIXe_OoQ)

## Join us on Telegram + Matrix/Element

* [JAM Testnet on Telegram](https://t.me/jamtestnet) - Public, anyone can join
* [JAM0 on Matrix/Element](https://docs.google.com/spreadsheets/d/1_Ar0CWH8cDq_mAoVkqZ20fXjfNQQ9ziv1jsVJBAfd1c/edit?gid=0#gid=0) - Private, ask for an invite from a fellow JAM Implementer
