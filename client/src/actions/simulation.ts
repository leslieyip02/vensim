import {
    type SimulationRequest,
    type SimulationResult,
    type SimulationSettings,
} from "@/models/simulation";
import { useGraphStore } from "@/stores/graph";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;

export async function runSimulation(settings: SimulationSettings): Promise<SimulationResult> {
    const state = useGraphStore.getState();

    const stocks = Object.values(state.stocks).map((stock) => {
        const inflows = Object.values(state.flows)
            .filter((f) => f.to === stock.id)
            .map((f) => f.id);
        const outflows = Object.values(state.flows)
            .filter((f) => f.from === stock.id)
            .map((f) => f.id);

        return {
            id: stock.id,
            initialValue: stock.initialValue,
            inflow: inflows,
            outflow: outflows,
        };
    });

    const variables = [
        ...Object.values(state.nodes).map((node) => ({
            id: node.id,
            equation: node.equation,
            dependencies: Object.values(state.edges)
                .filter((e) => e.to === node.id)
                .filter((e) => e.from != e.to)
                .map((e) => e.from),
        })),
        ...Object.values(state.flows).map((flow) => ({
            id: flow.id,
            equation: flow.equation,
            dependencies: Object.values(state.edges)
                .filter((e) => e.to === flow.id)
                .filter((e) => e.from != e.to)
                .map((e) => e.from),
        })),
    ];

    const payload: SimulationRequest = {
        settings,
        stocks,
        variables,
    };

    const res = await fetch(`${API_ORIGIN}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to run simulation");
    }

    return await res.json();
}
