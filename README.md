# JAM TestNet

[JAM](https://jam.web3.foundation/) is the anticipated future protocol for Polkadot, being implemented by multiple teams across different programming languages. The [JAM Gray Paper](https://graypaper.com/) outlines the protocol, and the Web3 Foundation has shared initial test vectors with participating teams.

This repository serves as a collaborative space for teams to develop and test JAM TestNets independently and eventually work towards cross-team compatibility. As of October 2024, this project is in the ideation-to-Proof-of-Concept (PoC) stage.

## How It Works

### JAM Docker Images

Each team is responsible for submitting a Docker image, following the [build instructions](./DOCKER.md). The Docker image should run a binary that accepts the following parameters:

- **`validatorindex`** (required): Index ranging from 0 to `V-1`.
- **`ts`** (optional): Unix timestamp for when the validator starts. If not provided, the binary should default to the next timestamp that's a multiple of 12 seconds from the point of launch.
- **`port`** (optional): Port on which the validator should run. Defaults to _9000_ if not provided.
- **`mode`** (optional): Operating mode for the validator. Defaults to `safrole`. Other available modes are `assurance`, `finality`, and `conformance`.

### JAM TestNet Deployment

A JAM TestNet can be spawned using a [docker-compose.yml](./docker-compose.yml) file. This file launches `V` Docker images using the following command:

```bash
docker-compose up
```

Each Docker image represents a single validator, all sharing a common [genesis.json](./genesis.json). This configuration is based on a "tiny" setup, which is a simplified version of the "full" configuration outlined in the Gray Paper:

- `V` = 6: Number of validators.
- `C` = 2: Number of cores.
- `E` = 12: Length of an epoch in timeslots.
- `P` = 6: Slot period, in seconds.
- `Y` = 10: Number of slots into an epoch at which ticket-submission ends.

## Genesis: Public Secret Keys

All genesis validators derive their secret keys deterministically from publicly known seeds (0x00...00 through 0x00...05) for Ed25519, Bandersnatch, and BLS keys.

The strategy is to use a public `genesis.json` with public `V` 32-byte seeds (from 0x00...00 to 0x00...05 for tiny `V=6`). Using these seeds, secret and public keys can be programmatically generated, ensuring each JAM team can run the public testnet consistently. This is strictly for development purposes.

### Example: Ed25519 Keys

For each seed, we generate the corresponding Ed25519 secret and public keys:

- **Seed**: `0x0000000000000000000000000000000000000000000000000000000000000000`
  - **Secret**: `00000000000000000000000000000000000000000000000000000000000000003b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29`
  - **Public**: `3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29`

_...and so on for seeds from 0x00...01 through 0x00...05._

**TODOs:**
- Develop a `key` utility that maps any 32-byte development seed to Ed25519, Bandersnatch, and BLS private + public keys using:
  ```bash
  key 0x0000000000000000000000000000000000000000000000000000000000000005
  ```
- Create a mapping for Bandersnatch public keys.
- Create a mapping for BLS-12 public keys (G1 + G2).

## JAM TestNet Modes

Each validator communicates with other nodes using JAMNP's QUIC protocol. Depending on the mode, different aspects of the JAM protocol are tested.

| `mode`         | `safrole` | `assurance` | `finality` | `conformance`  |
|---------------|-----------|-------------|------------|----------------|
| QUIC / JAM Codec | Block, Ticket | WorkPackage, Guarantee, Assurance, EC TBD | TBD: Announcement, Vote, ...  | TBD: Dispute |
| Tickets: E_T           |   x       |       x     |     x      |     x          |
| Guarantees: E_G           |           |       x     |     x      |     x          |
| Assurances: E_A           |           |       x     |     x      |     x          |
| Preimages: E_P           |           |       x     |     x      |     x          |
| Refine/Accumulate PVM  |         |       x     |     x      |     x          |
| Audit/Announcements |     |             |     x      |     x          |
| GRANDPA       |           |             |     x      |     x          |
| Disputes: E_D |           |             |            |     x          |
| BLS           |           |             |            |     x          |
| BEEFY         |           |             |            |     x          |
| Authorization Pool/Queue |           |             |            |     x          |
| Privileged Services |     |             |            |     x          |
| State         | C4, C6, C7, C8, C9, C11, C13 | C10, C12 | - | C1, C2, C3, C5 |
| Timeline      | Q4 2024   | Q1 2025     | early Q2 2025 | late Q2 2025 |

We aim for 5-10 teams to successfully establish their own working testnets in Q4, with collaborative efforts beginning around sub0@Devcon7+JAM0 in mid-November.

The presence of M1+M2 test vectors will guide adjustments to the above.

## Traces

By using a public genesis state, teams can collaborate by sharing traces of key objects (blocks, tickets, and state snapshots) for the first 4-10 epochs for any mode. This allows for verifying that different implementations can read key objects and derive identical state roots, etc. in accordance with the GP Spec.

Here is a draft of the shape of `mode=safrole` here:
* [JAM Safrole Model](https://docs.google.com/spreadsheets/d/1ueAisCMOx7B-m_fXMLT0FXBxfVzydJyr-udE8jKwDN8/edit?gid=615049643#gid=615049643)

Teams can submit what they believe to be a valid trace of blocks, state snapshots and inputs in  `traces/${mode}/${team}` (e.g. `traces/safrole/strongly-web3`)


## Work Packages 

If you have a workpackage that you believe is suitable for `mode=assurances`, put it in `workpackages/${team}/${workpackagename}` (e.g.  `workpackages/strongly-web3/fib`)

* TODO: Create a way for builders to submit work packages to a core.

## JAM Implementer Submissions

Building a collaborative JAM Testnet requires teams share Docker image URLs, Traces, and Testnet configurations, but not code.

To contribute:

- Submit a PR to add a Docker image URL below.   
- Add your fully working `docker-compose.yml` to  `testnet/${mode}/${team}` (e.g. `testnet/safrole/jam-duna/docker-compose.yml`)
- Add your sample trace to `traces/${mode}/${team}` (e.g. `traces/safrole/jam-duna/data`)

| team          | Docker Image URL                                       |
|---------------|--------------------------------------------------------|
| blockcowboys  | TBD                                                    |
| boka          | TBD                                                    |
| clawbird      | TBD                                                    |
| gossamer      | TBD                                                    |
| graymatter    | TBD                                                    |
| jam-forge     | TBD                                                    |
| jamlabs       | TBD                                                    |
| jam-with-zig  | TBD                                                    |
| jam4s         | TBD                                                    |
| jamzig        | TBD                                                    |
| jamaica       | TBD                                                    |
| jamgo         | TBD                                                    |
| jamixir       | TBD                                                    |
| jampy         | TBD                                                    |
| jam-duna      | TBD                                                    |
| javajam       | TBD                                                    |
| jelly         | TBD                                                    |
| morum         | TBD                                                    |
| marmalade     | TBD                                                    |
| po-jam-l      | TBD                                                    |
| polkajam      | TBD                                                    |
| pyjamaz       | TBD                                                    |
| rjam          | TBD                                                    |
| strawberry    | TBD                                                    |
| tsjam         | TBD                                                    |
| tessera       | TBD                                                    |
| typeberry     | TBD                                                    |
| universaldot  | TBD                                                    |
| vinwolf       | TBD                                                    |
| goberryjam    | TBD                                                    |
| subjam        | TBD                                                    |

For simplicity, use lowercase for `${team}` and `${mode}`.  Dashes and underscores are ok, spaces/punctations are not.
