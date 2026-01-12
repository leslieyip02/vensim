package graph

import "encoding/json"

type OperationType string

const (
	NodeAdd    OperationType = "node/add"
	NodeUpdate OperationType = "node/update"
	NodeDelete OperationType = "node/delete"
	EdgeAdd    OperationType = "edge/add"
	EdgeUpdate OperationType = "edge/update"
	EdgeDelete OperationType = "edge/delete"
)

type Operation struct {
	Type     OperationType `json:"type"`
	SenderId string        `json:"senderId"`

	Node *Node `json:"node,omitempty"`
	Edge *Edge `json:"edge,omitempty"`

	ID    string         `json:"id,omitempty"`
	Patch map[string]any `json:"patch,omitempty"`
}

func (s *State) Apply(op Operation) {
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
	}
}

func applyPatch(target any, patch map[string]any) {
	b, _ := json.Marshal(patch)
	_ = json.Unmarshal(b, target)
}
