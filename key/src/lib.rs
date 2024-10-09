use ark_bls12_381::Bls12_381;
use ark_serialize::CanonicalSerialize;
use ring::signature::{Ed25519KeyPair, KeyPair};
use serde::{Deserialize, Serialize};
use w3f_bls::{double::DoublePublicKeyScheme, SecretKey, TinyBLS};

use w3f_bls::SerializableToBytes;
// Bandersnatch imports
use ark_ec_vrfs::suites::bandersnatch::edwards as bandersnatch;
use bandersnatch::Secret as BandersnatchSecret;

#[derive(Serialize, Deserialize, Debug)]
pub struct KeyPairOutput {
    bandersnatch: String,
    ed25519: String,
    bls: String,
    bandersnatch_priv: String,
    ed25519_priv: String,
    bls_priv: String,
}

#[no_mangle]
pub fn generate_keys_from_seed(seed: [u8; 32]) -> String {
    // Convert seed to slice (as in the original code)
    let seed_slice = &seed;

    // Generate SecretKey from seed (for BLS)
    let bls_secret_key =
        SecretKey::<TinyBLS<Bls12_381, ark_bls12_381::Config>>::from_seed(seed_slice);

    // Serialize SecretKey to bytes
    let mut bls_secret_key_bytes = vec![];
    bls_secret_key
        .serialize_uncompressed(&mut bls_secret_key_bytes)
        .expect("Failed to serialize SecretKey");

    // Generate DoublePublicKey from SecretKey using `into_vartime` method
    let secret_vt = bls_secret_key.into_vartime();
    let double_public_key = secret_vt.into_double_public_key();

    // Serialize DoublePublicKey to bytes
    let bls_bytes = double_public_key.to_bytes();

    // Generate Bandersnatch Private Key
    let bandersnatch_secret = BandersnatchSecret::from_seed(seed_slice);
    let mut bandersnatch_secret_bytes = vec![];
    bandersnatch_secret
        .scalar
        .serialize_compressed(&mut bandersnatch_secret_bytes)
        .expect("Failed to serialize Bandersnatch Private Key");

    // Generate Bandersnatch Public Key from the Private Key
    let bandersnatch_public_key = bandersnatch_secret.public();
    let mut bandersnatch_pubkey_bytes = vec![];
    bandersnatch_public_key
        .serialize_compressed(&mut bandersnatch_pubkey_bytes)
        .expect("Failed to serialize Bandersnatch Public Key");

    // Generate the Ed25519 KeyPair using `from_seed_unchecked`
    let ed25519_keypair =
        Ed25519KeyPair::from_seed_unchecked(&seed).expect("Failed to generate Ed25519 Keypair");

    // Get the Ed25519 Secret Key (32 bytes)
    let ed25519_secret_key = seed.to_vec(); // Since the seed itself is the secret key

    // Get the Ed25519 Public Key (32 bytes)
    let ed25519_public_key = ed25519_keypair.public_key().as_ref();

    // Create a KeyPair struct to hold all keys as hex strings with "0x" prefix
    let keypair = KeyPairOutput {
        bandersnatch: format!("0x{}", hex::encode(bandersnatch_pubkey_bytes)),
        ed25519: format!("0x{}", hex::encode(ed25519_public_key)),
        bls: format!("0x{}", hex::encode(bls_bytes)),
        bls_priv: format!("0x{}", hex::encode(bls_secret_key_bytes)),
        ed25519_priv: format!("0x{}", hex::encode(ed25519_secret_key)),
        bandersnatch_priv: format!("0x{}", hex::encode(bandersnatch_secret_bytes)),
    };

    // Convert the keypair to JSON
    serde_json::to_string_pretty(&keypair).expect("Failed to convert KeyPair to JSON")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_keys_from_seed() {
        let seed: [u8; 32] = [0u8; 32];
        let result = generate_keys_from_seed(seed);
        println!("Generated keys: {}", result);

        let parsed: KeyPairOutput = serde_json::from_str(&result).unwrap();
        assert_eq!(parsed.bls_priv.len(), 64 + 2);
        assert_eq!(parsed.bls.len(), 288 + 2);
        assert_eq!(parsed.bandersnatch_priv.len(), 64 + 2);
        assert_eq!(parsed.bandersnatch.len(), 64 + 2);
        assert_eq!(parsed.ed25519_priv.len(), 64 + 2);
        assert_eq!(parsed.ed25519.len(), 64 + 2);
    }
}
