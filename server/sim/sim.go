package sim

import (
	"fmt"
	"math"

	"github.com/expr-lang/expr"
	"github.com/expr-lang/expr/vm"
)

func simulate(req SimulationRequest) (SimulationResult, error) {
	timestamp := req.Settings.StartTime
	delta := req.Settings.Delta
	endTime := req.Settings.EndTime

	if delta <= 0 {
		return SimulationResult{}, fmt.Errorf("delta must be > 0")
	}
	if endTime < timestamp {
		return SimulationResult{}, fmt.Errorf("endTime must be >= startTime")
	}

	currValues := make(map[string]float64)
	env := make(map[string]interface{})

	// inject custom functions
	for name, fn := range CustomFunctions {
		env[name] = fn(env)
	}

	// initialise stocks and variables
	for _, s := range req.Stocks {
		currValues[s.ID] = s.InitialValue
		env[s.ID] = s.InitialValue
	}
	for _, v := range req.Variables {
		currValues[v.ID] = 0.0
		env[v.ID] = 0.0
	}

	// compile equations
	programs := make(map[string]*vm.Program, len(req.Variables))
	for _, v := range req.Variables {
		program, err := expr.Compile(
			v.Equation,
			expr.Env(env),
			expr.AsFloat64(),
		)
		if err != nil {
			return SimulationResult{}, fmt.Errorf("error compiling equation for %s: %w", v.ID, err)
		}
		programs[v.ID] = program
	}

	// sort variable evaluation topoligically
	sortedVarIds, err := topologicalSort(req.Variables)
	if err != nil {
		return SimulationResult{}, err
	}

	estimatedSteps := int(math.Ceil((endTime-timestamp)/delta)) + 1
	if estimatedSteps < 0 {
		estimatedSteps = 0
	}
	results := make([]TimeResult, 0, estimatedSteps)

	stepCount := 0
	for timestamp <= endTime {
		env["currentTime"] = timestamp
		for _, varId := range sortedVarIds {
			program := programs[varId]
			output, err := expr.Run(program, env)
			if err != nil {
				return SimulationResult{}, fmt.Errorf(
					"error evaluating %s at time %f: %w",
					varId,
					timestamp,
					err,
				)
			}

			val := output.(float64)
			currValues[varId] = val
			env[varId] = val
		}

		snapshot := make(map[string]float64, len(currValues))
		for id, value := range currValues {
			snapshot[id] = value
		}

		results = append(results, TimeResult{
			Timestamp: timestamp,
			Values:    snapshot,
		})

		for _, s := range req.Stocks {
			netFlow := 0.0

			for _, flowId := range s.Inflow {
				netFlow += currValues[flowId]
			}
			for _, flowId := range s.Outflow {
				netFlow -= currValues[flowId]
			}

			result := currValues[s.ID] + (netFlow * delta)
			if result < 0 {
				result = 0
			}

			currValues[s.ID] = result
			env[s.ID] = result
		}

		stepCount++
		timestamp = req.Settings.StartTime + (float64(stepCount) * delta)
	}

	return SimulationResult{Results: results}, nil
}

func topologicalSort(variables []VariableInitial) ([]string, error) {
	varMap := make(map[string]VariableInitial, len(variables))
	for _, v := range variables {
		varMap[v.ID] = v
	}

	visited := make(map[string]bool, len(variables))
	visiting := make(map[string]bool, len(variables))
	sortedVarIds := make([]string, 0, len(variables))

	var dfs func(id string) error
	dfs = func(id string) error {
		if visited[id] {
			return nil
		}

		if visiting[id] {
			return fmt.Errorf("circular dependency detected involving variable: %s", id)
		}

		visiting[id] = true
		if variable, isVariable := varMap[id]; isVariable {
			for _, depId := range variable.Dependencies {
				if err := dfs(depId); err != nil {
					return err
				}
			}
		}

		visiting[id] = false
		visited[id] = true

		if _, isVariable := varMap[id]; isVariable {
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
