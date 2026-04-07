package sim

import (
	"testing"
)

func TestIF(t *testing.T) {
	if IF(true, 1, 2) != 1 {
		t.Errorf("IF(true, 1, 2) should return 1")
	}
	if IF(false, 1, 2) != 2 {
		t.Errorf("IF(false, 1, 2) should return 2")
	}
}

func TestSTEP(t *testing.T) {
	env := RuntimeEnv{
		"currentTime": 10.0,
	}

	if STEP(5, 5, env) != 5 {
		t.Errorf("STEP should return height when currentTime >= stepTime")
	}

	if STEP(5, 15, env) != 0 {
		t.Errorf("STEP should return 0 when currentTime < stepTime")
	}
}

func TestSTEP_Panic(t *testing.T) {
	defer expectPanic(t)
	env := RuntimeEnv{} // missing currentTime
	STEP(5, 5, env)
}

func TestLOOKUP_BasicInterpolation(t *testing.T) {
	// x = 5 between (0,0) and (10,10) → expect 5
	result := LOOKUP(5.0, 0.0, 10.0, 0.0, 10.0)
	if result != 5 {
		t.Errorf("Expected 5, got %v", result)
	}
}

func TestLOOKUP_ClampBelow(t *testing.T) {
	result := LOOKUP(-5.0, 0.0, 10.0, 0.0, 10.0)
	if result != 0 {
		t.Errorf("Expected clamp to 0, got %v", result)
	}
}

func TestLOOKUP_ClampAbove(t *testing.T) {
	result := LOOKUP(15.0, 0.0, 10.0, 0.0, 10.0)
	if result != 10 {
		t.Errorf("Expected clamp to 10, got %v", result)
	}
}

func TestLOOKUP_MultipleSegments(t *testing.T) {
	// piecewise: (0,0), (10,10), (20,20)
	result := LOOKUP(15.0, 0.0, 10.0, 20.0, 0.0, 10.0, 20.0)
	if result != 15 {
		t.Errorf("Expected 15, got %v", result)
	}
}

func TestLOOKUP_IntInputs(t *testing.T) {
	result := LOOKUP(5, 0, 10, 0, 10)
	if result != 5 {
		t.Errorf("Expected 5 with int inputs, got %v", result)
	}
}

func TestLOOKUP_Panic_TooFewArgs(t *testing.T) {
	defer expectPanic(t)
	LOOKUP(1, 2, 3)
}

func TestLOOKUP_Panic_UnevenPairs(t *testing.T) {
	defer expectPanic(t)
	LOOKUP(5.0, 0.0, 10.0, 0.0) // uneven X/Y
}

func TestLOOKUP_Panic_InvalidX(t *testing.T) {
	defer expectPanic(t)
	LOOKUP("bad", 0.0, 10.0, 0.0, 10.0)
}

func TestLOOKUP_Panic_InvalidY(t *testing.T) {
	defer expectPanic(t)
	LOOKUP(5.0, 0.0, 10.0, 0.0, "bad")
}

func TestLOOKUP_Panic_NonIncreasingX(t *testing.T) {
	defer expectPanic(t)
	LOOKUP(5.0, 10.0, 0.0, 0.0, 10.0)
}

// helper
func expectPanic(t *testing.T) {
	t.Helper()
	if r := recover(); r == nil {
		t.Errorf("Expected panic but did not panic")
	}
}
