package erasurecoding

import "sync"

// GFPoint represents an element in GF(2^16) using uint16.
type GFPoint uint16

// Irreducible polynomial: x^16 + x^5 + x^3 + x^2 + 1 (0x1002D)
const irreduciblePoly = 0x1002D

// Fixed Cantor basis.
var cantorBasis = [16]GFPoint{
	0x0001, 0xACCA, 0x3C0E, 0x163E,
	0xC582, 0xED2E, 0x914C, 0x4012,
	0x6C98, 0x10D8, 0x6A72, 0xB900,
	0xFDB8, 0xFB34, 0xFF38, 0x991E,
}

var M, M_inv [16][16]bool
var initCantorOnce sync.Once

// initCantorMatrix initializes the Cantor basis transformation matrix M and its inverse M_inv.
func initCantorMatrix() {
	for col := 0; col < 16; col++ {
		v := cantorBasis[col]
		for row := 0; row < 16; row++ {
			M[row][col] = (v & (1 << row)) != 0
		}
	}
	M_inv = invertMatrix(M)
}

func invertMatrix(A [16][16]bool) [16][16]bool {
	var aug [16][32]bool
	for i := 0; i < 16; i++ {
		for j := 0; j < 16; j++ {
			aug[i][j] = A[i][j]
		}
		aug[i][16+i] = true
	}
	for i := 0; i < 16; i++ {
		pivot := i
		for pivot < 16 && !aug[pivot][i] {
			pivot++
		}
		if pivot == 16 {
			panic("Matrix not invertible")
		}
		if pivot != i {
			for k := 0; k < 32; k++ {
				aug[i][k], aug[pivot][k] = aug[pivot][k], aug[i][k]
			}
		}
		for r := 0; r < 16; r++ {
			if r != i && aug[r][i] {
				for c := 0; c < 32; c++ {
					aug[r][c] = aug[r][c] != aug[i][c]
				}
			}
		}
	}
	var inv [16][16]bool
	for i := 0; i < 16; i++ {
		for j := 0; j < 16; j++ {
			inv[i][j] = aug[i][16+j]
		}
	}
	return inv
}

func vectorMatrixMul(vec GFPoint, mat [16][16]bool) GFPoint {
	var out GFPoint
	for row := 0; row < 16; row++ {
		bit := false
		for col := 0; col < 16; col++ {
			if ((vec>>col)&1) != 0 && mat[row][col] {
				bit = !bit
			}
		}
		if bit {
			out |= (1 << row)
		}
	}
	return out
}

const fieldSize = 1 << 16 // 65536
const fieldOrder = fieldSize - 1

var (
	gfExp        [fieldSize * 2]GFPoint
	gfLog        [fieldSize]int
	gfTablesOnce sync.Once

	toCantor       [fieldSize]GFPoint
	fromCantor     [fieldSize]GFPoint
	combinedCantor [fieldSize]GFPoint
)

func mulBasic(a, b GFPoint) GFPoint {
	var result uint32
	aa := uint32(a)
	bb := uint32(b)
	for i := 0; i < 16; i++ {
		if bb&1 != 0 {
			result ^= aa
		}
		bb >>= 1
		aa <<= 1
		if aa&0x10000 != 0 {
			aa ^= uint32(irreduciblePoly)
		}
	}
	return GFPoint(result & 0xFFFF)
}

func initGFTables() {
	initCantorOnce.Do(initCantorMatrix)
	gfExp[0] = 1
	var generator GFPoint = 2
	gfLog[0] = -1
	for i := 1; i < fieldOrder; i++ {
		gfExp[i] = mulBasic(gfExp[i-1], generator)
		if gfExp[i] != 0 {
			gfLog[gfExp[i]] = i
		}
	}
	for i := fieldOrder; i < len(gfExp); i++ {
		gfExp[i] = gfExp[i-fieldOrder]
	}
	for x := 0; x < fieldSize; x++ {
		val := GFPoint(x)
		toCantor[x] = vectorMatrixMul(val, M_inv)
		fromCantor[x] = vectorMatrixMul(val, M)
	}
	for x := 0; x < fieldSize; x++ {
		combinedCantor[x] = fromCantor[toCantor[x]]
	}
}

