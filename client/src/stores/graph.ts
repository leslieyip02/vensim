import type { Edge, Node, Polarity } from "@/models/graph";
import { create } from "zustand";

interface GraphState {
    counter: number;
    nodes: Record<string, Node>;
    edges: Record<string, Edge>;

    addNode: (x: number, y: number, radius?: number) => void;
    addEdge: (from: string, to: string, polarity?: Polarity) => void;
    updateNode: (id: string, patch: Partial<Node>) => void;
    updateEdge: (id: string, patch: Partial<Edge>) => void;
    deleteNode: (id: string) => void;
    deleteEdge: (id: string) => void;
}

function toNodeId(counter: number) {
    return `node-${counter}`;
}

function toEdgeId(counter: number) {
    return `edge-${counter}`;
}

export const useGraphStore = create<GraphState>((set) => ({
    counter: 1,
    nodes: {},
    edges: {},

    addNode: (x, y, radius = 32) =>
        set((state) => {
            const node = {
                id: toNodeId(state.counter),
                x,
                y,
                radius,
                label: "",
                description: "",
                tagIds: [],
            };

            return {
                counter: state.counter + 1,
                nodes: {
                    ...state.nodes,
                    [node.id]: node,
                },
            };
        }),

    addEdge: (from, to, polarity = "+", curvature = 0.25) =>
        set((state) => {
            const edge = {
                id: toEdgeId(state.counter),
                from,
                to,
                polarity,
                curvature,
                tagIds: [],
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
