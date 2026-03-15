import { useGraphStore } from "@/stores/graph";

export function haveNonEmptyEquations(): boolean {
    const state = useGraphStore.getState();
    const entities = [...Object.values(state.nodes), ...Object.values(state.flows)];
    if (entities.length === 0) return false;
    return entities.every(e => e.equation && e.equation.trim() !== "");
}

export function haveAllInitialValues(): boolean {
    const state = useGraphStore.getState();
    const stocks = Object.values(state.stocks);
    if (stocks.length === 0) return false;
    return stocks.every(s => s.initialValue !== undefined && s.initialValue !== null);
}

export function haveUniqueNames(): boolean {
    const state = useGraphStore.getState();
    const names = [
        ...Object.values(state.nodes),
        ...Object.values(state.stocks),
        ...Object.values(state.flows)
    ].map(e => e.label || e.id);

    return new Set(names).size === names.length;
}

export function haveStock(): boolean {
    const state = useGraphStore.getState();
    const hasStock = Object.keys(state.stocks).length > 0;
    return hasStock;
}