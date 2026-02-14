import {
    type Cloud,
    type Edge,
    type Flow,
    type Loop,
    type LoopPolarity,
    makeCloudId,
    makeEdgeId,
    makeFlowId,
    makeLoopId,
    makeNodeId,
    makeStockId,
    type Node,
    type Polarity,
    type Stock,
} from "@/models/graph";
import type { Operation } from "@/models/operation";
import { useGraphStore } from "@/stores/graph";
import { sendGraphOperation } from "@/sync/graph";
import { computeLoopPolarity, detectCycleFromEdge } from "@/utils/loop";

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
    const state = useGraphStore.getState();

    Object.values(state.edges)
        .filter((edge) => edge.from === id || edge.to === id)
        .forEach((edge) => deleteEdge(edge.id));

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

    const cycle = detectCycleFromEdge(state.edges, edge);

    const op: Operation = { type: "edge/add", edge };
    dispatch(op);

    if (cycle) {
        const { edgeIds, polarity } = cycle;
        addLoop(edgeIds, polarity);
    }
}

export function updateEdge(id: string, patch: Partial<Edge>) {
    const op: Operation = { type: "edge/update", id, patch };
    dispatch(op);

    const state = useGraphStore.getState();

    const possiblyChangedLoops = Object.values(state.loops).filter((loop) =>
        loop.edgeIds.includes(id),
    );
    const toUpdateLoops: [string, Partial<Loop>][] = [];
    possiblyChangedLoops.forEach((loop) => {
        const prevPol = loop.polarity;
        const loopEdges = loop.edgeIds.map((edgeId) => state.edges[edgeId]);
        const newPol = computeLoopPolarity(loopEdges);

        if (newPol !== prevPol) {
            toUpdateLoops.push([loop.id, { polarity: newPol }]);
        }
    });

    toUpdateLoops.forEach(([loopId, patch]) => updateLoop(loopId, patch));
}

export function deleteEdge(id: string) {
    const state = useGraphStore.getState();

    const toDeleteLoops = Object.values(state.loops).filter((loop) => loop.edgeIds.includes(id));

    const op: Operation = { type: "edge/delete", id };
    dispatch(op);

    toDeleteLoops.forEach((loop) => deleteLoop(loop.id));
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
    const state = useGraphStore.getState();

    Object.values(state.edges)
        .filter((edge) => edge.from === id)
        .forEach((edge) => deleteEdge(edge.id));

    Object.values(state.flows)
        .filter((flow) => flow.from === id || flow.to === id)
        .forEach((flow) => deleteFlow(flow.id));

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
    const state = useGraphStore.getState();

    Object.values(state.flows)
        .filter((flow) => flow.from === id || flow.to === id)
        .forEach((flow) => deleteFlow(flow.id));

    const op: Operation = { type: "cloud/delete", id };
    dispatch(op);
}

export function addFlow(from: string, to: string, curvature: number = 0) {
    const state = useGraphStore.getState();

    const flow: Flow = {
        id: makeFlowId(state.counter),
        label: "",
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
    const state = useGraphStore.getState();

    Object.values(state.edges)
        .filter((edge) => edge.to === id)
        .forEach((edge) => deleteEdge(edge.id));

    const op: Operation = { type: "flow/delete", id };
    dispatch(op);
}

function addLoop(edgeIds: string[], polarity: LoopPolarity) {
    const state = useGraphStore.getState();

    const loop: Loop = {
        id: makeLoopId(state.counter),
        edgeIds,
        polarity,
    };

    const op: Operation = { type: "loop/add", loop };
    dispatch(op);
}

function updateLoop(id: string, patch: Partial<Loop>) {
    const op: Operation = { type: "loop/update", id, patch };
    dispatch(op);
}

function deleteLoop(id: string) {
    const op: Operation = { type: "loop/delete", id };
    dispatch(op);
}
