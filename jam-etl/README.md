# jam-etl Telemetry for Dune + BigQuery

jam-etl transforms raw JAM telemetry `.log` files into JSONL files compatible with Dune Analytics ingestion and Google BigQuery ingestion.

This is a Proof of Concept right now, based on JAM DUNA's tinytestnet data.  

## 📁 Directory Structure

```
.
├── logs/              # RAW .log files (each representing ~1 minute of telemetry of multiple msg types)
├── dune_exports/      # Output JSONL files, one per table -- this goes into Dune
├── schema/            # BigQuery table schema -- used to set up BQ tables and ingest into them
├── jam-to-bigquery.js
├── jam-to-dune.js
└── README.md
```

## 📦 Dune JAM Tables 

| Table               | msg_type | Description                                      |
|---------------------|----------|--------------------------------------------------|
| `blocks`            | 128      | Block headers and extrinsics metadata            |
| `validatorstatistics`| 13      | Per-validator block stats                        |
| `corestatistics`    | 13       | Per-core statistics                              |
| `servicestatistics` | 13       | Per-service processing metrics                   |
| `workreports`       | 255      | Work package execution outcomes                  |
| `preimages`         | 142      | Preimages submitted for service execution        |
| `assurances`        | 141      | Validator assurances attached to blocks          |
| `tickets`           | 131      | Validator-generated tickets for work eligibility |
| `workpackages`      | 0        | Work items submitted for execution               |
| `services`          | 143      | Registered service metadata                      |
| `segments`          | 3        | Segment payloads from the erasure-coded DAG      |



All tables contain common fields:

- `time`
- `team`
- `sender_id`
- `elapsed`
- `codec_encoded` (raw binary for audit)

## ✅ Requirements

- Node.js v16+
- Input `.log` files in `./data/`, each being line-delimited JSON


## 🧠 Dune Ingestion

### `jam-to-dune.js`

Reads logs and exports telemetry to `dune_exports/*.jsonl`:


This will:

1. Read all `.log` files in `./logs`, in sorted order.
2. Parse each line as a JAM telemetry blob.
3. Dispatch to the appropriate handler based on `msg_type`.
4. Append one row per record to the appropriate table in `dune_exports/`.


Run with:

```bash
node jam-to-dune.js

# View exported files
ls dune_exports/*.jsonl
```

The generated `.jsonl` files can be ingested into Dune via their ingestion pipelines or manually uploaded via the Dune UI or API.

## BigQuery Ingestion

Each message is parsed based on its `msg_type` and streamed into one of **11 BigQuery tables** within the `crypto_jam` dataset:

| Message Type | Table Name            | Description                           |
|--------------|-----------------------|---------------------------------------|
| 128          | `blocks`              | Full block header + extrinsics        |
| 13           | `validatorstatistics`, `corestatistics`, `servicestatistics` | Breakdown of Statistics         |
| 255          | `workreports`         | Results of refinement/guaranteeing               |
| 142          | `preimages`           | Preimages                |
| 141          | `assurances`          | Validator assurances        |
| 131          | `tickets`             | Tickets submitted              |
| 0            | `workpackages`        | Raw work packages  |
| 143          | `services`            | New services created from bootstrap services       |
| 3            | `segments`            | D3L Segments exported       |

## jam-to-bigquery.js Script

To stream data into Bigquery:

```bash
node jam-to-bigquery.js [filename]
```

This will:
- Read `.log` files from `./logs/`
- Parse each line into structured output
- Stream data to Bigquery 

## Creating BigQuery Tables

Use the following CLI commands (requires `bq` CLI configured):

```bash
bq mk --table crypto_jam.blocks blocks.json
bq mk --table crypto_jam.validatorstatistics validatorstatistics.json
bq mk --table crypto_jam.corestatistics corestatistics.json
bq mk --table crypto_jam.servicestatistics servicestatistics.json
bq mk --table crypto_jam.workreports workreports.json
bq mk --table crypto_jam.preimages preimages.json
bq mk --table crypto_jam.assurances assurances.json
bq mk --table crypto_jam.tickets tickets.json
bq mk --table crypto_jam.workpackages workpackages.json
bq mk --table crypto_jam.services services.json
bq mk --table crypto_jam.segments segments.json
```

