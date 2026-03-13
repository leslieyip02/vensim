import { beforeEach, describe, expect, it, vi } from "vitest";

import { ID_SEPARATOR } from "@/models/graph";
import type { Operation } from "@/models/operation";
import { sendGraphOperation } from "@/sync/socket";

import {
    addCloud,
    addEdge,
    addFlow,
    addLoop,
    addNode,
    addStock,
    deleteCloud,
    deleteEdge,
    deleteFlow,
    deleteLoop,
    deleteNode,
    deleteStock,
    updateCloud,
    updateEdge,
    updateFlow,
    updateLoop,
    updateNode,
    updateStock,
} from "./graph";

const getNextIdMock = vi.fn((entityType: string) => `${entityType}${ID_SEPARATOR}3`);
const applyMock = vi.fn();
const getRecordsMock = vi.fn();

const computeLoopTypeMock = vi.fn();
const detectLoopMock = vi.fn();
const detectLoopTypeMock = vi.fn();

const nodesMock = { [`node${ID_SEPARATOR}1`]: { id: `node${ID_SEPARATOR}1` } };
const edgesMock = {
    [`edge${ID_SEPARATOR}1`]: {
        id: `edge${ID_SEPARATOR}1`,
        from: `node${ID_SEPARATOR}1`,
        to: `stock${ID_SEPARATOR}1`,
        polarity: null,
        curvature: 0.25,
    },
    [`edge${ID_SEPARATOR}2`]: {
        id: `edge${ID_SEPARATOR}2`,
        from: `stock${ID_SEPARATOR}1`,
        to: `node${ID_SEPARATOR}1`,
        polarity: "+",
        curvature: 0.25,
    },
    [`edge${ID_SEPARATOR}3`]: {
        id: `edge${ID_SEPARATOR}3`,
        from: `node${ID_SEPARATOR}1`,
        to: `flow${ID_SEPARATOR}1`,
        polarity: null,
        curvature: 0.25,
    },
};
const stocksMock = { [`stock${ID_SEPARATOR}1`]: { id: `stock${ID_SEPARATOR}1` } };
const cloudsMock = { [`cloud${ID_SEPARATOR}1`]: { id: `cloud${ID_SEPARATOR}1` } };
const flowsMock = {
    [`flow${ID_SEPARATOR}1`]: {
        id: `flow${ID_SEPARATOR}1`,
        from: `stock${ID_SEPARATOR}1`,
        to: `cloud${ID_SEPARATOR}1`,
        curvature: 0,
        label: "",
        equation: "",
    },
};
const loopsMock = {
    [`loop${ID_SEPARATOR}1`]: {
        id: `loop${ID_SEPARATOR}1`,
        edgeIds: [`edge${ID_SEPARATOR}1`, `edge${ID_SEPARATOR}2`],
        loopType: "R",
        label: "",
        selectedBy: null,
        relX: 0,
        relY: 0,
    },
};

vi.mock("@/stores/graph", () => ({
    useGraphStore: {
        getState: vi.fn(() => ({
            counter: 3,
            clock: 10,
            getNextId: getNextIdMock,
            getRecords: getRecordsMock,
            getKey: vi.fn(),
            apply: applyMock,
            nodes: nodesMock,
            edges: edgesMock,
            stocks: stocksMock,
            clouds: cloudsMock,
            flows: flowsMock,
            loops: loopsMock,
        })),
    },
}));

vi.mock("@/sync/socket", () => ({
    sendGraphOperation: vi.fn(),
}));

