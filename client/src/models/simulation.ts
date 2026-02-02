export interface StockInitial {
    id: string;
    initialValue: number;
    inflow: string[];
    outflow: string[];
}

export interface VariableInitial {
    id: string;
    equation: string;
    dependencies: string[];
}

export interface SimulationSettings {
    startTime: number;
    endTime: number;
    delta: number;
}

export interface SimulationRequest {
    settings: SimulationSettings;
    stocks: StockInitial[];
    variables: VariableInitial[];
}

export interface TimeResult {
    timestamp: number;
    values: Record<string, number>;
}

export interface SimulationResult {
    results: TimeResult[];
}
