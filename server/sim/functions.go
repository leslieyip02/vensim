package sim

// IF returns trueValue when cond is true and false otherwise
func IF(cond bool, trueValue float64, falseValue float64) float64 {
	if cond {
		return trueValue
	}
	return falseValue
}

// STEP returns the value if targetTime >= the environment's current time
func STEP(value float64, targetTime float64, env RuntimeEnv) float64 {
	currentTime, ok := env["currentTime"].(float64)
	if !ok {
		panic("STEP: failed to get currentTime")
	}

	if currentTime >= targetTime {
		return value
	}
	return 0
}

// LOOKUP performs piecewise linear interpolation for a target value.
//
// It takes a target followed by x and y values:
//
//	LOOKUP(target, x1, x2, ..., xn, y1, y2, ..., yn)
//
// x values must be strictly increasing, with a matching number of y values.
//
// If the target is outside the x range, the result is clamped to the
// nearest y value. Otherwise, the result is linearly interpolated
// between the surrounding points.
func LOOKUP(target any, args ...any) float64 {
	if len(args) < 4 {
		panic("LOOKUP: requires at least 1 interval (i.e. x1, x2, y1, y2 should be defined)")
	}

	x, ok := toFloat64(target)
	if !ok {
		panic("LOOKUP: target argument should resolve to a number")
	}

	n := len(args)
	if n%2 != 0 {
		panic("LOOKUP: must provide equal number of x and y values")
	}

	half := n / 2

	xs := make([]float64, half)
	ys := make([]float64, half)

	// Parse x values
	for i := range half {
		val, ok := toFloat64(args[i])
		if !ok {
			panic("LOOKUP: expected all x values to be numbers")
		}
		xs[i] = val
	}

	// Parse y values
	for i := range half {
		val, ok := toFloat64(args[half+i])
		if !ok {
			panic("LOOKUP: expected all y values to be numbers")
		}
		ys[i] = val
	}

	// Ensure x are strictly increasing
	for i := 0; i < half-1; i++ {
		if xs[i] >= xs[i+1] {
			panic("LOOKUP: x values must be strictly increasing")
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

func toFloat64(v any) (float64, bool) {
	switch val := v.(type) {
	case float64:
		return val, true
	case int:
		return float64(val), true
	default:
		return 0, false
	}
}

func registerFunctions(env RuntimeEnv) {
	env["IF"] = IF
	env["LOOKUP"] = LOOKUP
	env["STEP"] = func(value float64, targetTime float64) float64 {
		return STEP(value, targetTime, env)
	}
}
