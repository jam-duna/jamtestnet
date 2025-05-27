

## jamduna Chainspec


You can generate the [JIP-4](https://github.com/polkadot-fellows/JIPs/pull/1) chainspec using [dev-config.json](./dev-config.json) using the new [JIP-5 seeds](https://github.com/polkadot-fellows/JIPs/pull/3) with the `gen-spec` command.

To generate a [jamduna-spec.json](./jamduna-spec.json) with `jamduna`:

```bash
bin/jamduna  gen-spec dev-config.json jamduna-spec.json
```

## polkajam Chainspec

To generate the `dev` chainspec in `polkajam`:

```bash
bin/polkajam  gen-spec dev-config.json polkajam-spec.json
```
