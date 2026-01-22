import { makeEdgeId, makeNodeId, makeStockId, type Edge, type Node, type Polarity, type Stock } from "@/models/graph";
import type { Operation } from "@/models/operation";
import { useGraphStore } from "@/stores/graph";
import { sendGraphOperation } from "@/sync/graph";

export function addNode(x: number, y: number, radius = 32) {
    const state = useGraphStore.getState();

    const node = {
        id: makeNodeId(state.counter),
        x,
        y,
        radius,
        label: "",
        description: "",
    };

    const op: Operation = { type: "node/add", node };
    state.apply(op);
    sendGraphOperation(op);
}

export function updateNode(id: string, patch: Partial<Node>) {
    const state = useGraphStore.getState();

    const op: Operation = { type: "node/update", id, patch };
    state.apply(op);
    sendGraphOperation(op);
}

export function deleteNode(id: string) {
    const state = useGraphStore.getState();

    const op: Operation = { type: "node/delete", id };
    state.apply(op);
    sendGraphOperation(op);
}

export function addEdge(
    from: string,
    to: string,
    polarity: Polarity = "+",
    curvature: number = 0.25,
) {
    const state = useGraphStore.getState();

    const edge = {
        id: makeEdgeId(state.counter),
        from,
        to,
        polarity,
        curvature,
    };

    const op: Operation = { type: "edge/add", edge };
    state.apply(op);
    sendGraphOperation(op);
}

export function updateEdge(id: string, patch: Partial<Edge>) {
    const state = useGraphStore.getState();

    const op: Operation = { type: "edge/update", id, patch };
    state.apply(op);
    sendGraphOperation(op);
}

export function deleteEdge(id: string) {
    const state = useGraphStore.getState();

    const op: Operation = { type: "edge/delete", id };
    state.apply(op);
    sendGraphOperation(op);
}

export function addStock(x: number, y: number, width = 128, height = 64) {
    const state = useGraphStore.getState();

    const stock = {
        id: makeStockId(state.counter),
        x,
        y,
        width,
        height,
        label: "",
        description: "",
    };

    const op: Operation = { type: "stock/add", stock };
    state.apply(op);
    sendGraphOperation(op);
}

export function updateStock(id: string, patch: Partial<Stock>) {
    const state = useGraphStore.getState();

    const op: Operation = { type: "stock/update", id, patch };
    state.apply(op);
    sendGraphOperation(op);
}

export function deleteStock(id: string) {
    const state = useGraphStore.getState();

    const op: Operation = { type: "stock/delete", id };
    state.apply(op);
    sendGraphOperation(op);
}