import { create } from "zustand";

import {
    type Cloud,
    type Edge,
    type Flow,
    ID_SEPARATOR,
    type Loop,
    type Node,
    type Stock,
} from "@/models/graph";
import type { Operation } from "@/models/operation";

interface GraphState {
    counter: number;
    nodes: Record<string, Node>;
    edges: Record<string, Edge>;
    stocks: Record<string, Stock>;
    clouds: Record<string, Cloud>;
    flows: Record<string, Flow>;

    loopCounterPool: number[];
    loops: Record<string, Loop>;

    apply: (op: Operation) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
    counter: 1,
    nodes: {},
    edges: {},
    stocks: {},
    clouds: {},
    flows: {},

    loopCounterPool: [1],
    loops: {},

    apply: (op) =>
        set((state) => {
            switch (op.type) {
                case "node/add":
                    return {
                        counter: state.counter + 1,
                        nodes: { ...state.nodes, [op.node.id]: op.node },
                    };

                case "node/update":
                    return {
                        nodes: {
                            ...state.nodes,
                            [op.id]: { ...state.nodes[op.id], ...op.patch },
                        },
                    };

                case "node/delete":
                    return {
                        nodes: Object.fromEntries(
                            Object.entries(state.nodes).filter(([id]) => id !== op.id),
                        ),
                    };

                case "edge/add":
                    return {
                        counter: state.counter + 1,
                        edges: { ...state.edges, [op.edge.id]: op.edge },
                    };

                case "edge/update":
                    return {
                        edges: {
                            ...state.edges,
                            [op.id]: { ...state.edges[op.id], ...op.patch },
                        },
                    };

                case "edge/delete":
                    return {
                        edges: Object.fromEntries(
                            Object.entries(state.edges).filter(([id]) => id !== op.id),
                        ),
                    };

                case "stock/add":
                    return {
                        counter: state.counter + 1,
                        stocks: { ...state.stocks, [op.stock.id]: op.stock },
                    };

                case "stock/update":
                    return {
                        stocks: {
                            ...state.stocks,
                            [op.id]: { ...state.stocks[op.id], ...op.patch },
                        },
                    };

                case "stock/delete":
                    return {
                        stocks: Object.fromEntries(
                            Object.entries(state.stocks).filter(([id]) => id !== op.id),
                        ),
                    };

                case "cloud/add":
                    return {
                        counter: state.counter + 1,
                        clouds: { ...state.clouds, [op.cloud.id]: op.cloud },
                    };

                case "cloud/update":
                    return {
                        clouds: {
                            ...state.clouds,
                            [op.id]: { ...state.clouds[op.id], ...op.patch },
                        },
                    };

                case "cloud/delete":
                    return {
                        clouds: Object.fromEntries(
                            Object.entries(state.clouds).filter(([id]) => id !== op.id),
                        ),
                    };

                case "flow/add":
                    return {
                        counter: state.counter + 1,
                        flows: { ...state.flows, [op.flow.id]: op.flow },
                    };

                case "flow/update":
                    return {
                        flows: {
                            ...state.flows,
                            [op.id]: { ...state.flows[op.id], ...op.patch },
                        },
                    };

                case "flow/delete":
                    return {
                        flows: Object.fromEntries(
                            Object.entries(state.flows).filter(([id]) => id !== op.id),
                        ),
                    };

                case "loop/add":
                    const updatedPoolForAdd = [...state.loopCounterPool];
                    updatedPoolForAdd.shift();
                    if (updatedPoolForAdd.length === 0) {
                        updatedPoolForAdd.push(parseInt(op.loop.id.split(ID_SEPARATOR)[1]) + 1);
                    }

                    return {
                        loopCounterPool: updatedPoolForAdd,
                        loops: { ...state.loops, [op.loop.id]: op.loop },
                    };

                case "loop/update":
                    return {
                        loops: {
                            ...state.loops,
                            [op.id]: { ...state.loops[op.id], ...op.patch },
                        },
                    };

                case "loop/delete":
                    const updatedPoolForDelete = [...state.loopCounterPool];
                    const deletedLoopCounter = parseInt(op.id.split(ID_SEPARATOR)[1]);
                    if (!updatedPoolForDelete.includes(deletedLoopCounter)) {
                        updatedPoolForDelete.push(deletedLoopCounter);
                        updatedPoolForDelete.sort((a, b) => a - b);
                    }
                    return {
                        loopCounterPool: updatedPoolForDelete,
                        loops: Object.fromEntries(
                            Object.entries(state.loops).filter(([id]) => id !== op.id),
                        ),
                    };
            }
        }),
}));
