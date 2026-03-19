import {
    type SimulationRequest,
    type SimulationResult,
    type SimulationSettings,
} from "@/models/simulation";
import { useGraphStore } from "@/stores/graph";

const HOST = import.meta.env.VITE_HOST || window.location.host;
const API_ORIGIN = `${HOST.startsWith("localhost") ? "http" : "https"}://${HOST}`;

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

    const res = await fetch(`${API_ORIGIN}/api/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let errorText = await res.text();

        // replace entity ids with labels
        const allEntities = [
            ...Object.values(state.nodes),
            ...Object.values(state.stocks),
            ...Object.values(state.flows),
        ];

        allEntities.forEach((entity) => {
            if (entity.id && entity.label) {
                const regex = new RegExp(entity.id, "g");
                errorText = errorText.replace(regex, `'${entity.label}'`);
            }
        });

        throw new Error(errorText || "Failed to run simulation");
    }

    return await res.json();
}
