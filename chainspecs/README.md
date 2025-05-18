

## JIP-4 Chainspecs


[JIP-4](https://github.com/polkadot-fellows/JIPs/pull/1) chainspecs here:

* [polkajam](./polkajam-spec.json)
* [jamduna](./jamduna-spec.json)


Goal: jam binaries should be able to map [dev-config.json](./dev-config.json) into JIP-4 chainspecs:

```
./polkajam gen-spec dev-config.json polkajam-spec.json
./jamduna  gen-spec dev-config.json jamduna-spec.json
```


