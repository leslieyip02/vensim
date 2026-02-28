import { useGraphStore } from "@/stores/graph";

export async function importState(file: File) {
    const state = await file.text().then(JSON.parse);
    useGraphStore.setState(state);
}

export function exportState() {
    const state = getCleanState();
    const blob = new Blob([JSON.stringify(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "graph.json";
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getCleanState() {
    const state = useGraphStore.getState();

    return {
        counter: state.counter,
        nodes: purgeSelections(state.nodes),
        edges: purgeSelections(state.edges),
        stocks: purgeSelections(state.stocks),
        clouds: purgeSelections(state.clouds),
        flows: purgeSelections(state.flows),
    };
}

function purgeSelections(records: Record<string, object>) {
    // remove selectedBy since that locks an entity from being edited
    return Object.fromEntries(
        Object.entries(records).map(([key, entity]) => [key, { ...entity, selectedBy: null }]),
    );
}
