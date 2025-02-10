package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/colorfulnotion/jam/node"
)

func GenerateRandomData(size int) []byte {
	data := make([]byte, size)
	_, _ = rand.Read(data)
	return data
}


// Generate the test vector by generating random data.
func generateWorkPackageBundleTestVector(size int) (map[string]interface{}, error) {
	numpieces := size / .W_E
	if size%W_E != 0 {
		numpieces++
	}
	b := GenerateRandomData(size)
	originalB := b
	b = PadToMultipleOfN(b, int(W_E))
	chunks, err := erasurecoding.Encode(b, numpieces)
	if err != nil {
		return nil, err
	}

	var shards []string
	for _, shard := range chunks[0] {
		shards = append(shards, hex.EncodeToString(shard))
	}

	result := map[string]interface{}{
		"data":   fmt.Sprintf("%x", originalB),
		"shards": shards,
	}
	return result, nil
}

// Generate the test vector by generating random data.
func generateSegmentTestVector(size int, numPieces int) (map[string]interface{}, error) {
	b := GenerateRandomData(size)
	b = PadToMultipleOfN(b, int(W_E))
	chunks, err := erasurecoding.Encode(b, numPieces)
	if err != nil {
		return nil, err
	}

	var shards []string
	for _, shard := range chunks[0] {
		shards = append(shards, hex.EncodeToString(shard))
	}

	result := map[string]interface{}{
		"data":   fmt.Sprintf("%x", b),
		"shards": shards,
	}
	return result, nil
}

// Generate the test vector for erasure coding and save it as JSON.
func main() {
	network := "full"

	// d
	sizes := []int{1, 32, 684, 4096, 4104, 15000, 21824, 21888, 100000, 200000}

	for _, size := range sizes {
		// Handle fixed numPieces
		result, err := generateWorkPackageBundleTestVector(size)
		if err != nil {
			fmt.Printf("Error generating test vector for size %d with fixed numPieces: %v\n", size, err)
			continue
		}

		dir := filepath.Join("output", network)
		if err := os.MkdirAll(dir, os.ModePerm); err != nil {
			fmt.Printf("Error creating directory: %v\n", err)
			continue
		}

		fileName := fmt.Sprintf("workpackage_bundle_%d.json", size)
		filePath := filepath.Join(dir, fileName)
		file, err := os.Create(filePath)
		if err != nil {
			fmt.Printf("Error creating file: %v\n", err)
			continue
		}
		defer file.Close()

		encoder := json.NewEncoder(file)
		encoder.SetIndent("", "  ")
		if err := encoder.Encode(result); err != nil {
			fmt.Printf("Error writing JSON to file: %v\n", err)
		}
	}

	segmentSize := []int{4104}
	// Handle varying numPieces
	for _, size := range segmentSize {
		numPieces := 6
		result, err := generateSegmentTestVector(size, numPieces)
		if err != nil {
			fmt.Printf("Error generating test vector for size %d and numPieces %d: %v\n", size, numPieces, err)
		}

		dir := filepath.Join("output", network)
		if err := os.MkdirAll(dir, os.ModePerm); err != nil {
			fmt.Printf("Error creating directory: %v\n", err)
		}

		fileName := fmt.Sprintf("segment_%d.json", size)
		filePath := filepath.Join(dir, fileName)
		file, err := os.Create(filePath)
		if err != nil {
			fmt.Printf("Error creating file: %v\n", err)
		}
		defer file.Close()

		encoder := json.NewEncoder(file)
		encoder.SetIndent("", "  ")
		if err := encoder.Encode(result); err != nil {
			fmt.Printf("Error writing JSON to file: %v\n", err)
		}
	}
}
