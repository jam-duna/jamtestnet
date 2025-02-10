package erasurecoding

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"math/rand"
	"os"
	"runtime/pprof"
	"testing"
	"time"
)

const debugEC = false

// Helper function to pad data to the nearest multiple of dataShard * shardPieces * 2
func padData(data []byte, dataShard int, shardPieces int) ([]byte, int) {
	originalLength := len(data)
	segmentSize := dataShard * int(shardPieces) * 2
	if segmentSize == 0 {
		panic("segmentSize cannot be zero")
	}
	padLength := segmentSize - (len(data) % segmentSize)
	if len(data)%segmentSize != 0 {
		data = append(data, make([]byte, padLength)...)
	}
	return data, originalLength
}

func TestEncodeDecode(t *testing.T) {

	dataShard, _ := GetCodingRate()

	testCases := []struct {
		name        string
		data        []byte
		shardPieces int
	}{
		{
			name:        "Empty data",
			data:        []byte{},
			shardPieces: 1,
		},
		{
			name:        "Small data less than one shard",
			data:        []byte{1, 2, 3, 4}, // Needs to be even bytes (2 GFPoints)
			shardPieces: 1,
		},
		{
			name:        "Exact one shard",
			data:        make([]byte, dataShard*2), // Each shardPiece is dataShard GFPoints, each GFPoint is 2 bytes
			shardPieces: 1,
		},
		{
			name:        "Multiple shards",
			data:        make([]byte, dataShard*3*2), // 3 shardPieces
			shardPieces: 1,
		},
		{
			name:        "Data spanning multiple shards with remainder",
			data:        make([]byte, dataShard*5*2+100), // 5 shardPieces + 100 bytes
			shardPieces: 1,
		},
		{
			name:        "Maximum shardPieces",
			data:        make([]byte, dataShard*10*2), // 10 shardPieces
			shardPieces: 10,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			paddedData, originalLength := padData(tc.data, dataShard, tc.shardPieces)
			encoded, err := Encode(paddedData, tc.shardPieces)
			if err != nil {
				t.Errorf("Error encoding data: %v", err)
				return
			}
			decoded, err := Decode(encoded, tc.shardPieces)
			if err != nil {
				t.Errorf("Error decoding data: %v", err)
				return
			}

			// Slice decoded data to the original length
			if originalLength > len(decoded) {
				t.Errorf("Decoded data length (%d) is shorter than original data length (%d)", len(decoded), originalLength)
				return
			}
			decoded = decoded[:originalLength]

			if !bytes.Equal(decoded, tc.data) {
				t.Errorf("Decoded data does not match original for case '%s'", tc.name)
			}
		})
	}
}

func TestDifferentSizes(t *testing.T) {
	// Initialize()
	precomputeOnce.Do(precomputeXs)

	filename := fmt.Sprintf("pprof.prof")
	file, err := os.Create(filename)
	if err != nil {
		fmt.Printf("Error creating pprof file: %v\n", err)
	}

	if err := pprof.StartCPUProfile(file); err != nil {
		fmt.Printf("Error starting pprof: %v\n", err)
		file.Close()
	}

	// 2, 4, 64, 1024, 1MB, 2MB, 4MB, 8MB, 12MB
	// sizes := []int{2, 4, 64, 1024, 4104, 1024 * 1024, 2 * 1024 * 1024, 4 * 1024 * 1024, 8 * 1024 * 1024, 12 * 1024 * 1024}
	// 1024, 4104, 1MB, 2MB, 4MB, 8MB, 12MB (4104 is segment size, W_G)
	sizes := []int{1024, 4104, 1024 * 1024, 2 * 1024 * 1024, 4 * 1024 * 1024, 8 * 1024 * 1024, 12 * 1024 * 1024}
	for _, size := range sizes {
		if debugEC {
			fmt.Printf("--------------------------------------------\n")
		}
		b := make([]byte, size)
		b = PadToMultipleOfN(b, W_E)
		numpieces := len(b) / W_E
		if len(b)%W_E != 0 {
			numpieces++
		}
		generateSize := size
		_, _ = rand.Read(b)
		time1 := time.Now()
		encoded, err := Encode(b, numpieces)
		if debugEC {
			if size <= 64 {
				fmt.Printf("encoded %x\n", encoded)
			}
		}
		// fmt.Printf("encoded %x\n", encoded)
		originalByteUnit := ConvertSize(generateSize)
		shardSize := len(encoded[0][0])
		byteUnit := ConvertSize(shardSize)
		if debugEC {
			fmt.Printf("numpieces %d, size %d\n", numpieces, size)
			fmt.Printf("Original Data Size %d(%s), Shard Size: %d(%s),encoded[%d][%d][%d]\n", generateSize, originalByteUnit, shardSize, byteUnit, len(encoded), len(encoded[0]), len(encoded[0][0]))
		}
		if err != nil {
			t.Errorf("Error encoding data: %v", err)
			return
		}
		time2 := time.Now()
		decoded, err := Decode(encoded, numpieces)
		// _, err = Decode(encoded, numpieces)
		if err != nil {
			t.Errorf("Error decoding data: %v", err)
			return
		}
		time3 := time.Now()

		totalLength := 0
		for _, segment := range encoded {
			for _, shard := range segment {
				totalLength += len(shard)
			}
		}
		parityDataLength := totalLength - generateSize
		if debugEC {
			fmt.Printf("Total length: %d(%s)\n", totalLength, ConvertSize(totalLength))
			fmt.Printf(" -Data data length: %d(%s)\n", generateSize, ConvertSize(generateSize))
			fmt.Printf(" -Parity data length: %d(%s)\n", parityDataLength, ConvertSize(parityDataLength))
			fmt.Printf("Encode time: %vms, Decode time: %vms\n", time2.Sub(time1).Milliseconds(), time3.Sub(time2).Milliseconds())
		}

		if !bytes.Equal(decoded, b) {
			// fmt.Printf("Original data: %x, Decoded data: %x\n", b, decoded)
			fmt.Printf("Original data: %x, Decoded data: %x\n", b, decoded)
			t.Errorf("Decoded data does not match original for size %d", size)
		} else {
			if debugEC {
				fmt.Printf("Decoded data match original for size %d\n", size)
			}
		}

		if debugEC {
			if size <= 64 {
				fmt.Printf("Original data: %x, Decoded data: %x\n", b, decoded)
			}
			fmt.Printf("--------------------------------------------\n")
		}
	}
	// When function close, close the pprof file
	pprof.StopCPUProfile()
	file.Close()
}

