import {
    type Cloud,
    type Edge,
    type Flow,
    makeCloudId,
    makeEdgeId,
    makeFlowId,
    makeNodeId,
    makeStockId,
    type Node,
    type Polarity,
    type Stock,
} from "@/models/graph";
import type { Operation } from "@/models/operation";
import { useGraphStore } from "@/stores/graph";
import { sendGraphOperation } from "@/sync/graph";

function dispatch(op: Operation) {
    const state = useGraphStore.getState();
    state.apply(op);
    sendGraphOperation(op);
}

export function addNode(x: number, y: number, radius = 32) {
    const state = useGraphStore.getState();

    const node: Node = {
        id: makeNodeId(state.counter),
        x,
        y,
        radius,
        label: "",
        description: "",
        equation: "",
    };

    const op: Operation = { type: "node/add", node };
    dispatch(op);
}

export function updateNode(id: string, patch: Partial<Node>) {
    const op: Operation = { type: "node/update", id, patch };
    dispatch(op);
}

export function deleteNode(id: string) {
    const op: Operation = { type: "node/delete", id };
    dispatch(op);
}

export function addEdge(
    from: string,
    to: string,
    polarity: Polarity | null = null,
    curvature: number = 0.25,
) {
    const state = useGraphStore.getState();

    const edge: Edge = {
        id: makeEdgeId(state.counter),
        from,
        to,
        polarity,
        curvature,
    };

    const op: Operation = { type: "edge/add", edge };
    dispatch(op);
}

export function updateEdge(id: string, patch: Partial<Edge>) {
    const op: Operation = { type: "edge/update", id, patch };
    dispatch(op);
}

export function deleteEdge(id: string) {
    const op: Operation = { type: "edge/delete", id };
    dispatch(op);
}

export function addStock(x: number, y: number, width = 128, height = 64) {
    const state = useGraphStore.getState();

    const stock: Stock = {
        id: makeStockId(state.counter),
        x,
        y,
        width,
        height,
        label: "",
        description: "",
        equation: "",
    };

    const op: Operation = { type: "stock/add", stock };
    dispatch(op);
}

export function updateStock(id: string, patch: Partial<Stock>) {
    const op: Operation = { type: "stock/update", id, patch };
    dispatch(op);
}

export function deleteStock(id: string) {
    const op: Operation = { type: "stock/delete", id };
    dispatch(op);
}

export function addCloud(x: number, y: number, radius = 32) {
    const state = useGraphStore.getState();

    const cloud: Cloud = {
        id: makeCloudId(state.counter),
        x,
        y,
        radius,
    };

    const op: Operation = { type: "cloud/add", cloud };
    dispatch(op);
}

export function updateCloud(id: string, patch: Partial<Cloud>) {
    const op: Operation = { type: "cloud/update", id, patch };
    dispatch(op);
}

export function deleteCloud(id: string) {
    const op: Operation = { type: "cloud/delete", id };
    dispatch(op);
}

export function addFlow(from: string, to: string, curvature: number = 0) {
    const state = useGraphStore.getState();

    const flow: Flow = {
        id: makeFlowId(state.counter),
        from,
        to,
        curvature,
        equation: "",
    };

    const op: Operation = { type: "flow/add", flow };
    dispatch(op);
}

export function updateFlow(id: string, patch: Partial<Flow>) {
    const op: Operation = { type: "flow/update", id, patch };
    dispatch(op);
}

export function deleteFlow(id: string) {
    const op: Operation = { type: "flow/delete", id };
    dispatch(op);
}
