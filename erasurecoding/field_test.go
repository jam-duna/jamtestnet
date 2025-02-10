package erasurecoding

import (
	"math/rand"
	"testing"
	"time"
)

func TestFieldAddProperties(t *testing.T) {
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < 1000; i++ {
		a := GFPoint(rand.Uint32() & 0xFFFF)
		b := GFPoint(rand.Uint32() & 0xFFFF)
		// Identity
		if Add(a, 0) != a {
			t.Errorf("Add identity fail: a+0 != a")
		}
		// Inverse (a+a=0)
		if Add(a, a) != 0 {
			t.Errorf("Add inverse fail: a+a!=0")
		}
		// Commutative
		if Add(a, b) != Add(b, a) {
			t.Errorf("Add not commutative")
		}
		// Associative
		c := GFPoint(rand.Uint32() & 0xFFFF)
		lhs := Add(Add(a, b), c)
		rhs := Add(a, Add(b, c))
		if lhs != rhs {
			t.Errorf("Add not associative")
		}
	}
}

func TestFieldMulProperties(t *testing.T) {
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < 1000; i++ {
		a := GFPoint(rand.Uint32() & 0xFFFF)
		b := GFPoint(rand.Uint32() & 0xFFFF)
		// Mul by zero
		if Mul(a, 0) != 0 {
			t.Errorf("Mul by zero fail")
		}
		// Mul by one
		if Mul(a, 1) != a {
			t.Errorf("Mul by one fail")
		}
		// Commutativity
		if Mul(a, b) != Mul(b, a) {
			t.Errorf("Mul not commutative")
		}
		// Distributive
		c := GFPoint(rand.Uint32() & 0xFFFF)
		lhs := Mul(a, Add(b, c))
		rhs := Add(Mul(a, b), Mul(a, c))
		if lhs != rhs {
			t.Errorf("Distributive fail")
		}

		// Associativity (only check when non-zero)
		if a != 0 && b != 0 && c != 0 {
			lhs = Mul(Mul(a, b), c)
			rhs = Mul(a, Mul(b, c))
			if lhs != rhs {
				t.Errorf("Associativity fail for mul")
			}
		}
	}
}

func TestFieldInvAndPow(t *testing.T) {
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < 500; i++ {
		a := GFPoint(rand.Uint32() & 0xFFFF)
		if a == 0 {
			a = 1
		}
		invA := Inv(a)
		if Mul(a, invA) != 1 {
			t.Errorf("Inverse fail: a=%04X, inv(a)=%04X", a, invA)
		}

		// Fermat-like: a^(65535)=1
		if Pow(a, 0xFFFF) != 1 {
			t.Errorf("Fermat test fail: a^(65535)!=1 for a=%04X", a)
		}

		// Pow test
		if Pow(a, 0) != 1 {
			t.Errorf("a^0!=1 for a=%04X", a)
		}
		if Pow(a, 1) != a {
			t.Errorf("a^1!=a for a=%04X", a)
		}
	}
}

func TestCantorBasis(t *testing.T) {
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < 1000; i++ {
		a := GFPoint(rand.Uint32() & 0xFFFF)
		c := ToCantorBasis(a)
		s := FromCantorBasis(c)
		if s != a {
			t.Errorf("Cantor roundtrip fail: input=%04X, got=%04X", a, s)
		}
	}

	// Test special cases: 0 and 0xFFFF
	if FromCantorBasis(ToCantorBasis(0)) != 0 {
		t.Errorf("Cantor zero fail")
	}
	if FromCantorBasis(ToCantorBasis(0xFFFF)) != 0xFFFF {
		t.Errorf("Cantor max value fail")
	}
}
