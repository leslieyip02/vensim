package graph

type State struct {
	Nodes   map[string]*Node  `json:"nodes"`
	Edges   map[string]*Edge  `json:"edges"`
	Stocks  map[string]*Stock `json:"stocks"`
	Clouds  map[string]*Cloud `json:"clouds"`
	Flows   map[string]*Flow  `json:"flows"`
	Counter int               `json:"counter"`
}

func NewState() *State {
	return &State{
		Nodes:   make(map[string]*Node),
		Edges:   make(map[string]*Edge),
		Stocks:  make(map[string]*Stock),
		Clouds:  make(map[string]*Cloud),
		Flows:   make(map[string]*Flow),
		Counter: 1,
	}
}
