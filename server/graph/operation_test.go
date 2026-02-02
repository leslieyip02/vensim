package graph

import (
	"reflect"
	"testing"
)

func TestState_Apply_NodeOperations(t *testing.T) {
	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"NodeAdd": {
			op: Operation{
				Type: NodeAdd,
				Node: &Node{ID: "node_1"},
			},
			initial: State{
				Nodes:   map[string]*Node{},
				Counter: 1,
			},
			want: State{
				Nodes: map[string]*Node{
					"node_1": {ID: "node_1"},
				},
				Counter: 2,
			},
		},
		"NodeUpdate": {
			op: Operation{
				Type:  NodeUpdate,
				ID:    "node_1",
				Patch: map[string]any{"x": 30},
			},
			initial: State{
				Nodes: map[string]*Node{
					"node_1": {ID: "node_1"},
				},
				Counter: 1,
			},
			want: State{
				Nodes: map[string]*Node{
					"node_1": {ID: "node_1", X: 30},
				},
				Counter: 1,
			},
		},
		"NodeDelete": {
			op: Operation{
				Type: NodeDelete,
				ID:   "node_1",
			},
			initial: State{
				Nodes: map[string]*Node{
					"node_1": {ID: "node_1"},
				},
				Counter: 1,
			},
			want: State{
				Nodes:   map[string]*Node{},
				Counter: 1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got := test.initial.Apply(test.op)
			if got.Counter != test.want.Counter {
				t.Errorf("counter mismatch: want %+v but got %+v", test.want.Counter, got.Counter)
			}
			if !reflect.DeepEqual(test.want.Nodes, got.Nodes) {
				t.Errorf("nodes mismatch: want %+v but got %+v", test.want.Nodes, got.Nodes)
			}
		})
	}
}

func TestState_Apply_EdgeOperations(t *testing.T) {
	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"EdgeAdd": {
			op: Operation{
				Type: EdgeAdd,
				Edge: &Edge{ID: "edge_1"},
			},
			initial: State{
				Edges:   map[string]*Edge{},
				Counter: 1,
			},
			want: State{
				Edges: map[string]*Edge{
					"edge_1": {ID: "edge_1"},
				},
				Counter: 2,
			},
		},
		"EdgeUpdate": {
			op: Operation{
				Type:  EdgeUpdate,
				ID:    "edge_1",
				Patch: map[string]any{"to": "c"},
			},
			initial: State{
				Edges: map[string]*Edge{
					"edge_1": {ID: "edge_1", From: "a", To: "b"},
				},
				Counter: 1,
			},
			want: State{
				Edges: map[string]*Edge{
					"edge_1": {ID: "edge_1", From: "a", To: "c"},
				},
				Counter: 1,
			},
		},
		"EdgeDelete": {
			op: Operation{
				Type: EdgeDelete,
				ID:   "edge_1",
			},
			initial: State{
				Edges: map[string]*Edge{
					"edge_1": {ID: "edge_1"},
				},
				Counter: 1,
			},
			want: State{
				Edges:   map[string]*Edge{},
				Counter: 1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got := test.initial.Apply(test.op)
			if got.Counter != test.want.Counter {
				t.Errorf("counter mismatch: want %+v but got %+v", test.want.Counter, got.Counter)
			}
			if !reflect.DeepEqual(test.want.Edges, got.Edges) {
				t.Errorf("edges mismatch: want %+v but got %+v", test.want.Edges, got.Edges)
			}
		})
	}
}