Each JSON schema file corresponds to a table with the same name.

## Supplying data to Telemetry

Our implementation of the telemetry server is basically nothing but syslog-ng:

```
@version: 3.27
@include "scl.conf"

# systemctl restart syslog-ng.service

# global options.
options { chain_hostnames(off); flush_lines(0); use_dns(yes); use_fqdn(no);
	  dns_cache(yes); owner("root"); group("adm"); perm(0640);
	  stats_freq(0); keep_hostname(yes); log_fifo_size(100000);
	  log_msg_size(25000000); # Support 12MB wps, preimages.
};

source s_network {
    tcp(ip(0.0.0.0) port(5000) keep_hostname(yes) use-dns(yes)); 
};
destination d_logs {
    file("/var/log/jam/${YEAR}/${MONTH}/${DAY}/${HOUR}${MIN}.log" template("${MESSAGE}\n") create-dirs(yes));
};
filter f_jamduna { match("^jamtart" value("PROGRAM")); };
log {
  source(s_network);
  filter(f_jamduna);
  destination(d_logs);
};
```


## Ready to Send Telemetry Data?

```go
package main

import (
	"log"
	"log/syslog"
)
// TODO: put the JSON envelope here 

func main() {
	// Establish a connection to the remote syslog server over TCP
	writer, err := syslog.Dial("tcp", "TODO.jamduna.org:5000", syslog.LOG_INFO|syslog.LOG_USER, "jamtart")
	if err != nil {
		log.Fatalf("Failed to connect to syslog server: %v", err)
	}
	defer writer.Close()

	// Send an informational log message
	err = writer.Info("Telemetry event: workpackage submitted")
	if err != nil {
		log.Printf("Syslog write error: %v", err)
	}
}
```

### Rust 

```toml
[dependencies]
syslog = "6.0"
```

```rust
use syslog::{Facility, Formatter3164};

fn main() {
    // Define syslog configuration
    let formatter = Formatter3164 {
        facility: Facility::LOG_USER,
        hostname: None,
        process: "jamtart".into(),
        pid: 0,
    };

    // TODO: put the JSON envelope here 

    // Connect to the syslog server (TCP with rfc5424 format)
    match syslog::tcp(formatter, "tbd.jamduna.org:5000") {
        Err(e) => eprintln!("Failed to connect to syslog: {}", e),
        Ok(mut logger) => {
            if let Err(e) = logger.info("Telemetry event: workpackage submitted") {
                eprintln!("Failed to send syslog message: {}", e);
            }
        }
    }
}
```

# JAM Implementer Leaderboard

To get on the [Dune JAM Implementer leaderboard](https://dune.com/substrate/jamtestnet) use the following endpoint:

* JAM DUNA Endpoint: TBD (use tbd.jamduna.org as a placeholder for now)

Each implementation should follow this:

* `sender_id` - use the dev public keys (see [key](./key)) for now.  A more sophisticated scheme
* `team` - use the name you supplied in [clients](https://jamcha.in/clients)
* `elapsed` - measured in microseconds: (1s = 1000000 microseconds)
   - blocks (128), statistics (13): microseconds taken to make a block and compute the new state root, which includes all ordered accumulation
   - workreports (255): microseconds taken to refine a work packages.  No communications
   - assurances (141): time to assure the data, from the moment a new block is known to the time when a CE141 is submitted 
   - tickets (131): time to generate the ticket.  No communications.
   - preimages (142): zero for now.
   - workpackages (0): zero for now
   - services (143): zero for now
   - segments (3): zero for now


Find us on the [JAM DAO Discord](https://discord.com/invite/aGUV82SP) in #implementers or #tinytestnets (100% public, note: all communications will be archived) to start sending some telemetry data. 


