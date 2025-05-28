#![allow(non_snake_case)]
#[cfg(test)]

mod tests {
    use reed_solomon_simd::{ReedSolomonEncoder};
    use serde_json::{Value};
    use std::fs;

    fn encode_test(fn_: &str, key: &str, V: usize) -> Result<(), Box<dyn std::error::Error>> {
        // Step 1: Calculate parameters
        let C = V / 3;      // 2
        let chunks = 2 * C; // 4
    
        // Step 2: Read and parse JSON file
        let file_contents = fs::read_to_string(fn_)?;
        let json_data: Value = serde_json::from_str(&file_contents)?;
    
        // Step 3: Extract and decode the segment, ensure it is a multiple of 2*chunks (should pad if required)
        let segment_hex = json_data[key]
            .as_str()
            .ok_or("Missing segment field or not a string")?;
        let seg_bytes = hex::decode(segment_hex.trim_start_matches("0x"))?;
        if seg_bytes.len() % (2 * chunks) != 0 {
            return Err(format!("Segment length {} is not a multiple of 2*chunks ({})", seg_bytes.len(), 2 * chunks).into());
        }
    
        // Step 4: Rearrange seg_bytes into reed-solomon-simd input layout    
        let rows = seg_bytes.len() / (2 * chunks);
        let mut rearranged = Vec::with_capacity(seg_bytes.len());
    
        // TRANSFORMATION: https://graypaper.fluffylabs.dev/#/9a08063/3e2e023e2e02?v=0.6.6 | https://github.com/davxy/jam-test-vectors/pull/28#issuecomment-2706094497
        for r in 0..rows {
            for c in 0..chunks {
                rearranged.push(seg_bytes[r * chunks * 2 + c * 2]); // low byte
            }
        }
        for r in 0..rows {
            for c in 0..chunks {
                rearranged.push(seg_bytes[r * chunks * 2 + c * 2 + 1]); // high byte
            }
        }

        let W_G: usize = rearranged.len();
        let W_E = W_G / (C*2);
        if W_G % C*2 != 0 {
            return Err(format!("W_G {} not divisible by C*2 {}", W_G, C*2).into());
        }

        // Step 5: Break rearranged segment into C pieces
        let mut original_segments = Vec::new();
        for i in 0..C {
            let start = i * W_E*2;
            let end = start + W_E*2;
            if end > rearranged.len() {
                return Err(format!("Segment slice out of range: {}..{}", start, end).into());
            }
            original_segments.push(rearranged[start..end].to_vec());
        }
    
        // Step 6: Perform encoding
        let mut encoder = ReedSolomonEncoder::new(C, V - C, W_E*2)?;
        for segment in &original_segments {
            encoder.add_original_shard(segment)?;
        }
        let result = encoder.encode()?;
        let recovery: Vec<_> = result.recovery_iter().collect();
        println!("rearranged {} seg_bytes {}",      rearranged.len(), seg_bytes.len());
    
        if recovery.len() != 2 * C {
            return Err(format!("Expected {} recovery shards, got {}", 2 * C, recovery.len()).into());
        }
        
        // Step 7: Compare with provided shards
        let shards_json = json_data["shards"]
            .as_array()
            .ok_or("Missing or invalid 'shards' array")?;
    
        for i in 0..C * 2 {
            let expected_hex = shards_json
                .get(i)
                .and_then(|val| val.as_str())
                .ok_or("Invalid shard entry in JSON")?;
            let actual_hex = format!("0x{}", hex::encode(&recovery[i]));
            if actual_hex != expected_hex {
                println!("Shard {}:\n  Expected: {}\n  Got:      {}", i, expected_hex, actual_hex)
            }
        }
    
        Ok(())
    }
    
    #[test]
    fn test_generate() -> Result<(), Box<dyn std::error::Error>> {
        encode_test("test_segment_shards_tiny_polkajam.json", "segment", 6)?;
        Ok(())
    }

}