// Write a function to calculate the size to kb, mb, gb, tb, pb, eb, zb, yb
func ConvertSize(size int) string {
	fSize := float64(size)
	units := []string{"B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"}
	unit := 0
	for fSize >= 1024 {
		fSize /= 1024
		unit++
	}

	// if point is 0, return int, else return .2float
	if fSize == float64(int(fSize)) {
		return fmt.Sprintf("%d%s", int(fSize), units[unit])
	}
	return fmt.Sprintf("%.2f%s", fSize, units[unit])
}

func TestEncodeDecodeWithPartialShards(t *testing.T) {
	// InitAll()

	K, N := GetCodingRate()
	tryTimes := 10
	notMatch := false
	passCounter := 0
	data, _ := hex.DecodeString("effa2e260ad220fa067c519e8c82dab3")
	data = PadToMultipleOfN(data, W_E)
	numpieces := len(data) / W_E
	if len(data)%W_E != 0 {
		numpieces++
	}
	originalLength := len(data)
	numpieces = 6
	encodedSegments, err := Encode(data, numpieces)
	if err != nil {
		t.Fatalf("Encode failed: %v", err)
	}

	var shards []string
	for _, shard := range encodedSegments[0] {
		shards = append(shards, hex.EncodeToString(shard))
	}

	if len(encodedSegments) != 1 {
		t.Fatalf("Expected 1 encoded segment, got %d", len(encodedSegments))
	}
	segment := encodedSegments[0]

	if len(segment) != N {
		t.Fatalf("Expected %d shards in the encoded segment, got %d", N, len(segment))
	}
	for i := 0; i < tryTimes; i++ {
		rand.Seed(time.Now().UnixNano())
		shardIndices := rand.Perm(N)[:K]
		selectedShards := make([][][]byte, 1)
		shards := make([][]byte, N)
		for _, idx := range shardIndices {
			shards[idx] = segment[idx]
		}
		selectedShards[0] = shards

		time1 := time.Now()
		decodedData, err := Decode(selectedShards, numpieces)
		if err != nil {
			t.Fatalf("Decode failed: %v", err)
		}

		if originalLength > len(decodedData) {
			t.Fatalf("Decoded data length (%d) is shorter than original data length (%d)", len(decodedData), originalLength)
		}
		decodedData = decodedData[:originalLength]

		if !bytes.Equal(decodedData, data) {
			t.Errorf("Decoded data does not match original.\nDecoded: %x\nOriginal: %x", decodedData, data)
			notMatch = true
			fmt.Printf("passCounter: %d\n", passCounter)
			break
		} else {
			passCounter++
		}
		time2 := time.Now()
		if debugEC {
			fmt.Printf("Decode time %vms on [%d][%d][%d]\n", time2.Sub(time1).Milliseconds(), len(selectedShards), len(shardIndices), len(encodedSegments[0][0]))
		}
	}
	if !notMatch {
		t.Logf("Decoded data match original")
	} else {
		t.Errorf("Decoded data does not match original")
	}
}

