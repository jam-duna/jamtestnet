use hex;
use reed_solomon_simd::{ReedSolomonDecoder, ReedSolomonEncoder};
use serde_json::Value;
use std::collections::HashMap;
use std::fs;

const W_G: usize = 4104;

fn run_reed_solomon_test(
    json_path: &str,
    key: &str,
    V: usize,
) -> Result<(), Box<dyn std::error::Error>> {
    let C = V / 3;
    let W_E = W_G / (2 * C);

    let json_str = fs::read_to_string(json_path)?;
    let v: Value = serde_json::from_str(&json_str)?;

    let seg_hex = v[key].as_str().expect("segment attribute not found");
    let seg_bytes = hex::decode(seg_hex.trim_start_matches("0x"))?;
    println!(
        "Original segment raw byte length: {} bytes",
        seg_bytes.len()
    );
    assert_eq!(
        seg_bytes.len(),
        W_G,
        "Segment must be exactly {} bytes (W_G)",
        W_G
    );

    if let Some(shards) = v["shards"].as_array() {
        for (i, shard_value) in shards.iter().enumerate() {
            let shard_bytes = hex::decode(
                shard_value
                    .as_str()
                    .expect("shard is not string")
                    .trim_start_matches("0x"),
            )?;
            println!("JSON shard {} length: {} bytes", i, shard_bytes.len());
        }
    }

    let mut original_segments = Vec::new();
    for i in 0..C {
        let start = i * W_E * 2;
        let end = start + W_E * 2;
        let segment = &seg_bytes[start..end];
        println!("Original Shard {}: {}", i, hex::encode(segment));
        original_segments.push(segment);
    }

    let mut encoder = ReedSolomonEncoder::new(C, V - C, W_E * 2)?;
    for segment in &original_segments {
        encoder.add_original_shard(segment)?;
    }
    let result = encoder.encode()?;
    let recovery: Vec<_> = result.recovery_iter().collect();

    for (i, rec_shard) in recovery.iter().enumerate() {
        println!("Recovery shard {}: {}", i, hex::encode(rec_shard));
    }

    let mut decoder = ReedSolomonDecoder::new(C, V - C, W_E * 2)?;
    for i in 0..C {
        decoder.add_recovery_shard(i as usize, recovery[i])?;
    }
    let result = decoder.decode()?;
    let restored: HashMap<usize, &[u8]> = result.restored_original_iter().collect();

    for (index, data) in restored.iter() {
        println!("Restored shard {}: {}", index, hex::encode(data));
    }

    // Check that restored shards match the originals
    for (i, segment) in original_segments.iter().enumerate() {
        assert_eq!(restored.get(&i).unwrap(), segment);
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_davxy() -> Result<(), Box<dyn std::error::Error>> {
        run_reed_solomon_test("src/davxy/test_segment_shards_tiny.json", "segment", 6)
    }

    #[test]
    fn test_javajam() -> Result<(), Box<dyn std::error::Error>> {
        run_reed_solomon_test("src/javajam/segment_tiny.json", "data", 6)
    }
}
