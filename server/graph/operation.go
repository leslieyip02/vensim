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
)

type Operation struct {
	Type     OperationType `json:"type"`
	SenderId string        `json:"senderId"`

	Node  *Node  `json:"node,omitempty"`
	Edge  *Edge  `json:"edge,omitempty"`
	Stock *Stock `json:"stock,omitempty"`
	Cloud *Cloud `json:"cloud,omitempty"`
	Flow  *Flow  `json:"flow,omitempty"`

	ID    string         `json:"id,omitempty"`
	Patch map[string]any `json:"patch,omitempty"`
}

func (s *State) Apply(op Operation) *State {
	switch op.Type {
	case NodeAdd:
		s.Nodes[op.Node.ID] = op.Node
		s.Counter++

	case NodeUpdate:
		node := s.Nodes[op.ID]
		applyPatch(node, op.Patch)

	case NodeDelete:
		delete(s.Nodes, op.ID)

	case EdgeAdd:
		s.Edges[op.Edge.ID] = op.Edge
		s.Counter++

	case EdgeUpdate:
		edge := s.Edges[op.ID]
		applyPatch(edge, op.Patch)

	case EdgeDelete:
		delete(s.Edges, op.ID)

	case StockAdd:
		s.Stocks[op.Stock.ID] = op.Stock
		s.Counter++

	case StockUpdate:
		stock := s.Stocks[op.ID]
		applyPatch(stock, op.Patch)

	case StockDelete:
		delete(s.Stocks, op.ID)

	case CloudAdd:
		s.Clouds[op.Cloud.ID] = op.Cloud
		s.Counter++

	case CloudUpdate:
		cloud := s.Clouds[op.ID]
		applyPatch(cloud, op.Patch)

	case CloudDelete:
		delete(s.Clouds, op.ID)

	case FlowAdd:
		s.Flows[op.Flow.ID] = op.Flow
		s.Counter++

	case FlowUpdate:
		flow := s.Flows[op.ID]
		applyPatch(flow, op.Patch)

	case FlowDelete:
		delete(s.Flows, op.ID)
	}

	return s
}

func applyPatch(target any, patch map[string]any) {
	b, _ := json.Marshal(patch)
	_ = json.Unmarshal(b, target)
}