func TestEncodeDecodeData(t *testing.T) {

	dataShard, _ := GetCodingRate()
	data := []byte("Hello World")
	shardPieces := int(32)
	paddedData, originalLength := padData(data, dataShard, shardPieces)
	encoded, err := Encode(paddedData, shardPieces)
	if err != nil {
		t.Errorf("Error encoding data: %v", err)
		return
	}
	if debugEC {
		fmt.Printf("encoded = %x\n", encoded)
	}
	decoded, err := Decode(encoded, shardPieces)
	if err != nil {
		t.Errorf("Error decoding data: %v", err)
		return
	}
	decoded = decoded[:originalLength]
	if debugEC {
		fmt.Printf("paddedData = %x, decoded = %x\n", paddedData, decoded)
	}
	if !bytes.Equal(decoded, data) {
		t.Errorf("Decoded data does not match original")
	}
}

func TestEncodeDecodeEmptyData(t *testing.T) {

	data := []byte{}
	shardPieces := int(1)
	encoded, err := Encode(data, shardPieces)
	if err != nil {
		t.Errorf("Error encoding empty data: %v", err)
		return
	}
	if len(encoded) != 0 {
		t.Errorf("Expected encoded length 0, got %d", len(encoded))
	}
	decoded, err := Decode(encoded, shardPieces)
	if err != nil {
		t.Errorf("Error decoding empty data: %v", err)
		return
	}
	if len(decoded) != 0 {
		t.Errorf("Expected decoded data length 0, got %d", len(decoded))
	}
}

func TestEncodeDecodeSingleShard(t *testing.T) {

	dataShard, _ := GetCodingRate()
	shardPieces := int(1)
	data := make([]byte, dataShard*2)
	for i := 0; i < dataShard*2; i++ {
		data[i] = byte(i % 256)
	}
	paddedData, originalLength := padData(data, dataShard, shardPieces)
	encoded, err := Encode(paddedData, shardPieces)
	if err != nil {
		t.Errorf("Error encoding single shard data: %v", err)
		return
	}
	if len(encoded) != 1 {
		t.Errorf("Expected 1 encoded segment, got %d", len(encoded))
	}
	for _, shard := range encoded[0] {
		if len(shard) != int(shardPieces)*2 {
			t.Errorf("Expected shard length %d, got %d", shardPieces*2, len(shard))
		}
	}
	decoded, err := Decode(encoded, shardPieces)
	if err != nil {
		t.Errorf("Error decoding single shard data: %v", err)
		return
	}
	if originalLength > len(decoded) {
		t.Errorf("Decoded data length (%d) is shorter than original data length (%d)", len(decoded), originalLength)
		return
	}
	decoded = decoded[:originalLength]
	if !bytes.Equal(decoded, data) {
		t.Errorf("Decoded data does not match original for single shard")
	}
}

func TestEncodeDecodeMultipleShards(t *testing.T) {

	dataShard, _ := GetCodingRate()
	shardPieces := int(6)
	data := make([]byte, dataShard*3) // 3 shardPieces
	for i := 0; i < len(data); i++ {
		data[i] = byte(i % 256)
	}
	paddedData, originalLength := padData(data, dataShard, shardPieces)
	encoded, err := Encode(paddedData, shardPieces)
	if err != nil {
		t.Errorf("Error encoding multiple shards data: %v", err)
		return
	}
	expectedSegments := len(paddedData) / (dataShard * int(shardPieces) * 2)
	if len(encoded) != expectedSegments {
		t.Errorf("Expected %d encoded segments, got %d", expectedSegments, len(encoded))
	}
	for _, segment := range encoded {
		_, TotalValidators := GetCodingRate()
		if len(segment) != TotalValidators {
			t.Errorf("Expected %d shards per segment, got %d", TotalValidators, len(segment))
		}
		for _, shard := range segment {
			if len(shard) != int(shardPieces)*2 {
				t.Errorf("Expected shard length %d, got %d", shardPieces*2, len(shard))
			}
		}
	}
	decoded, err := Decode(encoded, shardPieces)
	if err != nil {
		t.Errorf("Error decoding multiple shards data: %v", err)
		return
	}
	if originalLength > len(decoded) {
		t.Errorf("Decoded data length (%d) is shorter than original data length (%d)", len(decoded), originalLength)
		return
	}
	decoded = decoded[:originalLength]
	if !bytes.Equal(decoded, data) {
		fmt.Printf("decoded = %v, data = %v\n", decoded, data)
		t.Errorf("Decoded data does not match original for multiple shards")
	}
}

