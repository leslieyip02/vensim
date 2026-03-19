package sim

func IF(condition bool, trueValue, falseValue interface{}) interface{} {
	if condition {
		return trueValue
	}
	return falseValue
}

var CustomFunctions = map[string]interface{}{
	"IF": IF,
}
