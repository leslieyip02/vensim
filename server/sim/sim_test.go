package sim

import (
	"reflect"
	"testing"
)

func TestSimulate(t *testing.T) {
	tests := []struct {
		name    string
		request SimulationRequest
		want    float64
		wantErr bool
	}{
		{
			name: "Basic stock growth",
			request: SimulationRequest{
				Stocks: []StockInitial{{ID: "stock_1", InitialValue: 100, Inflow: []string{"flow_1"}}},
				Variables: []VariableInitial{
					{ID: "flow_1", Equation: "stock_1 * 0.1", Dependencies: []string{"stock_1"}},
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
					{ID: "node_1", Equation: "node_2", Dependencies: []string{"node_2"}},
					{ID: "node_2", Equation: "node_1", Dependencies: []string{"node_1"}},
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
	t.Run("Correct ordering", func(t *testing.T) {
		vars := []VariableInitial{
			{ID: "node_1", Equation: "node_2 * 0.2 + node_3 * 0.1", Dependencies: []string{"node_2", "node_3"}},
			{ID: "node_2", Equation: "1000", Dependencies: []string{}},
			{ID: "node_3", Equation: "node_2 + 5", Dependencies: []string{"node_2"}},
		}

		got, err := topologicalSort(vars)
		if err != nil {
			t.Fatalf("Unexpected error: %v", err)
		}

		want := []string{"node_2", "node_3", "node_1"}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("got %v, want %v", got, want)
		}
	})
}