vi.mock("@/utils/loop", () => ({
    computeLoopType: (...args: unknown[]) => computeLoopTypeMock(...args),
    detectLoop: (...args: unknown[]) => detectLoopMock(...args),
    detectLoopType: (...args: unknown[]) => detectLoopTypeMock(...args),
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
                clock: 11,
                node: {
                    id: `node${ID_SEPARATOR}3`,
                    selectedBy: null,
                    x: 10,
                    y: 20,
                    radius: 50,
                    label: "",
                    description: "",
                    equation: "",
                },
            };

            expect(getNextIdMock).toHaveBeenCalledWith("node");
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("updateNode", () => {
        it("creates and sends a node/update operation", () => {
            getRecordsMock.mockReturnValue(nodesMock);
            updateNode(`node${ID_SEPARATOR}1`, { label: "Updated" });

            const expectedOp: Operation = {
                type: "node/update",
                clock: 11,
                id: `node${ID_SEPARATOR}1`,
                patch: { label: "Updated" },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("deleteNode", () => {
        it("deletes node and cascades to edges where node is from or to", () => {
            deleteNode(`node${ID_SEPARATOR}1`);

            const expectedOp: Operation = {
                type: "node/delete",
                clock: 11,
                id: `node${ID_SEPARATOR}1`,
            };

            expect(applyMock).toHaveBeenCalledWith({
                type: "edge/delete",
                clock: 11,
                id: `edge${ID_SEPARATOR}1`,
            });
            expect(applyMock).toHaveBeenCalledWith({
                type: "edge/delete",
                clock: 11,
                id: `edge${ID_SEPARATOR}2`,
            });
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("addEdge", () => {
        it("creates and sends an edge/add operation with defaults", () => {
            getRecordsMock.mockReturnValue({});
            detectLoopMock.mockReturnValue(null);

            addEdge(`node${ID_SEPARATOR}1`, `node${ID_SEPARATOR}2`);

            const expectedOp: Operation = {
                type: "edge/add",
                clock: 11,
                edge: {
                    id: `edge${ID_SEPARATOR}3`,
                    selectedBy: null,
                    from: `node${ID_SEPARATOR}1`,
                    to: `node${ID_SEPARATOR}2`,
                    polarity: null,
                    curvature: 0.25,
                },
            };

            expect(getNextIdMock).toHaveBeenCalledWith("edge");
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });

        it("respects custom polarity and curvature", () => {
            getRecordsMock.mockReturnValue({});
            detectLoopMock.mockReturnValue(null);

            addEdge("a", "b", "+", 0.5);

            const expectedOp: Operation = {
                type: "edge/add",
                clock: 11,
                edge: {
                    id: `edge${ID_SEPARATOR}3`,
                    selectedBy: null,
                    from: "a",
                    to: "b",
                    polarity: "+",
                    curvature: 0.5,
                },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });

        it("detects loops and adds loop entities when detectLoop returns loops", () => {
            const allEdgesMock = {
                [`edge${ID_SEPARATOR}1`]: { id: `edge${ID_SEPARATOR}1`, from: "a", to: "b" },
            };
            getRecordsMock.mockReturnValue(allEdgesMock);

            detectLoopMock.mockReturnValue([
                { edgeIds: [`edge${ID_SEPARATOR}1`, `edge${ID_SEPARATOR}3`] },
            ]);

            computeLoopTypeMock.mockReturnValue("R");

            addEdge("a", "b");

            expect(applyMock).toHaveBeenCalledWith({
                type: "edge/add",
                clock: 11,
                edge: expect.objectContaining({
                    id: `edge${ID_SEPARATOR}3`,
                }),
            });

            expect(applyMock).toHaveBeenCalledWith({
                type: "loop/add",
                clock: 11,
                loop: {
                    id: `loop${ID_SEPARATOR}3`,
                    selectedBy: null,
                    relX: 0,
                    relY: 0,
                    edgeIds: [`edge${ID_SEPARATOR}1`, `edge${ID_SEPARATOR}3`],
                    loopType: "R",
                    label: "",
                },
            });
        });
    });

    describe("updateEdge", () => {
        it("creates and sends an edge/update operation", () => {
            detectLoopTypeMock.mockReturnValue("R");

            updateEdge(`edge${ID_SEPARATOR}1`, { curvature: 0.9 });

            const expectedOp: Operation = {
                type: "edge/update",
                clock: 11,
                id: `edge${ID_SEPARATOR}1`,
                patch: { curvature: 0.9 },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });

        it("recomputes loopType and updates affected loops when polarity changes", () => {
            getRecordsMock.mockImplementation((entityType: string) => {
                if (entityType === "edge") {
                    return edgesMock;
                } else if (entityType === "loop") {
                    return loopsMock;
                }
            });
            detectLoopTypeMock.mockReturnValue("balancing");

            updateEdge(`edge${ID_SEPARATOR}2`, { polarity: "-" });

            expect(applyMock).toHaveBeenCalledWith({
                type: "edge/update",
                clock: 11,
                id: `edge${ID_SEPARATOR}2`,
                patch: { polarity: "-" },
            });

            expect(applyMock).toHaveBeenCalledWith({
                type: "loop/update",
                clock: 11,
                id: `loop${ID_SEPARATOR}1`,
                patch: { loopType: "balancing" },
            });
        });
    });

    describe("deleteEdge", () => {
        it("creates and sends an edge/delete operation", () => {
            deleteEdge(`edge${ID_SEPARATOR}1`);

            const expectedOp: Operation = {
                type: "edge/delete",
                clock: 11,
                id: `edge${ID_SEPARATOR}1`,
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });

        it("deletes loops that contain the deleted edge", () => {
            deleteEdge(`edge${ID_SEPARATOR}1`);

            expect(applyMock).toHaveBeenCalledWith({
                type: "loop/delete",
                clock: 11,
                id: `loop${ID_SEPARATOR}1`,
            });
        });
    });

    describe("addStock", () => {
        it("creates and sends a stock/add add operation", () => {
            addStock(10, 20);

            const expectedOp: Operation = {
                type: "stock/add",
                clock: 11,
                stock: {
                    id: `stock${ID_SEPARATOR}3`,
                    selectedBy: null,
                    x: 10,
                    y: 20,
                    width: 128,
                    height: 64,
                    label: "",
                    description: "",
                    equation: "",
                    initialValue: 0,
                },
            };

            expect(getNextIdMock).toHaveBeenCalledWith("stock");
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("updateStock", () => {
        it("creates and sends a stock/update add operation", () => {
            getRecordsMock.mockReturnValue(stocksMock);
            updateStock(`stock${ID_SEPARATOR}1`, { x: 30 });

            const expectedOp: Operation = {
                type: "stock/update",
                clock: 11,
                id: `stock${ID_SEPARATOR}1`,
                patch: {
                    x: 30,
                },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("deleteStock", () => {
        it("deletes stock and cascades to outgoing edges and connected flows", () => {
            deleteStock(`stock${ID_SEPARATOR}1`);

            const expectedOp: Operation = {
                type: "stock/delete",
                clock: 11,
                id: `stock${ID_SEPARATOR}1`,
            };

            expect(applyMock).toHaveBeenCalledWith({
                type: "edge/delete",
                clock: 11,
                id: `edge${ID_SEPARATOR}2`,
            });
            expect(applyMock).not.toHaveBeenCalledWith({
                type: "edge/delete",
                id: `edge${ID_SEPARATOR}1`,
            });
            expect(applyMock).toHaveBeenCalledWith({
                type: "flow/delete",
                clock: 11,
                id: `flow${ID_SEPARATOR}1`,
            });
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("addCloud", () => {
        it("creates and sends a cloud/add add operation", () => {
            addCloud(10, 20);

            const expectedOp: Operation = {
                type: "cloud/add",
                clock: 11,
                cloud: {
                    id: `cloud${ID_SEPARATOR}3`,
                    selectedBy: null,
                    x: 10,
                    y: 20,
                    radius: 32,
                },
            };

            expect(getNextIdMock).toHaveBeenCalledWith("cloud");
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("updateCloud", () => {
        it("creates and sends a cloud/update add operation", () => {
            getRecordsMock.mockReturnValue(cloudsMock);
            updateCloud(`cloud${ID_SEPARATOR}1`, { x: 30 });

            const expectedOp: Operation = {
                type: "cloud/update",
                clock: 11,
                id: `cloud${ID_SEPARATOR}1`,
                patch: {
                    x: 30,
                },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("deleteCloud", () => {
        it("deletes cloud and cascades to connected flows", () => {
            deleteCloud(`cloud${ID_SEPARATOR}1`);

            const expectedOp: Operation = {
                type: "cloud/delete",
                clock: 11,
                id: `cloud${ID_SEPARATOR}1`,
            };

            expect(applyMock).toHaveBeenCalledWith({
                type: "flow/delete",
                clock: 11,
                id: `flow${ID_SEPARATOR}1`,
            });
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("addFlow", () => {
        it("creates and sends a flow/add add operation", () => {
            addFlow(`stock${ID_SEPARATOR}1`, `cloud${ID_SEPARATOR}2`);

            const expectedOp: Operation = {
                type: "flow/add",
                clock: 11,
                flow: {
                    id: `flow${ID_SEPARATOR}3`,
                    selectedBy: null,
                    from: `stock${ID_SEPARATOR}1`,
                    to: `cloud${ID_SEPARATOR}2`,
                    label: "",
                    curvature: 0,
                    equation: "",
                },
            };

            expect(getNextIdMock).toHaveBeenCalledWith("flow");
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("updateFlow", () => {
        it("creates and sends a flow/update add operation", () => {
            getRecordsMock.mockReturnValue(flowsMock);
            updateFlow(`flow${ID_SEPARATOR}1`, { curvature: 0.5 });

            const expectedOp: Operation = {
                type: "flow/update",
                clock: 11,
                id: `flow${ID_SEPARATOR}1`,
                patch: {
                    curvature: 0.5,
                },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("deleteflow", () => {
        it("deletes flow and cascades to edges pointing to the flow", () => {
            deleteFlow(`flow${ID_SEPARATOR}1`);

            const expectedOp: Operation = {
                type: "flow/delete",
                clock: 11,
                id: `flow${ID_SEPARATOR}1`,
            };

            expect(applyMock).toHaveBeenCalledWith({
                type: "edge/delete",
                clock: 11,
                id: `edge${ID_SEPARATOR}3`,
            });
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("addLoop", () => {
        it("creates and sends a loop/add operation", () => {
            computeLoopTypeMock.mockReturnValue("R");

            addLoop([`edge${ID_SEPARATOR}1`, `edge${ID_SEPARATOR}2`]);

            const expectedOp: Operation = {
                type: "loop/add",
                clock: 11,
                loop: {
                    id: `loop${ID_SEPARATOR}3`,
                    selectedBy: null,
                    relX: 0,
                    relY: 0,
                    edgeIds: [`edge${ID_SEPARATOR}1`, `edge${ID_SEPARATOR}2`],
                    loopType: "R",
                    label: "",
                },
            };

            expect(getNextIdMock).toHaveBeenCalledWith("loop");
            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("updateLoop", () => {
        it("creates and sends a loop/update operation", () => {
            getRecordsMock.mockReturnValue(loopsMock);
            updateLoop(`loop${ID_SEPARATOR}1`, { label: "1" });

            const expectedOp: Operation = {
                type: "loop/update",
                clock: 11,
                id: `loop${ID_SEPARATOR}1`,
                patch: {
                    label: "1",
                },
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });

    describe("deleteLoop", () => {
        it("creates and sends a loop/delete operation", () => {
            deleteLoop(`loop${ID_SEPARATOR}1`);

            const expectedOp: Operation = {
                type: "loop/delete",
                clock: 11,
                id: `loop${ID_SEPARATOR}1`,
            };

            expect(applyMock).toHaveBeenCalledWith(expectedOp);
            expect(sendGraphOperation).toHaveBeenCalledWith(expectedOp);
        });
    });
});
