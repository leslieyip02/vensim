import {
    type Cloud,
    type Edge,
    type Flow,
    type Loop,
    type LoopType,
    type Node,
    type Polarity,
    type Stock,
} from "@/models/graph";
import type { Operation, OperationType } from "@/models/operation";
import { useGraphStore } from "@/stores/graph";
import { sendGraphOperation } from "@/sync/socket";
import { computeLoopType, detectLoop, detectLoopType } from "@/utils/loop";

function dispatch(op: Operation) {
    const state = useGraphStore.getState();
    state.apply(op);
    sendGraphOperation(op);
}

// ==============
//  Common logic
// ==============

export function addEntity(entityType: string, entity: Partial<unknown>): string {
    const id = useGraphStore.getState().getNextId(entityType);
    entity = { id, ...entity };

    const op = { type: `${entityType}/add` as OperationType, [entityType]: entity } as Operation;
    dispatch(op);
    return id;
}

export function updateEntity(entityType: string, id: string, patch: Partial<unknown>): string {
    const op = { type: `${entityType}/update` as OperationType, id, patch } as Operation;
    dispatch(op);
    return id;
}

export function deleteEntity(entityType: string, id: string): string {
    const op = { type: `${entityType}/delete` as OperationType, id } as Operation;
    dispatch(op);
    return id;
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
    const state = useGraphStore.getState();
    const allEdges = state.getRecords("edge") as Record<string, Edge>;

    const edge = makePartialEdge(from, to, polarity, curvature);
    const edgeId = addEntity("edge", edge);

    const possibleLoops = detectLoop(allEdges, edge, edgeId);

    if (possibleLoops) {
        possibleLoops.forEach((loop) => {
            addLoop(loop.edgeIds);
        });
    }
}

export function updateEdge(id: string, patch: Partial<Edge>) {
    const state = useGraphStore.getState();

    const edgeId = updateEntity("edge", id, patch);

    const possiblyUpdatedLoops = Object.values(state.loops).filter((loop) =>
        loop.edgeIds.includes(edgeId),
    );

    possiblyUpdatedLoops.forEach((loop) => {
        const loopEdges = loop.edgeIds.map((id) => state.edges[id]);
        const newLoopType = detectLoopType(
            loopEdges,
            edgeId,
            patch.polarity ?? state.edges[edgeId].polarity,
        );
        if (newLoopType !== loop.loopType) {
            updateLoop(loop.id, { loopType: newLoopType });
        }
    });
}

export function deleteEdge(id: string) {
    const state = useGraphStore.getState();

    const edgeId = deleteEntity("edge", id);

    const toDeleteLoops = Object.values(state.loops).filter((loop) =>
        loop.edgeIds.includes(edgeId),
    );
    toDeleteLoops.forEach((loop) => deleteLoop(loop.id));
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

export function addLoop(edgeIds: string[]) {
    const loopType = computeLoopType(edgeIds.map((id) => useGraphStore.getState().edges[id]));
    const loop = makePartialLoop(edgeIds, loopType);
    addEntity("loop", loop);
}

export function updateLoop(id: string, patch: Partial<Loop>) {
    updateEntity("loop", id, patch);
}

export function deleteLoop(id: string) {
    deleteEntity("loop", id);
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
        initialValue: 0,
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

function makePartialLoop(edgeIds: string[], loopType: LoopType): Partial<Loop> {
    return {
        selectedBy: null,
        relX: 0,
        relY: 0,
        edgeIds,
        loopType,
        label: "",
    };
}
