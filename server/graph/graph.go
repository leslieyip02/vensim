package graph

type Node struct {
	ID          string  `json:"id"`
	X           float64 `json:"x"`
	Y           float64 `json:"y"`
	Radius      float64 `json:"radius"`
	Label       string  `json:"label"`
	Description string  `json:"description"`
}

type Edge struct {
	ID        string  `json:"id"`
	From      string  `json:"from"`
	To        string  `json:"to"`
	Polarity  string  `json:"polarity"`
	Curvature float64 `json:"curvature"`
}

type Stock struct {
	ID          string  `json:"id"`
	X           float64 `json:"x"`
	Y           float64 `json:"y"`
	Width       float64 `json:"width"`
	Height      float64 `json:"height"`
	Label       string  `json:"label"`
	Description string  `json:"description"`
}

type Cloud struct {
	ID          string  `json:"id"`
	X           float64 `json:"x"`
	Y           float64 `json:"y"`
	Radius      float64 `json:"radius"`
	Label       string  `json:"label"`
	Description string  `json:"description"`
}

type Flow struct {
	ID        string  `json:"id"`
	StockID   string  `json:"stockId"`
	CloudID   string  `json:"cloudId"`
	Type      string  `json:"type"`
	Curvature float64 `json:"curvature"`
}
