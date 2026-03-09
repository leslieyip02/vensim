import { create } from "zustand";

import {
    type Cloud,
    type Edge,
    type Flow,
    ID_SEPARATOR,
    type Identifiable,
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
    loops: Record<string, Loop>;

    getNextId: (entityType: string) => string;
    getRecords: (entityType: string) => Record<string, unknown>;
    getKey: (entityType: string) => keyof GraphState;
    apply: (op: Operation) => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
    counter: 1,
    nodes: {},
    edges: {},
    stocks: {},
    clouds: {},
    flows: {},
    loops: {},

    getNextId: (entityType) => {
        return `${entityType}${ID_SEPARATOR}${get().counter}`;
    },

    getRecords: (entityType) => {
        switch (entityType) {
            case "node":
                return get().nodes;
            case "edge":
                return get().edges;
            case "stock":
                return get().stocks;
            case "cloud":
                return get().clouds;
            case "flow":
                return get().flows;
            case "loop":
                return get().loops;
            default:
                throw new Error(`Unexpected entityType ${entityType}`);
        }
    },

    getKey: (entityType) => {
        switch (entityType) {
            case "node":
                return "nodes";
            case "edge":
                return "edges";
            case "stock":
                return "stocks";
            case "cloud":
                return "clouds";
            case "flow":
                return "flows";
            case "loop":
                return "loops";
            default:
                throw new Error(`Unexpected entityType ${entityType}`);
        }
    },

    apply: (op) =>
        set((state) => {
            const entityType = op.type.split("/")[0];
            const records = state.getRecords(entityType);
            const key = state.getKey(entityType);

            switch (op.type) {
                case "node/add":
                case "edge/add":
                case "stock/add":
                case "cloud/add":
                case "flow/add":
                case "loop/add": {
                    // HACK: this sucks
                    const entity = (op as Record<string, unknown>)[entityType] as Identifiable;

                    return {
                        counter: state.counter + 1,
                        [key]: { ...records, [entity.id]: entity },
                    };
                }

                case "node/update":
                case "edge/update":
                case "stock/update":
                case "cloud/update":
                case "flow/update":
                case "loop/update": {
                    const id = (op as Record<string, unknown>).id as string;
                    if (!records[id]) {
                        return {};
                    }

                    const patch = (op as Record<string, unknown>).patch as Partial<unknown>;
                    return {
                        [key]: {
                            ...records,
                            [id]: { ...(records[id] as object), ...patch },
                        },
                    };
                }

                case "node/delete":
                case "edge/delete":
                case "stock/delete":
                case "cloud/delete":
                case "flow/delete":
                case "loop/delete": {
                    const id = (op as Record<string, unknown>).id as string;

                    return {
                        [key]: Object.fromEntries(
                            Object.entries(records).filter(([entryId]) => entryId !== id),
                        ),
                    };
                }
            }
        }),
}));
