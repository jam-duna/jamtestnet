# JAM Testnet - JAMNP Test Vectors 

This describes some DRAFT **JAM Testnet** test vector files generated
by [JAM DUNA trace data](assurances.txt), representing the majority of
**JAMNP** request-response patterns as described in [JAM Simple
Networking Protocol
(JAMNP-S)](https://github.com/zdave-parity/jam-np/blob/main/simple.md).

## Status

This test vector set is not complete and is **NOT READY** for JAM
implementers to build against.  It is intended to develop a course of
action for which **JAMNP** request-response patterns and erasure
coding vectors are necessary for a [multi-team JAM tiny
testnet](https://github.com/jam-duna/jamtestnet/issues/69).

## JAMNP Request/Response Test Vectors

The table below summarizes the covered request-response types,
providing links to the test vectors and their corresponding
descriptions in
[`JAMNP spec`](https://github.com/zdave-parity/jam-np/blob/main/simple.md).

All data is for [tiny testnet](https://github.com/jam-duna/jamtestnet/issues/69)
configuration with 6 validators and 2 cores.  Data is intentionally small to support initial discussion.

| JAMNP Stream | Binary File | JSON File | Response Available? | Notes |
|--------------|-------------|-----------|---------------------|-------|
| **[UP0: Block Announcement](https://github.com/zdave-parity/jam-np/blob/main/simple.md#up-0-block-announcement)** | [BlockAnnouncement-request.bin](UP0/BlockAnnouncement-request.bin) | [BlockAnnouncement-request.json](UP0/BlockAnnouncement-request.json) | Handshake TBD |  |
| **[CE128†: Block Request](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-128-block-request)** | [BlockRequest-request.bin](CE128/BlockRequest-request.bin) | [BlockRequest-request.json](CE128/BlockRequest-request.json) | ✅ [BlockRequestBlocks-response](CE128/BlockRequestBlocks-response.bin) | † - Simplified as Direction=1 only |
| **[CE131†: Ticket Distribution](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-131132-safrole-ticket-distribution)** | [TicketDistribution-request.bin](CE131/TicketDistribution-request.bin) | [TicketDistribution-request.json](CE131/TicketDistribution-request.json) | NA | † - Simplified as "Generator" -> "all current validators" |
| **[CE133: Work Package Submission](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-133-work-package-submission)** | [WorkPackageSubmission-request.bin](CE133/WorkPackageSubmission-request.bin) | [WorkPackageSubmission-request.json](CE133/WorkPackageSubmission-request.json) | NA | Imported segments *should not* be sent. *** Potentially need slot here for cross-client testing |
| **[CE134: Work Package Share](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-134-work-package-sharing)** | [WorkPackageShare-request.bin](CE134/WorkPackageShare-request.bin) | [WorkPackageShare-request.json](CE134/WorkPackageShare-request.json) | ✅ [WorkPackageShareResponse-response](CE134/WorkPackageShareResponse-response.bin) | "Refine logic need not be executed before sharing a work-package" |
| **[CE135: Work Report Distribution](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-135-work-report-distribution)** | [WorkReportDistribution-request.bin](CE135/WorkReportDistribution-request.bin) | [WorkReportDistribution-request.json](CE135/WorkReportDistribution-request.json) | NA | Distributed to all current validators, and during the last core rotation of an epoch, additionally to all validators for the next epoch |
| **[CE137: (Full) Shard Request](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-135-work-report-distribution)** | [FullShardRequest-request.bin](CE137/FullShardRequest-request.bin) | [FullShardRequest-request.json](CE137/FullShardRequest-request.json) | ✅ [BundleShard-response](CE137/BundleShard-response.bin) [Justification-response](CE137/Justification-response.bin) |  |
| **[CE139: Segment Shard Request](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-139140-segment-shard-request)** | [SegmentShardRequest-request.bin](CE139/SegmentShardRequest-request.bin) | [SegmentShardRequest-request.json](CE139/SegmentShardRequest-request.json) | ✅ [BundleShard-response](CE139/BundleShard-response.bin) |  |
| **[CE141: Assurance Distribution](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-141-assurance-distribution)** | [AssuranceDistribution-request.bin](CE141/AssuranceDistribution-request.bin) | [AssuranceDistribution-request.json](CE141/AssuranceDistribution-request.json) | NA |  |
| **[CE142: Preimage Announcement](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-141-assurance-distribution)** | [PreimageAnnouncement-request.bin](CE142/PreimageAnnouncement-request.bin) | [PreimageAnnouncement-request.json](CE142/PreimageAnnouncement-request.json) | CE143 | Recipient is expected to follow up with CE143 |
| **[CE143: Preimage Request](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-141-assurance-distribution)** | [PreimageRequest-request.bin](CE143/PreimageRequest-request.bin) | [PreimageRequest-request.json](CE143/PreimageRequest-request.json) | ✅ [PreimageRequest-response](CE143/PreimageRequest-response.bin) |  |

**Requests** are fully represented in `.bin` and `.json` formats, whereas  **Responses** are applicable for only a subset of requests.

All the above are believed to be essential for a basic [**tiny** JAM
testnet](https://github.com/jam-duna/jamtestnet/issues/69) with 6
nodes participating in core block authoring, guaranteeing and assuring
processes.  Once this is achieved, a **small** JAM testnet can be
sought.

The following JAMNP test vectors are _out of scope_ and believed to be unnecessary in the tiny JAM Testnets but is necessary for comprehensive test vector coverage:

* [CE 129: State request](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-131132-safrole-ticket-distribution)
* [CE 132: Safrole ticket distribution](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-131132-safrole-ticket-distribution) ("proxy" validator -> all current validators; similar to CE131)
* [CE 136: Work-report request](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-136-work-report-request)
* [CE 138: Audit shard request](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-138-audit-shard-request)
* [CE 140: Segment shard request](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-139140-segment-shard-request) (with justification; similar to CE139)
* [CE 144: Audit announcement](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-141-assurance-distribution)
* [CE 145: Judgment publication](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-145-judgment-publication)

We recommend these be added in early Summer after a working tiny and
small testnet is achieved, and as teams implement Auditing,
Disputes/Judgement and GRANDPA within those same networks.  Additional
CE vectors would be expected for GRANDPA and potentially BEEFY.

## Tiny + Small Erasure Coding Test Vectors 

A Schelling point can be established within JAM implementer community
by using the [Parity Rust RS SIMD
code](https://github.com/paritytech/erasure-coding) library
(acceptable according to [Rule 1](https://jam.web3.foundation/rules)),
and adapting as required to [tiny+small chain
specs](https://github.com/jam-duna/jamtestnet/blob/main/chainspecs.json#L2-L25),
as the Appendix H only is complete
[full](https://github.com/jam-duna/jamtestnet/blob/main/chainspecs.json#L85-L95).

Test vectors in the style of [erasure coding test
vectors](https://github.com/w3f/jamtestvectors/pull/4/files) are
natural to be developed and folded into the above JAMNP test vectors
in:

* `erasure_coding/vectors/tiny`
* `erasure_coding/vectors/small`

The above JAMNP Test vector do NOT conform to this Parity Rust RS SIMD code.

If you wish to contribute to the development of these test vectors,
please join the [JAM Testnet Telegram group](https://t.me/jamtestnet)




