# RawKV

## Description

- **Input**: State Merkle Tree Key/Value
- **Output**: State Root

## ASN.1

```asn1
StateData ::= SEQUENCE {
    key_val  SEQUENCE OF KeyValuePair,
    stateroot OCTET STRING (SIZE(32))
}

KeyValuePair ::= SEQUENCE {
    key   OCTET STRING,
    value OCTET STRING
}
```

## Reference

- [Map Codec](https://graypaper.fluffylabs.dev/#/293bf5a/33bd0033d700)
