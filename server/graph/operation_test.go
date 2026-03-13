package graph

import (
	"fmt"
	"reflect"
	"testing"
)

func TestState_Apply_NodeOperations(t *testing.T) {
	node1ID := fmt.Sprintf("node%s1", ID_SEPARATOR)

	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"NodeAdd": {
			op: Operation{
				Type:  NodeAdd,
				Clock: 1,
				Node:  &Node{ID: "node-1"},
			},
			initial: State{
				Nodes:   map[string]*Node{},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Nodes: map[string]*Node{
					node1ID: {ID: node1ID},
				},
				Counter: 2,
				Clock:   1,
			},
		},
		"NodeUpdate": {
			op: Operation{
				Type:  NodeUpdate,
				Clock: 1,
				ID:    "node-1",
				Patch: map[string]any{"x": 30},
			},
			initial: State{
				Nodes: map[string]*Node{
					node1ID: {ID: node1ID},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Nodes: map[string]*Node{
					node1ID: {ID: node1ID, X: 30.0},
				},
				Counter: 1,
				Clock:   1,
			},
		},
		"NodeDelete": {
			op: Operation{
				Type:  NodeDelete,
				Clock: 1,
				ID:    "node-1",
			},
			initial: State{
				Nodes: map[string]*Node{
					node1ID: {ID: node1ID},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Nodes:   map[string]*Node{},
				Counter: 1,
				Clock:   1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got, succeeded := test.initial.Apply(test.op)
			if !succeeded {
				t.Errorf("expected operation to succeed")
			}
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
	edge1ID := fmt.Sprintf("edge%s1", ID_SEPARATOR)

	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"EdgeAdd": {
			op: Operation{
				Type:  EdgeAdd,
				Clock: 1,
				Edge:  &Edge{ID: "edge-1"},
			},
			initial: State{
				Edges:   map[string]*Edge{},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Edges: map[string]*Edge{
					edge1ID: {ID: edge1ID},
				},
				Counter: 2,
				Clock:   1,
			},
		},
		"EdgeUpdate": {
			op: Operation{
				Type:  EdgeUpdate,
				Clock: 1,
				ID:    "edge-1",
				Patch: map[string]any{"to": "c"},
			},
			initial: State{
				Edges: map[string]*Edge{
					edge1ID: {ID: edge1ID, From: "a", To: "b"},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Edges: map[string]*Edge{
					edge1ID: {ID: edge1ID, From: "a", To: "c"},
				},
				Counter: 1,
				Clock:   1,
			},
		},
		"EdgeDelete": {
			op: Operation{
				Type:  EdgeDelete,
				Clock: 1,
				ID:    "edge-1",
			},
			initial: State{
				Edges: map[string]*Edge{
					edge1ID: {ID: edge1ID},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Edges:   map[string]*Edge{},
				Counter: 1,
				Clock:   1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got, succeeded := test.initial.Apply(test.op)
			if !succeeded {
				t.Errorf("expected operation to succeed")
			}
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
	stock1ID := fmt.Sprintf("stock%s1", ID_SEPARATOR)

	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"StockAdd": {
			op: Operation{
				Type:  StockAdd,
				Clock: 1,
				Stock: &Stock{ID: "stock-1"},
			},
			initial: State{
				Stocks:  map[string]*Stock{},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Stocks: map[string]*Stock{
					stock1ID: {ID: stock1ID},
				},
				Counter: 2,
				Clock:   1,
			},
		},
		"StockUpdate": {
			op: Operation{
				Type:  StockUpdate,
				Clock: 1,
				ID:    "stock-1",
				Patch: map[string]any{"x": 30},
			},
			initial: State{
				Stocks: map[string]*Stock{
					stock1ID: {ID: stock1ID},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Stocks: map[string]*Stock{
					stock1ID: {ID: stock1ID, X: 30.0},
				},
				Counter: 1,
				Clock:   1,
			},
		},
		"StockDelete": {
			op: Operation{
				Type:  StockDelete,
				Clock: 1,
				ID:    "stock-1",
			},
			initial: State{
				Stocks: map[string]*Stock{
					stock1ID: {ID: stock1ID},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Stocks:  map[string]*Stock{},
				Counter: 1,
				Clock:   1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got, succeeded := test.initial.Apply(test.op)
			if !succeeded {
				t.Errorf("expected operation to succeed")
			}
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
	cloud1ID := fmt.Sprintf("cloud%s1", ID_SEPARATOR)

	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"CloudAdd": {
			op: Operation{
				Type:  CloudAdd,
				Clock: 1,
				Cloud: &Cloud{ID: "cloud-1"},
			},
			initial: State{
				Clouds:  map[string]*Cloud{},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Clouds: map[string]*Cloud{
					cloud1ID: {ID: cloud1ID},
				},
				Counter: 2,
				Clock:   1,
			},
		},
		"CloudUpdate": {
			op: Operation{
				Type:  CloudUpdate,
				Clock: 1,
				ID:    "cloud-1",
				Patch: map[string]any{"x": 30},
			},
			initial: State{
				Clouds: map[string]*Cloud{
					cloud1ID: {ID: cloud1ID},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Clouds: map[string]*Cloud{
					cloud1ID: {ID: cloud1ID, X: 30.0},
				},
				Counter: 1,
				Clock:   1,
			},
		},
		"CloudDelete": {
			op: Operation{
				Type:  CloudDelete,
				Clock: 1,
				ID:    "cloud-1",
			},
			initial: State{
				Clouds: map[string]*Cloud{
					cloud1ID: {ID: cloud1ID},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Clouds:  map[string]*Cloud{},
				Counter: 1,
				Clock:   1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got, succeeded := test.initial.Apply(test.op)
			if !succeeded {
				t.Errorf("expected operation to succeed")
			}
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
	flow1ID := fmt.Sprintf("flow%s1", ID_SEPARATOR)

	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"FlowAdd": {
			op: Operation{
				Type:  FlowAdd,
				Clock: 1,
				Flow:  &Flow{ID: "flow-1"},
			},
			initial: State{
				Flows:   map[string]*Flow{},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Flows: map[string]*Flow{
					flow1ID: {ID: flow1ID},
				},
				Counter: 2,
				Clock:   1,
			},
		},
		"FlowUpdate": {
			op: Operation{
				Type:  FlowUpdate,
				Clock: 1,
				ID:    "flow-1",
				Patch: map[string]any{"curvature": 0.5},
			},
			initial: State{
				Flows: map[string]*Flow{
					flow1ID: {ID: flow1ID},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Flows: map[string]*Flow{
					flow1ID: {ID: flow1ID, Curvature: 0.5},
				},
				Counter: 1,
				Clock:   1,
			},
		},
		"FlowDelete": {
			op: Operation{
				Type:  FlowDelete,
				Clock: 1,
				ID:    "flow-1",
			},
			initial: State{
				Flows: map[string]*Flow{
					flow1ID: {ID: flow1ID},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Flows:   map[string]*Flow{},
				Counter: 1,
				Clock:   1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got, succeeded := test.initial.Apply(test.op)
			if !succeeded {
				t.Errorf("expected operation to succeed")
			}
			if got.Counter != test.want.Counter {
				t.Errorf("counter mismatch: want %+v but got %+v", test.want.Counter, got.Counter)
			}
			if !reflect.DeepEqual(test.want.Flows, got.Flows) {
				t.Errorf("flows mismatch: want %+v but got %+v", test.want.Flows, got.Flows)
			}
		})
	}
}

func TestState_Apply_LoopOperations(t *testing.T) {
	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"LoopAdd": {
			op: Operation{
				Type:  LoopAdd,
				Clock: 1,
				Loop:  &Loop{ID: "loop-1"},
			},
			initial: State{
				Loops:   map[string]*Loop{},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Loops: map[string]*Loop{
					"loop-1": {ID: "loop-1"},
				},
				Counter: 2,
				Clock:   1,
			},
		},
		"LoopUpdate": {
			op: Operation{
				Type:  LoopUpdate,
				Clock: 1,
				ID:    "loop-1",
				Patch: map[string]any{"label": "updated"},
			},
			initial: State{
				Loops: map[string]*Loop{
					"loop-1": {ID: "loop-1", Label: "old"},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Loops: map[string]*Loop{
					"loop-1": {ID: "loop-1", Label: "updated"},
				},
				Counter: 1,
				Clock:   1,
			},
		},
		"LoopDelete": {
			op: Operation{
				Type:  LoopDelete,
				Clock: 1,
				ID:    "loop-1",
			},
			initial: State{
				Loops: map[string]*Loop{
					"loop-1": {ID: "loop-1"},
				},
				Counter: 1,
				Clock:   0,
			},
			want: State{
				Loops:   map[string]*Loop{},
				Counter: 1,
				Clock:   1,
			},
		},
	}

	for desc, test := range tests {
		t.Run(desc, func(t *testing.T) {
			got, succeeded := test.initial.Apply(test.op)
			if !succeeded {
				t.Errorf("expected operation to succeed")
			}
			if got.Counter != test.want.Counter {
				t.Errorf("counter mismatch: want %+v but got %+v", test.want.Counter, got.Counter)
			}
			if !reflect.DeepEqual(test.want.Loops, got.Loops) {
				t.Errorf("loops mismatch: want %+v but got %+v", test.want.Loops, got.Loops)
			}
		})
	}
}

func TestState_Apply_RejectOutdatedOp(t *testing.T) {
	state := State{Clock: 10}
	op := Operation{
		Type:  NodeAdd,
		Clock: 1,
		Node:  &Node{ID: "node-1"},
	}
	_, succeeded := state.Apply(op)
	if succeeded {
		t.Fatalf("outdated operation should fail")
	}
}
