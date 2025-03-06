#[cfg(test)]
mod tests {
    use hex;
    use reed_solomon_simd;
    use serde_json::Value;
    use std::fs;

    #[test]
    fn test_davxy() -> Result<(), Box<dyn std::error::Error>> {
        let json_str = fs::read_to_string("src/davxy/test_segment_shards_tiny.json")?;
        let v: Value = serde_json::from_str(&json_str)?;

        // Extract and process the "segment" attribute and show the length of each of them.
        let seg_hex = v["segment"].as_str().expect("segment attribute not found");
        let seg_hex = seg_hex.trim_start_matches("0x");
        let seg_bytes = hex::decode(seg_hex)?;
        println!(
            "davxy Original segment raw byte length: {} bytes",
            seg_bytes.len()
        );
        assert_eq!(
            seg_bytes.len(),
            4104,
            "Segment must be exactly 4104 byte (W_G)"
        );
        if let Some(shards) = v["shards"].as_array() {
            for (i, shard_value) in shards.iter().enumerate() {
                let shard_hex = shard_value
                    .as_str()
                    .expect("shard is not string")
                    .trim_start_matches("0x");
                let shard_bytes = hex::decode(shard_hex)?;
                println!("davxy JSON shard {} length: {} bytes", i, shard_bytes.len());
            }
        }

        // Split the 4104 bytes into two parts of 2052 bytes (NOT a multiple of 64!)
        let part1 = &seg_bytes[0..2052];
        let part2 = &seg_bytes[2052..4104];

        // Pad each 2052-byte part with zeros to reach 2112 bytes (64*33)
        let mut shard0 = vec![0u8; 2112];
        shard0[..2052].copy_from_slice(part1);
        let mut shard1 = vec![0u8; 2112];
        shard1[..2052].copy_from_slice(part2);

        // Prepare the original shards as slices.
        let original = [shard0, shard1];
        let original_slices = [&original[0][..], &original[1][..]];

        // Generate 4 recovery shards (each of size 2112 bytes = 64*33).
        let recovery = reed_solomon_simd::encode(
            2, // number of original shards
            4, // number of recovery shards
            original_slices,
        )?;
        // this will show 2112-2052=60 bytes of 00s but we can strip out this stuff as an artifact of this RS
        for (i, shard) in original.iter().enumerate() {
            let shard_hex = hex::encode(shard);
            println!(
                "davxy Original shard {}: {} ({} bytes)",
                i,
                shard_hex,
                shard.len()
            );
        }
        for (i, shard) in recovery.iter().enumerate() {
            let shard_hex = hex::encode(shard);
            println!(
                "davxy Recovery shard {}: {} ({} bytes)",
                i,
                shard_hex,
                shard.len()
            );
        }

        // Use 2 shards to recover the original data in the JSON and verify restored match original
        let restored = reed_solomon_simd::decode(
            2,                       // original shard count
            4,                       // recovery shard count
            [(1, &original[1][..])], // cant put [] here...
            [(3, &recovery[3][..])],
        )?;

        assert_eq!(restored[&0], &original[0][..]);
        Ok(())
    }

    #[test]
    fn test_javajam() -> Result<(), Box<dyn std::error::Error>> {
        // Read the JSON file containing the data and shards.
        let json_str = fs::read_to_string("src/javajam/segment_tiny.json")?;
        let v: Value = serde_json::from_str(&json_str)?;

        // Extract and process the "data" attribute.
        let data_hex = v["data"]
            .as_str()
            .expect("data attribute not found")
            .trim_start_matches("0x");
        let data_bytes = hex::decode(data_hex)?;
        println!(
            "JJ Original segment raw byte length: {} bytes",
            data_bytes.len()
        );

        // Ensure the segment is the expected length.
        assert_eq!(
            data_bytes.len(),
            4104,
            "Segment must be exactly 4104 bytes (W_G)"
        );

        // Show the lengths of shards provided in the JSON.
        if let Some(shards) = v["shards"].as_array() {
            for (i, shard_value) in shards.iter().enumerate() {
                let shard_hex = shard_value
                    .as_str()
                    .expect("shard is not a string")
                    .trim_start_matches("0x");
                let shard_bytes = hex::decode(shard_hex)?;
                println!("JJ JSON shard {} length: {} bytes", i, shard_bytes.len());
            }
        }

        // Split the 4104 bytes into two parts of 2052 bytes (NOT a multiple of 64!)
        let part1 = &data_bytes[0..2052];
        let part2 = &data_bytes[2052..4104];

        // Pad each 2052-byte part with zeros to reach 2112 bytes (64*33)
        let mut shard0 = vec![0u8; 2112];
        shard0[..2052].copy_from_slice(part1);
        let mut shard1 = vec![0u8; 2112];
        shard1[..2052].copy_from_slice(part2);

        // Prepare the original shards as slices.
        let original = [shard0, shard1];
        let original_slices = [&original[0][..], &original[1][..]];

        // Generate 4 recovery shards (each of size 2112 bytes = 64*33).
        let recovery = reed_solomon_simd::encode(
            2, // number of original shards
            4, // number of recovery shards
            original_slices,
        )?;

        // Print the hex-encoded recovery shards along with their lengths.
        for (i, shard) in recovery.iter().enumerate() {
            let shard_hex = hex::encode(shard);
            println!(
                "JJ Recovery shard {}: {} ({} bytes)",
                i,
                shard_hex,
                shard.len()
            );
        }

        // Use 2 shards to recover the original data in the JSON and verify restored match original
        let restored = reed_solomon_simd::decode(
            2, // original shard count
            4, // recovery shard count
            [(1, &original[1][..])],
            [(3, &recovery[3][..])],
        )?;

        assert_eq!(restored[&0], &original[0][..]);
        Ok(())
    }
}
