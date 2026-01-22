import type { Edge, Node, Stock } from "@/models/graph";
import type { Operation } from "@/models/operation";
import { create } from "zustand";

interface GraphState {
    counter: number;
    nodes: Record<string, Node>;
    edges: Record<string, Edge>;
    stocks: Record<string, Stock>;

    apply: (op: Operation) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
    counter: 1,
    nodes: {},
    edges: {},
    stocks: {},

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
            }
        }),
}));
