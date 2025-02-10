package erasurecoding

import (
	"math/rand"
	"testing"
	"time"
)

func TestInterpolateSinglePoint(t *testing.T) {
	xs := []GFPoint{10}
	ys := []GFPoint{1234}
	p := Interpolate(xs, ys)
	if len(p) != 1 {
		t.Errorf("Single point interpolation should produce a constant polynomial")
	}
	if Evaluate(p, 0) != 1234 {
		t.Errorf("Single point interpolation value fail")
	}
}

func TestInterpolateTwoPoints(t *testing.T) {
	x := []GFPoint{0, 1}
	y := []GFPoint{0x1234, 0x5678}
	p := Interpolate(x, y)
	// p(0)=y0, p(1)=y1
	if Evaluate(p, 0) != y[0] {
		t.Errorf("Two points interpolate fail at x=0")
	}
	if Evaluate(p, 1) != y[1] {
		t.Errorf("Two points interpolate fail at x=1")
	}
}

func TestInterpolateRandom(t *testing.T) {
	rand.Seed(time.Now().UnixNano())
	for trial := 0; trial < 50; trial++ {
		n := rand.Intn(200) + 2
		xs := make([]GFPoint, n)
		ys := make([]GFPoint, n)
		used := make(map[GFPoint]bool)
		for i := 0; i < n; i++ {
			var x GFPoint
			for {
				x = GFPoint(rand.Uint32() & 0xFFFF)
				if !used[x] {
					used[x] = true
					break
				}
			}
			y := GFPoint(rand.Uint32() & 0xFFFF)
			xs[i] = x
			ys[i] = y
		}

		p := Interpolate(xs, ys)
		for i := 0; i < n; i++ {
			val := Evaluate(p, xs[i])
			if val != ys[i] {
				t.Errorf("Random interpolation fail: p(%04X)=%04X, want %04X", xs[i], val, ys[i])
			}
		}
	}
}

func TestInterpolateAllSameY(t *testing.T) {
	xs := []GFPoint{1, 2, 3, 4}
	ys := []GFPoint{0xAAAA, 0xAAAA, 0xAAAA, 0xAAAA}
	p := Interpolate(xs, ys)
	val := Evaluate(p, 1234)
	if val != 0xAAAA {
		t.Errorf("All same ys fail: got %04X", val)
	}
}

func TestInterpolateDuplicateX(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic on duplicate x")
		}
	}()
	xs := []GFPoint{10, 10}
	ys := []GFPoint{100, 200}
	_ = Interpolate(xs, ys)
}

func TestEvaluateEmptyPoly(t *testing.T) {
	p := []GFPoint{}
	val := Evaluate(p, 0x1234)
	if val != 0 {
		t.Errorf("Empty poly evaluate fail: got %04X", val)
	}
}
