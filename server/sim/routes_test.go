package sim

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestRunSimulation(t *testing.T) {
	t.Run("Success Path", func(t *testing.T) {
		reqBody := SimulationRequest{
			Stocks:   []StockInitial{{ID: "s1", InitialValue: 10}},
			Settings: SimulationSettings{StartTime: 0, EndTime: 1, Delta: 1},
		}
		body, _ := json.Marshal(reqBody)

		req := httptest.NewRequest(http.MethodPost, "/simulate", bytes.NewBuffer(body))
		w := httptest.NewRecorder()

		RunSimulation(w, req)

		res := w.Result()
		if res.StatusCode != http.StatusOK {
			t.Errorf("expected status 200, got %d", res.StatusCode)
		}

		if res.Header.Get("Content-Type") != "application/json" {
			t.Errorf("expected json content type, got %s", res.Header.Get("Content-Type"))
		}

		var result SimulationResult
		if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
			t.Fatalf("could not decode response: %v", err)
		}
	})

	t.Run("Invalid JSON failure", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/simulate", strings.NewReader("{ invalid json }"))
		w := httptest.NewRecorder()

		RunSimulation(w, req)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected status 400 for bad JSON, got %d", w.Code)
		}
	})
}
