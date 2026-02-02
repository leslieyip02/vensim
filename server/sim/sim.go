package sim

import (
	"fmt"

	"github.com/expr-lang/expr"
	"github.com/expr-lang/expr/vm"
)

func simulate(req SimulationRequest) (SimulationResult, error) {
	currValues := make(map[string]float64)

	for _, s := range req.Stocks {
		currValues[s.ID] = s.InitialValue
	}
	for _, v := range req.Variables {
		currValues[v.ID] = 0.0
	}

	programs := make(map[string]*vm.Program)
	for _, v := range req.Variables {
		program, err := expr.Compile(v.Equation, expr.Env(currValues), expr.AsFloat64())
		if err != nil {
			return SimulationResult{}, fmt.Errorf("error compiling equation for %s: %w", v.ID, err)
		}
		programs[v.ID] = program
	}

	var results []TimeResult
	timestamp := req.Settings.StartTime
	delta := req.Settings.Delta
	endTime := req.Settings.EndTime

	if delta <= 0 {
		return SimulationResult{}, fmt.Errorf("delta must be > 0")
	}
	if endTime < timestamp {
		return SimulationResult{}, fmt.Errorf("endTime must be >= startTime")
	}

	sortedVarIds, err := topologicalSort((req.Variables))
	if err != nil {
		return SimulationResult{}, err
	}

	stepCount := 0
	for timestamp <= endTime {
		// variables are evaluated in topological order
		for _, varId := range sortedVarIds {
			program := programs[varId]
			output, err := expr.Run(program, currValues)
			if err != nil {
				return SimulationResult{}, fmt.Errorf("error evaluating %s at time %f: %w", varId, timestamp, err)
			}
			currValues[varId] = output.(float64)
		}

		// save timestamp snapshot
		snapshot := make(map[string]float64, len(currValues))
		for id, value := range currValues {
			snapshot[id] = value
		}
		results = append(results, TimeResult{
			Timestamp: timestamp,
			Values:    snapshot,
		})

		// update stocks for next timestamp
		for _, s := range req.Stocks {
			netFlow := 0.0
			for _, flowId := range s.Inflow {
				netFlow += currValues[flowId]
			}
			for _, flowId := range s.Outflow {
				netFlow -= currValues[flowId]
			}
			currValues[s.ID] = currValues[s.ID] + (netFlow * delta)
		}

		// increment timestamp
		stepCount++
		timestamp = req.Settings.StartTime + (float64(stepCount) * delta)
	}

	return SimulationResult{Results: results}, nil
}

func topologicalSort(variables []VariableInitial) ([]string, error) {
	varMap := make(map[string]VariableInitial)
	for _, v := range variables {
		varMap[v.ID] = v
	}

	visited := make(map[string]bool)
	visiting := make(map[string]bool)
	sortedVarIds := []string{}

	var dfs func(id string) error
	dfs = func(id string) error {
		if visited[id] {
			return nil
		}

		// cycle checking
		if visiting[id] {
			return fmt.Errorf("circular dependency detected involving variable: %s", id)
		}

		visiting[id] = true
		variable, isVariable := varMap[id]
		if isVariable {
			for _, depId := range variable.Dependencies {
				if err := dfs(depId); err != nil {
					return err
				}
			}
		}

		visiting[id] = false
		visited[id] = true

		if isVariable {
			sortedVarIds = append(sortedVarIds, id)
		}
		return nil
	}

	for _, v := range variables {
		if !visited[v.ID] {
			if err := dfs(v.ID); err != nil {
				return nil, err
			}
		}
	}

	return sortedVarIds, nil
}
