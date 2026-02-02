package sim

type StockInitial struct {
	ID           string   `json:"id"`
	InitialValue float64  `json:"initialValue"`
	Inflow       []string `json:"inflow"`
	Outflow      []string `json:"outflow"`
}

type VariableInitial struct {
	ID           string   `json:"id"`
	Equation     string   `json:"equation"`
	Dependencies []string `json:"dependencies"`
}

type Settings struct {
	StartTime float64 `json:"startTime"`
	EndTime   float64 `json:"endTime"`
	Delta     float64 `json:"delta"`
}

type SimulationRequest struct {
	Settings  Settings          `json:"settings"`
	Stocks    []StockInitial    `json:"stocks"`
	Variables []VariableInitial `json:"variables"`
}

type Item struct {
	ID    string  `json:"id"`
	Value float64 `json:"value"`
}

type TimeResult struct {
	Timestamp float64            `json:"timestamp"`
	Values    map[string]float64 `json:"values"`
}

type SimulationResult struct {
	Results []TimeResult `json:"results"`
}
