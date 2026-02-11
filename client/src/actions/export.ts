import { useGraphStore } from "@/stores/graph";

export async function importState(file: File) {
    const state = await file.text().then(JSON.parse);
    useGraphStore.setState(state);
}

export function exportState() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    const { apply, ...state } = useGraphStore.getState();

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
