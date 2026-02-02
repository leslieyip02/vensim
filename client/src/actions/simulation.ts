import {
    type SimulationRequest,
    type SimulationResult,
    type SimulationSettings,
} from "@/models/simulation";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;

export async function runSimulation(settings: SimulationSettings): Promise<SimulationResult> {
    const samplePayload: SimulationRequest = {
        settings,
        stocks: [{ id: "stock_1", initialValue: 100, inflow: ["flow_1"], outflow: [] }],
        variables: [
            { id: "node_1", equation: "100", dependencies: [] },
            { id: "flow_1", equation: "node_1 * 0.05 * stock_1 * 0.01", dependencies: ["node_1"] },
        ],
    };

    const res = await fetch(`${API_ORIGIN}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePayload),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to run simulation");
    }

    return await res.json();
}