func ensureGFTables() {
	gfTablesOnce.Do(initGFTables)
}

func ToCantorBasis(a GFPoint) GFPoint {
	ensureGFTables()
	return toCantor[a]
}

func FromCantorBasis(a GFPoint) GFPoint {
	ensureGFTables()
	return fromCantor[a]
}

func Add(a, b GFPoint) GFPoint {
	return a ^ b
}

func Mul(a, b GFPoint) GFPoint {
	ensureGFTables()
	if a == 0 || b == 0 {
		return 0
	}
	sum := gfLog[a] + gfLog[b]
	if sum >= fieldOrder {
		sum -= fieldOrder
	}
	return gfExp[sum]
}

func mulFast(a, b GFPoint) GFPoint {
	if a == 0 || b == 0 {
		return 0
	}
	sum := gfLog[a] + gfLog[b]
	if sum >= fieldOrder {
		sum -= fieldOrder
	}
	return gfExp[sum]
}

func Pow(base GFPoint, exp uint16) GFPoint {
	ensureGFTables()
	if exp == 0 {
		return 1
	}
	if base == 0 {
		return 0
	}
	sum := gfLog[base] * int(exp)
	sum %= fieldOrder
	return gfExp[sum]
}

func Inv(a GFPoint) GFPoint {
	ensureGFTables()
	if a == 0 {
		panic("inverse of zero is undefined")
	}
	logA := gfLog[a]
	if logA < 0 {
		panic("inverse of zero is undefined")
	}
	return gfExp[fieldOrder-logA]
}

// precomputeXs precomputes the X coordinates and the Lagrange evaluation matrix,
func precomputeXs() {
	K, N := GetCodingRate()
	precomputedDataShardXs = make([]GFPoint, K)
	for i := 0; i < K; i++ {
		precomputedDataShardXs[i] = FromCantorBasis(ToCantorBasis(GFPoint(i)))
	}

	precomputedValidatorXs = make([]GFPoint, N)
	for i := 0; i < N; i++ {
		precomputedValidatorXs[i] = FromCantorBasis(ToCantorBasis(GFPoint(i)))
	}

	precomputedLagrange = make([][]GFPoint, N)
	for s := 0; s < N; s++ {
		precomputedLagrange[s] = make([]GFPoint, K)
		V := precomputedValidatorXs[s]
		for i := 0; i < K; i++ {
			// Compute numerator = ∏_{j≠i} (V + X[j])
			numerator := GFPoint(1)
			for j := 0; j < K; j++ {
				if j == i {
					continue
				}
				numerator = Mul(numerator, Add(V, precomputedDataShardXs[j]))
			}
			// Compute denominator = ∏_{j≠i} (X[i] + X[j])
			denom := GFPoint(1)
			for j := 0; j < K; j++ {
				if j == i {
					continue
				}
				denom = Mul(denom, Add(precomputedDataShardXs[i], precomputedDataShardXs[j]))
			}
			precomputedLagrange[s][i] = Mul(numerator, Inv(denom))
		}
	}

	// Flatten precomputedLagrange: record -1 if zero, otherwise record gfLog value.
	precomputedLagrangeLog = make([]int, N*K)
	for s := 0; s < N; s++ {
		for i := 0; i < K; i++ {
			index := s*K + i
			val := precomputedLagrange[s][i]
			if val == 0 {
				precomputedLagrangeLog[index] = -1
			} else {
				precomputedLagrangeLog[index] = gfLog[val]
			}
		}
	}

	// Build lookup table for non-zero entries: for each row element, store all validators with non-negative gfLog.
	precomputedLagrangeNonZero = make([][]nonZeroEntry, K)
	for i := 0; i < K; i++ {
		var entries []nonZeroEntry
		for s := 0; s < N; s++ {
			logB := precomputedLagrangeLog[s*K+i]
			if logB >= 0 {
				entries = append(entries, nonZeroEntry{s: s, logB: logB})
			}
		}
		precomputedLagrangeNonZero[i] = entries
	}
}
