package sim

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

var CustomFunctions = map[string]func(map[string]interface{}) interface{}{
	"IF": func(env map[string]interface{}) interface{} {
		return IF(env)
	},
	"STEP": func(env map[string]interface{}) interface{} {
		return STEP(env)
	},
}
