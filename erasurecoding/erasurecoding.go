package erasurecoding

import (
	"fmt"
	"sync"
)

// nonZeroEntry is an auxiliary structure for the precomputed flattened Lagrange evaluation matrix,
// recording for each row element which validator (s) has a non-negative gfLog value.
type nonZeroEntry struct {
	s    int // Validator index.
	logB int // The value of precomputedLagrangeLog[s*K+i] (always non-negative).
}

const (
	W_E             = 684
	TotalValidators = 1023
)

var (
	precomputeOnce             sync.Once
	precomputedDataShardXs     []GFPoint
	precomputedValidatorXs     []GFPoint
	precomputedLagrange        [][]GFPoint
	precomputedLagrangeLog     []int
	precomputedLagrangeNonZero [][]nonZeroEntry // Length = K; for each row element, stores all non-zero {s, logB} entries.
)

// GetCodingRate returns the encoding parameters: K (number of data shards) and N (total validators).
// Example: K = W_E/2, N = TotalValidators.
func GetCodingRate() (coding_rate_K int, coding_rate_N int) {
	coding_rate_K = W_E / 2
	coding_rate_N = TotalValidators
	return
}

// Pad the input to the specified length
func PadToMultipleOfN(input []byte, n int) []byte {
	length := len(input)
	mod := (length+n-1)%n + 1

	// Calculate the padding
	padding := 0
	if mod != 0 {
		padding = n - mod
	}

	// Fill the padding
	for i := 0; i < padding; i++ {
		input = append(input, 0)
	}
	return input
}

// Encode converts the input data into a 3D byte slice.
func Encode(data []byte, shardPieces int) ([][][]byte, error) {
	precomputeOnce.Do(precomputeXs)

	K, N := GetCodingRate()
	shardSize := shardPieces * 2      // 2 bytes per row in each shard.
	pointsPerGroup := K * shardPieces // Each group contains K * shardPieces GFPoints.

	// Convert data to GFPoints (each 2 bytes form one point, pad with 0 if needed).
	totalPoints := (len(data) + 1) / 2
	allPoints := make([]GFPoint, totalPoints)
	for i := 0; i < totalPoints; i++ {
		index := 2 * i
		var b0, b1 byte
		b0 = data[index]
		if index+1 < len(data) {
			b1 = data[index+1]
		} else {
			b1 = 0
		}
		allPoints[i] = GFPoint(uint16(b1)<<8 | uint16(b0))
	}

	// Group the GFPoints.
	numGroups := (len(allPoints) + pointsPerGroup - 1) / pointsPerGroup
	out := make([][][]byte, numGroups)

	var wg sync.WaitGroup
	for g := 0; g < numGroups; g++ {
		wg.Add(1)
		go func(g int) {
			defer wg.Done()
			groupPoints := make([]GFPoint, pointsPerGroup)
			start := g * pointsPerGroup
			end := start + pointsPerGroup
			for i := start; i < end; i++ {
				if i < len(allPoints) {
					groupPoints[i-start] = allPoints[i]
				} else {
					groupPoints[i-start] = 0
				}
			}
			// Allocate N shards for this group.
			groupShards := make([][]byte, N)
			for s := 0; s < N; s++ {
				groupShards[s] = make([]byte, shardSize)
			}

			var wgRow sync.WaitGroup
			for row := 0; row < shardPieces; row++ {
				wgRow.Add(1)
				go func(row int) {
					defer wgRow.Done()
					rowStart := row * K
					rowPoints := groupPoints[rowStart : rowStart+K]
					codes := make([]GFPoint, N)
					// For each element in the row, convert using combinedCantor and, if nonzero, accumulate the validator code.
					for i := 0; i < K; i++ {
						v := combinedCantor[rowPoints[i]]
						if v == 0 {
							continue
						}
						logA := gfLog[v]
						for _, entry := range precomputedLagrangeNonZero[i] {
							codes[entry.s] ^= gfExp[logA+entry.logB]
						}
					}
					// Store each code as 2 bytes in the corresponding shard.
					for s := 0; s < N; s++ {
						groupShards[s][row*2] = byte(codes[s] & 0xFF)
						groupShards[s][row*2+1] = byte((codes[s] >> 8) & 0xFF)
					}
				}(row)
			}
			wgRow.Wait()
			out[g] = groupShards
		}(g)
	}
	wg.Wait()
	return out, nil
}

// Decode recovers the original data from the encoded shards.
func Decode(data [][][]byte, shardPieces int) ([]byte, error) {
	precomputeOnce.Do(precomputeXs)
	K, _ := GetCodingRate()
	shardSize := shardPieces * 2
	groupDataSize := K * shardSize

	result := make([]byte, len(data)*groupDataSize)
	var wg sync.WaitGroup
	var decodeErr error
	var errMutex sync.Mutex

	for g := 0; g < len(data); g++ {
		wg.Add(1)
		go func(g int) {
			defer wg.Done()
			groupShards := data[g]
			if len(groupShards) == 0 {
				return
			}
			recovered := make([]byte, groupDataSize)
			for row := 0; row < shardPieces; row++ {
				var available []struct {
					Word  GFPoint
					Index int
				}
				for idx := 0; idx < len(groupShards); idx++ {
					if len(groupShards[idx]) < (row+1)*2 {
						continue
					}
					low := groupShards[idx][row*2]
					high := groupShards[idx][row*2+1]
					val := GFPoint(uint16(high)<<8 | uint16(low))
					available = append(available, struct {
						Word  GFPoint
						Index int
					}{Word: val, Index: idx})
				}
				if len(available) < K {
					errMutex.Lock()
					decodeErr = fmt.Errorf("not enough shards to recover data in group %d", g)
					errMutex.Unlock()
					return
				}
				useDirect := true
				for i := 0; i < K; i++ {
					if available[i].Index != i {
						useDirect = false
						break
					}
				}
				if useDirect {
					for i := 0; i < K; i++ {
						code := available[i].Word
						recovered[2*(row*K+i)] = byte(code & 0xFF)
						recovered[2*(row*K+i)+1] = byte((code >> 8) & 0xFF)
					}
				} else {
					xs := make([]GFPoint, K)
					ys := make([]GFPoint, K)
					for i := 0; i < K; i++ {
						xs[i] = precomputedValidatorXs[available[i].Index]
						ys[i] = FromCantorBasis(ToCantorBasis(available[i].Word))
					}
					p := Interpolate(xs, ys)
					for i := 0; i < K; i++ {
						code := Evaluate(p, GFPoint(i))
						recovered[2*(row*K+i)] = byte(code & 0xFF)
						recovered[2*(row*K+i)+1] = byte((code >> 8) & 0xFF)
					}
				}
			}
			copy(result[g*groupDataSize:(g+1)*groupDataSize], recovered)
		}(g)
	}
	wg.Wait()
	if decodeErr != nil {
		return nil, decodeErr
	}
	return result, nil
}
