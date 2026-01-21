package graph

type State struct {
	Counter int              `json:"counter"`
	Nodes   map[string]*Node `json:"nodes"`
	Edges   map[string]*Edge `json:"edges"`
}

func NewState() *State {
	return &State{
		Counter: 1,
		Nodes:   make(map[string]*Node),
		Edges:   make(map[string]*Edge),
	}
}