func TestState_Apply_StockOperations(t *testing.T) {
	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"StockAdd": {
			op: Operation{
				Type:  StockAdd,
				Stock: &Stock{ID: "stock_1"},
			},
			initial: State{
				Stocks:  map[string]*Stock{},
				Counter: 1,
			},
			want: State{
				Stocks: map[string]*Stock{
					"stock_1": {ID: "stock_1"},
				},
				Counter: 2,
			},
		},
		"StockUpdate": {
			op: Operation{
				Type:  StockUpdate,
				ID:    "stock_1",
				Patch: map[string]any{"x": 30},
			},
			initial: State{
				Stocks: map[string]*Stock{
					"stock_1": {ID: "stock_1"},
				},
				Counter: 1,
			},
			want: State{
				Stocks: map[string]*Stock{
					"stock_1": {ID: "stock_1", X: 30},
				},
				Counter: 1,
			},
		},
		"StockDelete": {
			op: Operation{
				Type: StockDelete,
				ID:   "stock_1",
			},
			initial: State{
				Stocks: map[string]*Stock{
					"stock_1": {ID: "stock_1"},
				},
				Counter: 1,
			},
			want: State{
				Stocks:  map[string]*Stock{},
				Counter: 1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got := test.initial.Apply(test.op)
			if got.Counter != test.want.Counter {
				t.Errorf("counter mismatch: want %+v but got %+v", test.want.Counter, got.Counter)
			}
			if !reflect.DeepEqual(test.want.Stocks, got.Stocks) {
				t.Errorf("stocks mismatch: want %+v but got %+v", test.want.Stocks, got.Stocks)
			}
		})
	}
}

func TestState_Apply_CloudOperations(t *testing.T) {
	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"CloudAdd": {
			op: Operation{
				Type:  CloudAdd,
				Cloud: &Cloud{ID: "cloud_1"},
			},
			initial: State{
				Clouds:  map[string]*Cloud{},
				Counter: 1,
			},
			want: State{
				Clouds: map[string]*Cloud{
					"cloud_1": {ID: "cloud_1"},
				},
				Counter: 2,
			},
		},
		"CloudUpdate": {
			op: Operation{
				Type:  CloudUpdate,
				ID:    "cloud_1",
				Patch: map[string]any{"x": 30},
			},
			initial: State{
				Clouds: map[string]*Cloud{
					"cloud_1": {ID: "cloud_1"},
				},
				Counter: 1,
			},
			want: State{
				Clouds: map[string]*Cloud{
					"cloud_1": {ID: "cloud_1", X: 30},
				},
				Counter: 1,
			},
		},
		"CloudDelete": {
			op: Operation{
				Type: CloudDelete,
				ID:   "cloud_1",
			},
			initial: State{
				Clouds: map[string]*Cloud{
					"cloud_1": {ID: "cloud_1"},
				},
				Counter: 1,
			},
			want: State{
				Clouds:  map[string]*Cloud{},
				Counter: 1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got := test.initial.Apply(test.op)
			if got.Counter != test.want.Counter {
				t.Errorf("counter mismatch: want %+v but got %+v", test.want.Counter, got.Counter)
			}
			if !reflect.DeepEqual(test.want.Clouds, got.Clouds) {
				t.Errorf("clouds mismatch: want %+v but got %+v", test.want.Clouds, got.Clouds)
			}
		})
	}
}

func TestState_Apply_FlowOperations(t *testing.T) {
	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"FlowAdd": {
			op: Operation{
				Type: FlowAdd,
				Flow: &Flow{ID: "flow_1"},
			},
			initial: State{
				Flows:   map[string]*Flow{},
				Counter: 1,
			},
			want: State{
				Flows: map[string]*Flow{
					"flow_1": {ID: "flow_1"},
				},
				Counter: 2,
			},
		},
		"FlowUpdate": {
			op: Operation{
				Type:  FlowUpdate,
				ID:    "flow_1",
				Patch: map[string]any{"curvature": 0.5},
			},
			initial: State{
				Flows: map[string]*Flow{
					"flow_1": {ID: "flow_1"},
				},
				Counter: 1,
			},
			want: State{
				Flows: map[string]*Flow{
					"flow_1": {ID: "flow_1", Curvature: 0.5},
				},
				Counter: 1,
			},
		},
		"FlowDelete": {
			op: Operation{
				Type: FlowDelete,
				ID:   "flow_1",
			},
			initial: State{
				Flows: map[string]*Flow{
					"flow_1": {ID: "flow_1"},
				},
				Counter: 1,
			},
			want: State{
				Flows:   map[string]*Flow{},
				Counter: 1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got := test.initial.Apply(test.op)
			if got.Counter != test.want.Counter {
				t.Errorf("counter mismatch: want %+v but got %+v", test.want.Counter, got.Counter)
			}
			if !reflect.DeepEqual(test.want.Flows, got.Flows) {
				t.Errorf("flows mismatch: want %+v but got %+v", test.want.Flows, got.Flows)
			}
		})
	}
}
