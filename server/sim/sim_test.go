package sim

import (
	"fmt"
	"reflect"
	"server/graph"
	"testing"
)

func TestSimulate(t *testing.T) {
	stock1ID := fmt.Sprintf("stock%s1", graph.ID_SEPARATOR)
	flow1ID := fmt.Sprintf("flow%s1", graph.ID_SEPARATOR)
	node1ID := fmt.Sprintf("node%s1", graph.ID_SEPARATOR)
	node2ID := fmt.Sprintf("node%s2", graph.ID_SEPARATOR)

	tests := []struct {
		name    string
		request SimulationRequest
		want    float64
		wantErr bool
	}{
		{
			name: "Basic stock growth",
			request: SimulationRequest{
				Stocks: []StockInitial{{ID: stock1ID, InitialValue: 100, Inflow: []string{flow1ID}}},
				Variables: []VariableInitial{
					{
						ID:           flow1ID,
						Equation:     fmt.Sprintf("%s * 0.1", stock1ID),
						Dependencies: []string{stock1ID},
					},
				},
				Settings: SimulationSettings{StartTime: 0, EndTime: 2, Delta: 1},
			},
			want:    121.0,
			wantErr: false,
		},
		{
			name: "Circular dependency error",
			request: SimulationRequest{
				Variables: []VariableInitial{
					{ID: node1ID, Equation: node2ID, Dependencies: []string{node2ID}},
					{ID: node2ID, Equation: node1ID, Dependencies: []string{node1ID}},
				},
				Settings: SimulationSettings{StartTime: 0, EndTime: 1, Delta: 1},
			},
			wantErr: true,
		},
		{
			name: "Invalid Delta",
			request: SimulationRequest{
				Settings: SimulationSettings{StartTime: 0, EndTime: 1, Delta: 0},
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := simulate(tt.request)

			if (err != nil) != tt.wantErr {
				t.Fatalf("simulate() error = %v, wantErr %v", err, tt.wantErr)
			}

			if !tt.wantErr {
				finalResults := got.Results[len(got.Results)-1]
				var firstID string
				if len(tt.request.Stocks) > 0 {
					firstID = tt.request.Stocks[0].ID
					if finalResults.Values[firstID] != tt.want {
						t.Errorf("Final value for %s = %v, want %v", firstID, finalResults.Values[firstID], tt.want)
					}
				}
			}
		})
	}
}

func TestTopologicalSort(t *testing.T) {
	node1ID := fmt.Sprintf("node%s1", graph.ID_SEPARATOR)
	node2ID := fmt.Sprintf("node%s2", graph.ID_SEPARATOR)
	node3ID := fmt.Sprintf("node%s3", graph.ID_SEPARATOR)

	t.Run("Correct ordering", func(t *testing.T) {
		vars := []VariableInitial{
			{
				ID:           node1ID,
				Equation:     fmt.Sprintf("%s * 0.2 + %s * 0.1", node2ID, node3ID),
				Dependencies: []string{node2ID, node3ID},
			},
			{ID: node2ID, Equation: "1000", Dependencies: []string{}},
			{
				ID:           node3ID,
				Equation:     fmt.Sprintf("%s + 5", node2ID),
				Dependencies: []string{node2ID},
			},
		}

		got, err := topologicalSort(vars)
		if err != nil {
			t.Fatalf("Unexpected error: %v", err)
		}

		want := []string{node2ID, node3ID, node1ID}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("got %v, want %v", got, want)
		}
	})
}