func TestEncodeDecodeWithDifferentShardPieces(t *testing.T) {

	dataShard, _ := GetCodingRate()
	shardPieces := int(10)
	data := make([]byte, dataShard*10*2) // 10 shardPieces
	for i := 0; i < len(data); i++ {
		data[i] = byte((i * 3) % 256)
	}
	paddedData, originalLength := padData(data, dataShard, shardPieces)
	encoded, err := Encode(paddedData, shardPieces)
	if err != nil {
		t.Errorf("Error encoding with different shardPieces: %v", err)
		return
	}
	expectedSegments := len(paddedData) / (dataShard * int(shardPieces) * 2)
	if len(encoded) != expectedSegments {
		t.Errorf("Expected %d encoded segments, got %d", expectedSegments, len(encoded))
	}
	for _, segment := range encoded {
		_, TotalValidators := GetCodingRate()
		if len(segment) != TotalValidators {
			t.Errorf("Expected %d shards per segment, got %d", TotalValidators, len(segment))
		}
		for _, shard := range segment {
			if len(shard) != int(shardPieces)*2 {
				t.Errorf("Expected shard length %d, got %d", shardPieces*2, len(shard))
			}
		}
	}
	decoded, err := Decode(encoded, shardPieces)
	if err != nil {
		t.Errorf("Error decoding with different shardPieces: %v", err)
		return
	}
	if originalLength > len(decoded) {
		t.Errorf("Decoded data length (%d) is shorter than original data length (%d)", len(decoded), originalLength)
		return
	}
	decoded = decoded[:originalLength]
	if !bytes.Equal(decoded, data) {
		t.Errorf("Decoded data does not match original for different shardPieces")
	}
}

func TestEncodeDecodeLargeData(t *testing.T) {

	dataShard, _ := GetCodingRate()
	shardPieces := int(2)
	data := make([]byte, dataShard*10*200) // 10 shardPieces
	for i := 0; i < len(data); i++ {
		data[i] = byte((i * 7) % 256)
	}
	paddedData, originalLength := padData(data, dataShard, shardPieces)
	encoded, err := Encode(paddedData, shardPieces)
	if err != nil {
		t.Errorf("Error encoding large data: %v", err)
		return
	}
	if debugEC {
		fmt.Printf("encoded[%d][%d][%d]\n", len(encoded), len(encoded[0]), len(encoded[0][0]))
	}
	expectedSegments := len(paddedData) / (dataShard * int(shardPieces) * 2)
	if len(encoded) != expectedSegments {
		t.Errorf("Expected %d encoded segments, got %d", expectedSegments, len(encoded))
	}
	for _, segment := range encoded {
		_, TotalValidators := GetCodingRate()
		if len(segment) != TotalValidators {
			t.Errorf("Expected %d shards per segment, got %d", TotalValidators, len(segment))
		}
		for _, shard := range segment {
			if len(shard) != int(shardPieces)*2 {
				t.Errorf("Expected shard length %d, got %d", shardPieces*2, len(shard))
			}
		}
	}
	decoded, err := Decode(encoded, shardPieces)
	if err != nil {
		t.Errorf("Error decoding large data: %v", err)
		return
	}
	if originalLength > len(decoded) {
		t.Errorf("Decoded data length (%d) is shorter than original data length (%d)", len(decoded), originalLength)
		return
	}
	if debugEC {
		fmt.Printf("decoded = %x, data = %x\n", decoded, data)
	}
	decoded = decoded[:originalLength]
	if !bytes.Equal(decoded, data) {
		t.Errorf("Decoded data does not match original for large data")
	}
}

func TestDecodeInvalidShards(t *testing.T) {

	dataShard, _ := GetCodingRate()
	shardPieces := int(1)
	data := make([]byte, dataShard*2)
	for i := 0; i < dataShard*2; i++ {
		data[i] = byte(i % 256)
	}
	paddedData, _ := padData(data, dataShard, shardPieces)
	encoded, err := Encode(paddedData, shardPieces)
	if err != nil {
		t.Errorf("Error encoding data for TestDecodeInvalidShards: %v", err)
		return
	}
	if len(encoded) > 0 && len(encoded[0]) > 0 {
		encoded[0][0][0] = byte(4)
		encoded[0][0][1] = byte(2)
	}

	decode, err := Decode(encoded, shardPieces)
	if err != nil {
		t.Errorf("Error decoding data for TestDecodeInvalidShards: %v", err)
		return
	}
	if bytes.Equal(decode, data) {
		t.Errorf("Decoded data does not match original for invalid shards")
	}
}
