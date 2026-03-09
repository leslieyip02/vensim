package graph

import "encoding/json"

type OperationType string

const (
	NodeAdd     OperationType = "node/add"
	NodeUpdate  OperationType = "node/update"
	NodeDelete  OperationType = "node/delete"
	EdgeAdd     OperationType = "edge/add"
	EdgeUpdate  OperationType = "edge/update"
	EdgeDelete  OperationType = "edge/delete"
	StockAdd    OperationType = "stock/add"
	StockUpdate OperationType = "stock/update"
	StockDelete OperationType = "stock/delete"
	CloudAdd    OperationType = "cloud/add"
	CloudUpdate OperationType = "cloud/update"
	CloudDelete OperationType = "cloud/delete"
	FlowAdd     OperationType = "flow/add"
	FlowUpdate  OperationType = "flow/update"
	FlowDelete  OperationType = "flow/delete"
	LoopAdd     OperationType = "loop/add"
	LoopUpdate  OperationType = "loop/update"
	LoopDelete  OperationType = "loop/delete"
)

type Operation struct {
	Type OperationType `json:"type"`

	Node  *Node  `json:"node,omitempty"`
	Edge  *Edge  `json:"edge,omitempty"`
	Stock *Stock `json:"stock,omitempty"`
	Cloud *Cloud `json:"cloud,omitempty"`
	Flow  *Flow  `json:"flow,omitempty"`
	Loop  *Loop  `json:"loop,omitempty"`

	ID    string         `json:"id,omitempty"`
	Patch map[string]any `json:"patch,omitempty"`
}

// Returns a tuple of the resultant state and a bool flag to indicate whether the update was applied
func (s *State) Apply(op Operation) (*State, bool) {
	switch op.Type {
	case NodeAdd:
		s.Nodes[op.Node.ID] = op.Node
		s.Counter++

	case NodeUpdate:
		node, found := s.Nodes[op.ID]
		if !found {
			return s, false
		}
		applyPatch(node, op.Patch)

	case NodeDelete:
		delete(s.Nodes, op.ID)

	case EdgeAdd:
		s.Edges[op.Edge.ID] = op.Edge
		s.Counter++

	case EdgeUpdate:
		edge, found := s.Edges[op.ID]
		if !found {
			return s, false
		}
		applyPatch(edge, op.Patch)

	case EdgeDelete:
		delete(s.Edges, op.ID)

	case StockAdd:
		s.Stocks[op.Stock.ID] = op.Stock
		s.Counter++

	case StockUpdate:
		stock, found := s.Stocks[op.ID]
		if !found {
			return s, false
		}
		applyPatch(stock, op.Patch)

	case StockDelete:
		delete(s.Stocks, op.ID)

	case CloudAdd:
		s.Clouds[op.Cloud.ID] = op.Cloud
		s.Counter++

	case CloudUpdate:
		cloud, found := s.Clouds[op.ID]
		if !found {
			return s, false
		}
		applyPatch(cloud, op.Patch)

	case CloudDelete:
		delete(s.Clouds, op.ID)

	case FlowAdd:
		s.Flows[op.Flow.ID] = op.Flow
		s.Counter++

	case FlowUpdate:
		flow, found := s.Flows[op.ID]
		if !found {
			return s, false
		}
		applyPatch(flow, op.Patch)

	case FlowDelete:
		delete(s.Flows, op.ID)

	case LoopAdd:
		s.Loops[op.Loop.ID] = op.Loop
		s.Counter++

	case LoopUpdate:
		loop, found := s.Loops[op.ID]
		if !found {
			return s, false
		}
		applyPatch(loop, op.Patch)

	case LoopDelete:
		delete(s.Loops, op.ID)
	}

	return s, true
}

func applyPatch(target any, patch map[string]any) {
	b, _ := json.Marshal(patch)
	_ = json.Unmarshal(b, target)
}
