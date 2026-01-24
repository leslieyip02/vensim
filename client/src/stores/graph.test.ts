import { describe, it, expect, beforeEach } from "vitest";
import type { Node, Edge, Stock, Cloud, Flow } from "@/models/graph";
import type { Operation } from "@/models/operation";
import { useGraphStore } from "./graph";

const DEFAULT_NODE: Node = {
    id: "node-0",
    x: 0,
    y: 0,
    radius: 0,
    label: "",
    description: "",
};

const DEFAULT_EDGE: Edge = {
    id: "edge-0",
    from: "",
    to: "",
    polarity: "+",
    curvature: 0,
};

const DEFAULT_STOCK: Stock = {
    id: "stock-0",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    label: "",
    description: "",
};

const DEFAULT_CLOUD: Cloud = {
    id: "cloud-0",
    x: 0,
    y: 0,
    radius: 0,
};

const DEFAULT_FLOW: Flow = {
    id: "flow-0",
    stockId: "",
    cloudId: "",
    type: "inflow",
    curvature: 0,
};

describe("useGraphStore", () => {
    beforeEach(() => {
        useGraphStore.setState({
            counter: 1,
            nodes: {},
            edges: {},
        });
    });

    it("adds a node and increments counter", () => {
        const node: Node = {
            ...DEFAULT_NODE,
            id: "node-1",
            label: "Node 1",
        };

        const op: Operation = {
            type: "node/add",
            node,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.nodes["node-1"]).toEqual(node);
        expect(state.counter).toBe(2);
    });

    it("updates a node", () => {
        useGraphStore.setState({
            nodes: {
                "node-1": { ...DEFAULT_NODE, id: "node-1", label: "old" },
            },
        });

        const op: Operation = {
            type: "node/update",
            id: "node-1",
            patch: { label: "updated" },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().nodes["node-1"].label).toBe("updated");
    });

    it("deletes a node", () => {
        useGraphStore.setState({
            nodes: {
                "node-1": { ...DEFAULT_NODE, id: "node-1" },
                "node-2": { ...DEFAULT_NODE, id: "node-2" },
            },
        });

        const op: Operation = {
            type: "node/delete",
            id: "node-1",
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().nodes).toEqual({
            "node-2": { ...DEFAULT_NODE, id: "node-2" },
        });
    });

    it("adds an edge and increments counter", () => {
        const edge: Edge = {
            ...DEFAULT_EDGE,
            id: "edge-1",
            from: "node-1",
            to: "node-2",
        };

        const op: Operation = {
            type: "edge/add",
            edge,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.edges["edge-1"]).toEqual(edge);
        expect(state.counter).toBe(2);
    });

    it("updates an edge", () => {
        useGraphStore.setState({
            edges: {
                "edge-1": { ...DEFAULT_EDGE, id: "edge-1", from: "a", to: "b" },
            },
        });

        const op: Operation = {
            type: "edge/update",
            id: "edge-1",
            patch: { to: "c" },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().edges["edge-1"].to).toBe("c");
    });

    it("deletes an edge", () => {
        useGraphStore.setState({
            edges: {
                "edge-1": { ...DEFAULT_EDGE, id: "edge-1" },
                "edge-2": { ...DEFAULT_EDGE, id: "edge-2" },
            },
        });

        const op: Operation = {
            type: "edge/delete",
            id: "edge-1",
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().edges).toEqual({
            "edge-2": { ...DEFAULT_EDGE, id: "edge-2" },
        });
    });

    it("adds a stock and increments counter", () => {
        const stock: Stock = {
            ...DEFAULT_STOCK,
            id: "stock-1",
        };

        const op: Operation = {
            type: "stock/add",
            stock,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.stocks["stock-1"]).toEqual(stock);
        expect(state.counter).toBe(2);
    });

    it("updates a stock", () => {
        useGraphStore.setState({
            stocks: {
                "stock-1": { ...DEFAULT_STOCK, id: "stock-1" },
            },
        });

        const op: Operation = {
            type: "stock/update",
            id: "stock-1",
            patch: { x: 30 },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().stocks["stock-1"].x).toBe(30);
    });

    it("deletes a stock", () => {
        useGraphStore.setState({
            stocks: {
                "stock-1": { ...DEFAULT_STOCK, id: "stock-1" },
                "stock-2": { ...DEFAULT_STOCK, id: "stock-2" },
            },
        });

        const op: Operation = {
            type: "stock/delete",
            id: "stock-1",
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().stocks).toEqual({
            "stock-2": { ...DEFAULT_STOCK, id: "stock-2" },
        });
    });

    it("adds a cloud and increments counter", () => {
        const cloud: Cloud = {
            ...DEFAULT_CLOUD,
            id: "cloud-1",
        };

        const op: Operation = {
            type: "cloud/add",
            cloud: cloud,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.clouds["cloud-1"]).toEqual(cloud);
        expect(state.counter).toBe(2);
    });

    it("updates a cloud", () => {
        useGraphStore.setState({
            clouds: {
                "cloud-1": { ...DEFAULT_CLOUD, id: "cloud-1" },
            },
        });

        const op: Operation = {
            type: "cloud/update",
            id: "cloud-1",
            patch: { x: 30 },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().clouds["cloud-1"].x).toBe(30);
    });

    it("deletes a cloud", () => {
        useGraphStore.setState({
            clouds: {
                "cloud-1": { ...DEFAULT_CLOUD, id: "cloud-1" },
                "cloud-2": { ...DEFAULT_CLOUD, id: "cloud-2" },
            },
        });

        const op: Operation = {
            type: "cloud/delete",
            id: "cloud-1",
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().clouds).toEqual({
            "cloud-2": { ...DEFAULT_CLOUD, id: "cloud-2" },
        });
    });

    it("adds a flow and increments counter", () => {
        const flow: Flow = {
            ...DEFAULT_FLOW,
            id: "flow-1",
        };

        const op: Operation = {
            type: "flow/add",
            flow,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.flows["flow-1"]).toEqual(flow);
        expect(state.counter).toBe(2);
    });

    it("updates a flow", () => {
        useGraphStore.setState({
            flows: {
                "flow-1": { ...DEFAULT_FLOW, id: "flow-1" },
            },
        });

        const op: Operation = {
            type: "flow/update",
            id: "flow-1",
            patch: { curvature: 0.5 },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().flows["flow-1"].curvature).toBe(0.5);
    });

    it("deletes a flow", () => {
        useGraphStore.setState({
            flows: {
                "flow-1": { ...DEFAULT_FLOW, id: "flow-1" },
                "flow-2": { ...DEFAULT_FLOW, id: "flow-2" },
            },
        });

        const op: Operation = {
            type: "flow/delete",
            id: "flow-1",
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().flows).toEqual({
            "flow-2": { ...DEFAULT_FLOW, id: "flow-2" },
        });
    });

    it("does not increment counter on update or delete", () => {
        useGraphStore.setState({
            counter: 5,
            nodes: {
                "node-1": { ...DEFAULT_NODE, id: "node-1", label: "old" },
            },
        });

        useGraphStore.getState().apply({
            type: "node/update",
            id: "node-1",
            patch: { label: "updated" },
        });

        useGraphStore.getState().apply({
            type: "node/delete",
            id: "node-1",
        });

        expect(useGraphStore.getState().counter).toBe(5);
    });
});
