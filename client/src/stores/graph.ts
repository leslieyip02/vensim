import { create } from "zustand";

import type { Cloud, Edge, Flow,Node, Stock } from "@/models/graph";
import type { Operation } from "@/models/operation";

interface GraphState {
    counter: number;
    nodes: Record<string, Node>;
    edges: Record<string, Edge>;
    stocks: Record<string, Stock>;
    clouds: Record<string, Cloud>;
    flows: Record<string, Flow>;

    apply: (op: Operation) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
    counter: 1,
    nodes: {},
    edges: {},
    stocks: {},
    clouds: {},
    flows: {},

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
            }
        }),
}));
