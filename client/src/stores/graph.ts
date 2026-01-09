import { create } from "zustand";

import type { Edge, Node, Polarity } from "../models/graph";

interface GraphState {
    counter: number;
    nodes: Record<string, Node>;
    edges: Record<string, Edge>;

    addNode: (x: number, y: number) => void;
    addEdge: (from: string, to: string, polarity?: Polarity) => void;
    updateNode: (id: string, patch: Partial<Node>) => void;
    updateEdge: (id: string, patch: Partial<Edge>) => void;
    deleteNode: (id: string) => void;
    deleteEdge: (id: string) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
    counter: 0,
    nodes: {},
    edges: {},

    addNode: (x, y) =>
        set((state) => {
            const node = {
                id: `node-${state.counter}`,
                x,
                y,
                label: `Node ${state.counter}`,
            };

            return {
                counter: state.counter + 1,
                nodes: {
                    ...state.nodes,
                    [node.id]: node,
                },
            };
        }),

    addEdge: (from, to, polarity = "+") =>
        set((state) => {
            const edge = {
                id: `edge-${state.counter}`,
                from,
                to,
                polarity,
            };

            return {
                counter: state.counter + 1,
                edges: {
                    ...state.edges,
                    [edge.id]: edge,
                },
            };
        }),

    updateNode: (id, patch) =>
        set((state) => ({
            nodes: {
                ...state.nodes,
                [id]: {
                    ...state.nodes[id],
                    ...patch,
                },
            },
        })),

    updateEdge: (id, patch) =>
        set((state) => ({
            edges: {
                ...state.edges,
                [id]: {
                    ...state.edges[id],
                    ...patch,
                },
            },
        })),

    deleteNode: (id) =>
        set((state) => ({
            nodes: Object.fromEntries(
                Object.entries(state.nodes).filter(([entryId]) => entryId !== id),
            ),
        })),

    deleteEdge: (id) =>
        set((state) => ({
            edges: Object.fromEntries(
                Object.entries(state.edges).filter(([entryId]) => entryId !== id),
            ),
        })),
}));
