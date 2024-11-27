# JAM Testnet - RPC Methods

Here is a short wishlist of JSON-RPC methods:

| Method Name                     | Description                                                                                                                                                                  | Response Format                       | JSON Support | Codec Support |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|--------------|---------------|
| `jam_getBlockByHash`            | Looks up block by block hash or header hash and returns `Block`.                                                                                                             | [JSON](https://github.com/w3f/jamtestvectors/blob/master/codec/data/block.json) or [Codec](https://github.com/w3f/jamtestvectors/blob/master/codec/data/block.bin) | ✅            | ✅             |
| `jam_getWorkPackageByHash`      | Looks up `WorkPackage` by WorkPackageHash and returns `WorkPackage`.                                                                                                         | [JSON](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_package.json) or [Codec](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_package.bin) | ✅            | ✅             |
| `jam_getWorkReportByHash`       | Looks up `WorkReport` by WorkReportHash and returns `WorkReport`.                                                                                                           | [JSON](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_report.json) or [Codec](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_report.bin) | ✅            | ✅             |
| `jam_getService`                | Given a service ID, returns the "info" of the service.                                                                                                                       | JSON or JAM Codec                     | ✅            | ✅             |
| `jam_getServiceCode`            | Given a service ID, returns the code hash and code of the service. Optional parameters return the history of code.                                                           | JSON or JAM Codec                     | ✅            | ✅             |
| `jam_getServicePreimage`        | Given a service ID, returns `a_p`, the preimage raw bytes.                                                                                                                   | JSON or JAM Codec                     | ✅            | ✅             |
| `jam_getServiceLookup`          | Given a service ID, returns `a_l`, all the hash and length.                                                                                                                  | JSON or JAM Codec                     | ✅            | ✅             |
| `jam_getServiceStorage`         | Returns a full range of keys and values of the service.                                                                                                                      | JSON or JAM Codec                     | ✅            | ✅             |
| `jam_getState`                  | Returns C1-C15, and if a service ID is provided, returns the full range of service keys in the state.                                                                        | [JSON]() or [Codec]()                 | ✅            | ✅             |
| `jam_submitWorkPackage`         | Given a core index and work package posted in [JSON](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_package.json) or [Codec](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_package.bin), maps to [CE133](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-133-work-package-submission). | JSON or JAM Codec                     | ✅            | ✅             |


Most of the above methods can return JSON or JAM Codec form, using an additional "Accept" header with JSON as the default:

Request JSON Response:
```
curl -X POST -H "Content-Type: application/json" -H "Accept: application/json" \
--data '{"jsonrpc":"2.0","method":"jam_getBlockByHash","params":["0x1234abcd..."],"id":1}' \
http://localhost:8545
```

Request JAM Codec response:
```
curl -X POST -H "Content-Type: application/json" -H "Accept: application/octet-stream" \
--data '{"jsonrpc":"2.0","method":"jam_getBlockByHash","params":["0x1234abcd..."],"id":1}' \
http://localhost:8545
```


Pagination details are to be sketched later.


# Example curl calls

## jam_getBlockByHash

Looks up block by block hash or header hash and returns `Block` in [JSON](https://github.com/w3f/jamtestvectors/blob/master/codec/data/block.json) or [codec](https://github.com/w3f/jamtestvectors/blob/master/codec/data/block.bin) form

```bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"jam_getBlockByHash","params":["0x1234abcd..."],"id":1}' http://localhost:8545
```



## jam_getWorkPackageByHash

Looks up WorkPackage by WorkPackageHash and returns `WorkPackage` in [JSON](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_package.json) or [codec](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_package.bin) form

```bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"jam_getWorkPackageByHash","params":["0x5678efgh..."],"id":2}' http://localhost:8545
```

## jam_getWorkReportByHash (similar to [CE 136: Work-report request](https://github.com/zdave-parity/jam-np/blob/main/simple.md))

Looks up WorkReport by WorkReportHash and returns `WorkReport` in [JSON](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_report.json) or [codec](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_report.bin) form

``bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"jam_getWorkReportByHash","params":["0x9abcijkl..."],"id":3}' http://localhost:8545
```

## jam_getService

Given a service id, returns the "info" of the service 

```bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"jam_getService","params":["42"],"id":4}'  http://localhost:8545
```

## jam_getServiceCode

Given a service id, returns the codehash and code of the service.  Optional parameters returns the history of code

```bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"jam_getServiceCode","params":["42"],"id":5}'  http://localhost:8545
```

## jam_getServicePreimage

Given a service id, returns a_p, the preimage raw bytes.

```bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"jam_getServicePreimage","params":["42"],"id":6}' http://localhost:8545
```

## jam_getServiceLookup

Given a service id, returns a_l all the hash, len

```bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"jam_getServiceLookup","params":["42"],"id":7}' http://localhost:8545
```

## jam_getServiceStorage

Given a serviceID, returns a full range of keys and values of the service in $a_s$.

```bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"jam_getServiceStorage","params":["42"],"id":8}' http://localhost:8545
```

## jam_getState (similar to [CE 129](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-129-state-request))

Given a startKey, endKey combination, returns the full range of keys in the range in the state in [JSON](https://github.com/jam-duna/jamtestnet/blob/main/traces/safrole/jam_duna/traces/395479_000.json) or [codec](https://github.com/jam-duna/jamtestnet/blob/main/traces/safrole/jam_duna/traces/395479_000.bin) form.  If a service ID is provided, the keys and values will be filtered by the service ID. 

```bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"jam_getState","params":["0x0000...", "0xFFFF.."],"id":9}' http://localhost:8545
```

To query with a service ID:

```bash
curl -X POST -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"jam_getState","params":["0x0000...", "0xFFFF..", "42"],"id":10}' http://localhost:8545
```

## jam_submitWorkPackage (similar to JAMNP - CE 133)

Given a core index and work package posted in [JSON](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_package.json) or [codec](https://github.com/w3f/jamtestvectors/blob/master/codec/data/work_package.bin) form, maps to the same as [CE133](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-133-work-package-submission)

```bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"jam_submitWorkPackage","params":[1, {"work_package": "..." }],"id":11}' http://localhost:8545
```





