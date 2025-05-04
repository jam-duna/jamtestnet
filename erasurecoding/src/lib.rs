#![allow(non_snake_case)]
use hex;
use reed_solomon_simd::{ReedSolomonDecoder, ReedSolomonEncoder};
use serde_json::{json, Value};
use std::collections::HashMap;
use std::fs;
use std::fs::File;
use blake2::{Digest, Blake2s256};
use std::io::Write;
use std::path::Path;

const W_G: usize = 4104;

// Start with the hash of an empty string, add the hash of that, then the hash of that, etc.
fn generate_hash_chain() -> Vec<u8> {
    let mut buffer = vec![0u8; W_G]; // Allocate exactly W_G bytes
    let mut hasher = Blake2s256::new();
    hasher.update(b""); // Start with the hash of an empty string
    let mut hash = hasher.finalize_reset().to_vec();

    let mut pos = 0;
    while pos + hash.len() <= W_G {
        buffer[pos..pos + hash.len()].copy_from_slice(&hash);
        pos += hash.len();
        hasher.update(&hash);
        hash = hasher.finalize_reset().to_vec();
    }

    let remaining = W_G - pos;
    if remaining > 0 {
        buffer[pos..].copy_from_slice(&hash[..remaining]);
    }
    buffer
}

fn generate_reed_solomon_json(output_path: &str, key: &str, V: usize) -> Result<(), Box<dyn std::error::Error>> {
    let C = V / 3;
    let W_E = W_G / (2 * C);

    let seg_bytes = generate_hash_chain();
    let seg_hex = hex::encode(&seg_bytes);
    println!(
        "Generated segment raw byte length: {} bytes",
        seg_bytes.len()
    );

    let mut original_segments = Vec::new();
    for i in 0..C {
        let start = i * W_E * 2;
        let end = start + W_E * 2;
        let segment = &seg_bytes[start..end];
        // Transformation here? https://github.com/davxy/jam-test-vectors/pull/28#issuecomment-2706094497
        original_segments.push(segment.to_vec());
    }

    let mut encoder = ReedSolomonEncoder::new(C, V - C, W_E * 2)?;
    for segment in &original_segments {
        encoder.add_original_shard(segment)?;
    }
    let result = encoder.encode()?;
    let recovery: Vec<_> = result.recovery_iter().collect();

    let mut shards = Vec::new();
    for rec_shard in recovery.iter() {
        shards.push(hex::encode(rec_shard));
    }

    let json_data = json!({
        key: format!("0x{}", seg_hex),
        "shards": shards.iter().map(|s| format!("0x{}", s)).collect::<Vec<String>>()
    });

    let json_string = serde_json::to_string_pretty(&json_data)?;

    let path = Path::new(output_path);
    let mut file = File::create(path)?;
    file.write_all(json_string.as_bytes())?;

    println!("JSON file generated: {}", output_path);
    Ok(())
}

fn restore_reed_solomon_json(json_path: &str, key: &str, V: usize) -> Result<(), Box<dyn std::error::Error>> {
    let C = V / 3;
    let W_E = W_G / (2 * C);

    let json_str = fs::read_to_string(json_path)?;
    let v: Value = serde_json::from_str(&json_str)?;

    let seg_hex = v[key].as_str().expect("segment attribute not found");
    let seg_bytes = hex::decode(seg_hex.trim_start_matches("0x"))?;
    assert_eq!(
        seg_bytes.len(),
        W_G,
        "Segment must be exactly {} bytes (W_G)",
        W_G
    );

    let mut original_segments = Vec::new();
    for i in 0..C {
        let start = i * W_E * 2;
        let end = start + W_E * 2;
        let segment = &seg_bytes[start..end];
        // Transformation here? https://github.com/davxy/jam-test-vectors/pull/28#issuecomment-2706094497
        original_segments.push(segment);
    }

    let mut decoder = ReedSolomonDecoder::new(C, V - C, W_E * 2)?;

    if let Some(shards) = v["shards"].as_array() {
        for (i, shard_value) in shards.iter().enumerate() {
            let shard_bytes = hex::decode(
                shard_value
                    .as_str()
                    .expect("shard is not a string")
                    .trim_start_matches("0x"),
            )?;
            decoder.add_recovery_shard(i, &shard_bytes)?;
        }
    }

    let result = decoder.decode()?;
    let restored: HashMap<usize, &[u8]> = result.restored_original_iter().collect();

    for (i, segment) in original_segments.iter().enumerate() {
        assert_eq!(restored.get(&i).unwrap(), segment);
    }

    println!("Restoration successful for {}", json_path);
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate() -> Result<(), Box<dyn std::error::Error>> {
        generate_reed_solomon_json("src/jam-duna/test_segment_shards_tiny.json", "segment", 6)?;
        generate_reed_solomon_json("src/jam-duna/test_segment_shards_small.json", "segment", 12)?;
        generate_reed_solomon_json("src/jam-duna/test_segment_shards_medium.json", "segment", 18)?;
        generate_reed_solomon_json("src/jam-duna/test_segment_shards_large.json", "segment", 36)?;
        generate_reed_solomon_json("src/jam-duna/test_segment_shards_xlarge.json", "segment", 108)?;
        generate_reed_solomon_json("src/jam-duna/test_segment_shards_2xlarge.json", "segment", 342)?;
        generate_reed_solomon_json("src/jam-duna/test_segment_shards_3xlarge.json", "segment", 684)?;
        generate_reed_solomon_json("src/jam-duna/test_segment_shards_full.json", "segment", 1023)?;
        Ok(())
    }

    #[test]
    fn test_restore() -> Result<(), Box<dyn std::error::Error>> {
        restore_reed_solomon_json("src/jam-duna/test_segment_shards_tiny.json", "segment", 6)?;
        restore_reed_solomon_json("src/jam-duna/test_segment_shards_small.json", "segment", 12)?;
        restore_reed_solomon_json("src/jam-duna/test_segment_shards_medium.json", "segment", 18)?;
        restore_reed_solomon_json("src/jam-duna/test_segment_shards_large.json", "segment", 36)?;
        restore_reed_solomon_json("src/jam-duna/test_segment_shards_xlarge.json", "segment", 108)?;
        restore_reed_solomon_json("src/jam-duna/test_segment_shards_2xlarge.json", "segment", 342)?;
        restore_reed_solomon_json("src/jam-duna/test_segment_shards_3xlarge.json", "segment", 684)?;
        restore_reed_solomon_json("src/jam-duna/test_segment_shards_full.json", "segment", 1023)?;
        Ok(())
    }
}

