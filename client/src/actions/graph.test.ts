import { beforeEach, describe, expect, it, vi } from "vitest";

import { makeCloudId, makeEdgeId, makeFlowId, makeNodeId, makeStockId } from "@/models/graph";
import type { Operation } from "@/models/operation";
import { sendGraphOperation } from "@/sync/graph";

import {
    addCloud,
    addEdge,
    addFlow,
    addNode,
    addStock,
    deleteCloud,
    deleteEdge,
    deleteFlow,
    deleteNode,
    deleteStock,
    updateCloud,
    updateEdge,
    updateFlow,
    updateNode,
    updateStock,
} from "./graph";

const applyMock = vi.fn();

vi.mock("@/stores/graph", () => ({
    useGraphStore: {
        getState: vi.fn(() => ({
            counter: 3,
            apply: applyMock,
        })),
    },
}));

vi.mock("@/sync/graph", () => ({
    sendGraphOperation: vi.fn(),
}));

vi.mock("@/models/graph", () => ({
    makeNodeId: vi.fn((counter: number) => `node_${counter}`),
    makeEdgeId: vi.fn((counter: number) => `edge_${counter}`),
    makeStockId: vi.fn((counter: number) => `stock_${counter}`),
    makeCloudId: vi.fn((counter: number) => `cloud_${counter}`),
    makeFlowId: vi.fn((counter: number) => `flow_${counter}`),
}));

describe("graph actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("addNode", () => {
        it("creates and sends a node/add operation", () => {
            addNode(10, 20, 50);

            const expectedOp: Operation = {
                type: "node/add",
                node: {
                    id: "node_3",
                    x: 10,
                    y: 20,
                    radius: 50,
                    label: "",
                    description: "",
                },
            };

            expect(makeNodeId).toHaveBeenCalledWith(3);
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("updateNode", () => {
        it("creates and sends a node/update operation", () => {
            updateNode("node_1", { label: "Updated" });

            const expectedOp: Operation = {
                type: "node/update",
                id: "node_1",
                patch: { label: "Updated" },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("deleteNode", () => {
        it("creates and sends a node/delete operation", () => {
            deleteNode("node_1");

            const expectedOp: Operation = {
                type: "node/delete",
                id: "node_1",
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("addEdge", () => {
        it("creates and sends an edge/add operation with defaults", () => {
            addEdge("node_1", "node_2");

            const expectedOp: Operation = {
                type: "edge/add",
                edge: {
                    id: "edge_3",
                    from: "node_1",
                    to: "node_2",
                    polarity: null,
                    curvature: 0.25,
                },
            };

            expect(makeEdgeId).toHaveBeenCalledWith(3);
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });

        it("respects custom polarity and curvature", () => {
            addEdge("a", "b", "+", 0.5);

            const expectedOp: Operation = {
                type: "edge/add",
                edge: {
                    id: "edge_3",
                    from: "a",
                    to: "b",
                    polarity: "+",
                    curvature: 0.5,
                },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("updateEdge", () => {
        it("creates and sends an edge/update operation", () => {
            updateEdge("edge_1", { curvature: 0.9 });

            const expectedOp: Operation = {
                type: "edge/update",
                id: "edge_1",
                patch: { curvature: 0.9 },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("deleteEdge", () => {
        it("creates and sends an edge/delete operation", () => {
            deleteEdge("edge_1");

            const expectedOp: Operation = {
                type: "edge/delete",
                id: "edge_1",
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("addStock", () => {
        it("creates and sends a stock/add add operation", () => {
            addStock(10, 20);

            const expectedOp: Operation = {
                type: "stock/add",
                stock: {
                    id: "stock_3",
                    x: 10,
                    y: 20,
                    width: 128,
                    height: 64,
                    label: "",
                    description: "",
                },
            };

            expect(makeStockId).toHaveBeenCalledWith(3);
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("updateStock", () => {
        it("creates and sends a stock/update add operation", () => {
            updateStock("stock_1", { x: 30 });

            const expectedOp: Operation = {
                type: "stock/update",
                id: "stock_1",
                patch: {
                    x: 30,
                },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("deleteStock", () => {
        it("creates and sends a stock/update add operation", () => {
            deleteStock("stock_1");

            const expectedOp: Operation = {
                type: "stock/delete",
                id: "stock_1",
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("addCloud", () => {
        it("creates and sends a cloud/add add operation", () => {
            addCloud(10, 20);

            const expectedOp: Operation = {
                type: "cloud/add",
                cloud: {
                    id: "cloud_3",
                    x: 10,
                    y: 20,
                    radius: 32,
                },
            };

            expect(makeCloudId).toHaveBeenCalledWith(3);
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("updateCloud", () => {
        it("creates and sends a cloud/update add operation", () => {
            updateCloud("cloud_1", { x: 30 });

            const expectedOp: Operation = {
                type: "cloud/update",
                id: "cloud_1",
                patch: {
                    x: 30,
                },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("deleteCloud", () => {
        it("creates and sends a cloud/update add operation", () => {
            deleteCloud("cloud_1");

            const expectedOp: Operation = {
                type: "cloud/delete",
                id: "cloud_1",
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("addFlow", () => {
        it("creates and sends a flow/add add operation", () => {
            addFlow("stock_1", "cloud_2");

            const expectedOp: Operation = {
                type: "flow/add",
                flow: {
                    id: "flow_3",
                    from: "stock_1",
                    to: "cloud_2",
                    curvature: 0,
                },
            };

            expect(makeFlowId).toHaveBeenCalledWith(3);
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("updateFlow", () => {
        it("creates and sends a flow/update add operation", () => {
            updateFlow("flow_1", { curvature: 0.5 });

            const expectedOp: Operation = {
                type: "flow/update",
                id: "flow_1",
                patch: {
                    curvature: 0.5,
                },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("deleteflow", () => {
        it("creates and sends a flow/update add operation", () => {
            deleteFlow("flow_1");

            const expectedOp: Operation = {
                type: "flow/delete",
                id: "flow_1",
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });
});
