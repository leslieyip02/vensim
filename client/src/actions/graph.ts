import {
    type Cloud,
    type Edge,
    type Flow,
    type Node,
    type Polarity,
    type Stock,
} from "@/models/graph";
import type { Operation, OperationType } from "@/models/operation";
import { useGraphStore } from "@/stores/graph";
import { sendGraphOperation } from "@/sync/socket";

function dispatch(op: Operation) {
    const state = useGraphStore.getState();
    state.apply(op);
    sendGraphOperation(op);
}

// ==============
//  Common logic
// ==============

export function addEntity(entityType: string, entity: Partial<unknown>) {
    const id = useGraphStore.getState().getNextId(entityType);
    entity = { id, ...entity };

    const op = { type: `${entityType}/add` as OperationType, [entityType]: entity } as Operation;
    dispatch(op);
}

export function updateEntity(entityType: string, id: string, patch: Partial<unknown>) {
    const op = { type: `${entityType}/update` as OperationType, id, patch } as Operation;
    dispatch(op);
}

export function deleteEntity(entityType: string, id: string) {
    const op = { type: `${entityType}/delete` as OperationType, id } as Operation;
    dispatch(op);
}

// =======================
//  Entity specific logic
// =======================

export function addNode(x: number, y: number, radius: number = 32) {
    const node = makePartialNode(x, y, radius);
    addEntity("node", node);
}

export function updateNode(id: string, patch: Partial<Node>) {
    updateEntity("node", id, patch);
}

export function deleteNode(id: string) {
    const state = useGraphStore.getState();

    Object.values(state.edges)
        .filter((edge) => edge.from === id || edge.to === id)
        .forEach((edge) => deleteEdge(edge.id));

    deleteEntity("node", id);
}

export function addEdge(
    from: string,
    to: string,
    polarity: Polarity | null = null,
    curvature: number = 0.25,
) {
    const edge = makePartialEdge(from, to, polarity, curvature);
    addEntity("edge", edge);
}

export function updateEdge(id: string, patch: Partial<Edge>) {
    updateEntity("edge", id, patch);
}

export function deleteEdge(id: string) {
    deleteEntity("edge", id);
}

export function addStock(x: number, y: number, width = 128, height = 64) {
    const stock = makePartialStock(x, y, width, height);
    addEntity("stock", stock);
}

export function updateStock(id: string, patch: Partial<Stock>) {
    updateEntity("stock", id, patch);
}

export function deleteStock(id: string) {
    const state = useGraphStore.getState();

    Object.values(state.edges)
        .filter((edge) => edge.from === id)
        .forEach((edge) => deleteEdge(edge.id));

    Object.values(state.flows)
        .filter((flow) => flow.from === id || flow.to === id)
        .forEach((flow) => deleteFlow(flow.id));

    deleteEntity("stock", id);
}

export function addCloud(x: number, y: number, radius = 32) {
    const cloud = makePartialCloud(x, y, radius);
    addEntity("cloud", cloud);
}

export function updateCloud(id: string, patch: Partial<Cloud>) {
    updateEntity("cloud", id, patch);
}

export function deleteCloud(id: string) {
    const state = useGraphStore.getState();

    Object.values(state.flows)
        .filter((flow) => flow.from === id || flow.to === id)
        .forEach((flow) => deleteFlow(flow.id));

    deleteEntity("cloud", id);
}

export function addFlow(from: string, to: string, curvature: number = 0) {
    const flow = makePartialFlow(from, to, curvature);
    addEntity("flow", flow);
}

export function updateFlow(id: string, patch: Partial<Flow>) {
    updateEntity("flow", id, patch);
}

export function deleteFlow(id: string) {
    const state = useGraphStore.getState();

    Object.values(state.edges)
        .filter((edge) => edge.to === id)
        .forEach((edge) => deleteEdge(edge.id));

    deleteEntity("flow", id);
}

// =============================
//  Entity construction helpers
// =============================

function makePartialNode(x: number, y: number, radius: number): Partial<Node> {
    return {
        selectedBy: null,
        x,
        y,
        radius,
        label: "",
        description: "",
        equation: "",
    };
}

function makePartialEdge(
    from: string,
    to: string,
    polarity: Polarity | null,
    curvature: number,
): Partial<Edge> {
    return {
        selectedBy: null,
        from,
        to,
        polarity,
        curvature,
    };
}

function makePartialStock(x: number, y: number, width: number, height: number): Partial<Stock> {
    return {
        selectedBy: null,
        x,
        y,
        width,
        height,
        label: "",
        description: "",
        equation: "",
    };
}

function makePartialCloud(x: number, y: number, radius: number): Partial<Cloud> {
    return {
        selectedBy: null,
        x,
        y,
        radius,
    };
}

function makePartialFlow(from: string, to: string, curvature: number) {
    return {
        selectedBy: null,
        label: "",
        from,
        to,
        curvature,
        equation: "",
    };
}
