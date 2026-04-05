package sim

import (
	"fmt"
)

func IF(env map[string]interface{}) func(cond bool, trueValue, falseValue float64) float64 {
	return func(cond bool, trueValue, falseValue float64) float64 {
		if cond {
			return trueValue
		}
		return falseValue
	}
}

func STEP(env map[string]interface{}) func(height float64, stepTime float64) float64 {
	return func(height float64, stepTime float64) float64 {
		currentTime, ok := env["currentTime"].(float64)
		if !ok {
			return 0
		}

		if currentTime >= stepTime {
			return height
		}
		return 0
	}
}

func toFloat64(v interface{}) (float64, bool) {
	switch val := v.(type) {
	case float64:
		return val, true
	case int:
		return float64(val), true
	default:
		return 0, false
	}
}

func LOOKUP(env map[string]interface{}) func(args ...interface{}) float64 {
	return func(args ...interface{}) float64 {
		if len(args) < 5 {
			panic("LOOKUP requires at least 5 arguments: varName, x1, x2, y1, y2")
		}

		x, ok := toFloat64(args[0])
		if !ok {
			panic("LOOKUP: first argument must be a variable name")
		}

		n := len(args) - 1
		if n%2 != 0 {
			panic("LOOKUP: must provide equal number of X and Y values")
		}

		half := n / 2

		xs := make([]float64, half)
		ys := make([]float64, half)

		// Parse X values
		for i := 0; i < half; i++ {
			val, ok := toFloat64(args[1+i])
			if !ok {
				panic(fmt.Sprintf("LOOKUP: invalid X value at position %d", i))
			}
			xs[i] = val
		}

		// Parse Y values
		for i := 0; i < half; i++ {
			val, ok := toFloat64(args[1+half+i])
			if !ok {
				panic(fmt.Sprintf("LOOKUP: invalid Y value at position %d", i))
			}
			ys[i] = val
		}

		// Ensure Xs are strictly increasing
		for i := 0; i < half-1; i++ {
			if xs[i] >= xs[i+1] {
				panic("LOOKUP: X values must be strictly increasing")
			}
		}

		// Clamp below range
		if x <= xs[0] {
			return ys[0]
		}

		// Clamp above range
		if x >= xs[half-1] {
			return ys[half-1]
		}

		// Interpolate
		for i := 0; i < half-1; i++ {
			x1, x2 := xs[i], xs[i+1]
			y1, y2 := ys[i], ys[i+1]

			if x >= x1 && x <= x2 {
				t := (x - x1) / (x2 - x1)
				return y1 + t*(y2-y1)
			}
		}

		panic("LOOKUP: failed to interpolate (unexpected state)")
	}
}

var CustomFunctions = map[string]func(map[string]interface{}) interface{}{
	"IF": func(env map[string]interface{}) interface{} {
		return IF(env)
	},
	"STEP": func(env map[string]interface{}) interface{} {
		return STEP(env)
	},
	"LOOKUP": func(env map[string]interface{}) interface{} {
		return LOOKUP(env)
	},
}
