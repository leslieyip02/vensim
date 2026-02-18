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
				Type: NodeAdd,
				Node: &Node{ID: node1ID},
			},
			initial: State{
				Nodes:   map[string]*Node{},
				Counter: 1,
			},
			want: State{
				Nodes: map[string]*Node{
					node1ID: {ID: node1ID},
				},
				Counter: 2,
			},
		},
		"NodeUpdate": {
			op: Operation{
				Type:  NodeUpdate,
				ID:    node1ID,
				Patch: map[string]any{"x": 30.0},
			},
			initial: State{
				Nodes: map[string]*Node{
					node1ID: {ID: node1ID},
				},
				Counter: 1,
			},
			want: State{
				Nodes: map[string]*Node{
					node1ID: {ID: node1ID, X: 30.0},
				},
				Counter: 1,
			},
		},
		"NodeDelete": {
			op: Operation{
				Type: NodeDelete,
				ID:   node1ID,
			},
			initial: State{
				Nodes: map[string]*Node{
					node1ID: {ID: node1ID},
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
	edge1ID := fmt.Sprintf("edge%s1", ID_SEPARATOR)

	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"EdgeAdd": {
			op: Operation{
				Type: EdgeAdd,
				Edge: &Edge{ID: edge1ID},
			},
			initial: State{
				Edges:   map[string]*Edge{},
				Counter: 1,
			},
			want: State{
				Edges: map[string]*Edge{
					edge1ID: {ID: edge1ID},
				},
				Counter: 2,
			},
		},
		"EdgeUpdate": {
			op: Operation{
				Type:  EdgeUpdate,
				ID:    edge1ID,
				Patch: map[string]any{"to": "c"},
			},
			initial: State{
				Edges: map[string]*Edge{
					edge1ID: {ID: edge1ID, From: "a", To: "b"},
				},
				Counter: 1,
			},
			want: State{
				Edges: map[string]*Edge{
					edge1ID: {ID: edge1ID, From: "a", To: "c"},
				},
				Counter: 1,
			},
		},
		"EdgeDelete": {
			op: Operation{
				Type: EdgeDelete,
				ID:   edge1ID,
			},
			initial: State{
				Edges: map[string]*Edge{
					edge1ID: {ID: edge1ID},
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
	stock1ID := fmt.Sprintf("stock%s1", ID_SEPARATOR)

	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"StockAdd": {
			op: Operation{
				Type:  StockAdd,
				Stock: &Stock{ID: stock1ID},
			},
			initial: State{
				Stocks:  map[string]*Stock{},
				Counter: 1,
			},
			want: State{
				Stocks: map[string]*Stock{
					stock1ID: {ID: stock1ID},
				},
				Counter: 2,
			},
		},
		"StockUpdate": {
			op: Operation{
				Type:  StockUpdate,
				ID:    stock1ID,
				Patch: map[string]any{"x": 30.0},
			},
			initial: State{
				Stocks: map[string]*Stock{
					stock1ID: {ID: stock1ID},
				},
				Counter: 1,
			},
			want: State{
				Stocks: map[string]*Stock{
					stock1ID: {ID: stock1ID, X: 30.0},
				},
				Counter: 1,
			},
		},
		"StockDelete": {
			op: Operation{
				Type: StockDelete,
				ID:   stock1ID,
			},
			initial: State{
				Stocks: map[string]*Stock{
					stock1ID: {ID: stock1ID},
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
	cloud1ID := fmt.Sprintf("cloud%s1", ID_SEPARATOR)

	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"CloudAdd": {
			op: Operation{
				Type:  CloudAdd,
				Cloud: &Cloud{ID: cloud1ID},
			},
			initial: State{
				Clouds:  map[string]*Cloud{},
				Counter: 1,
			},
			want: State{
				Clouds: map[string]*Cloud{
					cloud1ID: {ID: cloud1ID},
				},
				Counter: 2,
			},
		},
		"CloudUpdate": {
			op: Operation{
				Type:  CloudUpdate,
				ID:    cloud1ID,
				Patch: map[string]any{"x": 30.0},
			},
			initial: State{
				Clouds: map[string]*Cloud{
					cloud1ID: {ID: cloud1ID},
				},
				Counter: 1,
			},
			want: State{
				Clouds: map[string]*Cloud{
					cloud1ID: {ID: cloud1ID, X: 30.0},
				},
				Counter: 1,
			},
		},
		"CloudDelete": {
			op: Operation{
				Type: CloudDelete,
				ID:   cloud1ID,
			},
			initial: State{
				Clouds: map[string]*Cloud{
					cloud1ID: {ID: cloud1ID},
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
	flow1ID := fmt.Sprintf("flow%s1", ID_SEPARATOR)

	tests := map[string]struct {
		op      Operation
		initial State
		want    State
	}{
		"FlowAdd": {
			op: Operation{
				Type: FlowAdd,
				Flow: &Flow{ID: flow1ID},
			},
			initial: State{
				Flows:   map[string]*Flow{},
				Counter: 1,
			},
			want: State{
				Flows: map[string]*Flow{
					flow1ID: {ID: flow1ID},
				},
				Counter: 2,
			},
		},
		"FlowUpdate": {
			op: Operation{
				Type:  FlowUpdate,
				ID:    flow1ID,
				Patch: map[string]any{"curvature": 0.5},
			},
			initial: State{
				Flows: map[string]*Flow{
					flow1ID: {ID: flow1ID},
				},
				Counter: 1,
			},
			want: State{
				Flows: map[string]*Flow{
					flow1ID: {ID: flow1ID, Curvature: 0.5},
				},
				Counter: 1,
			},
		},
		"FlowDelete": {
			op: Operation{
				Type: FlowDelete,
				ID:   flow1ID,
			},
			initial: State{
				Flows: map[string]*Flow{
					flow1ID: {ID: flow1ID},
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
