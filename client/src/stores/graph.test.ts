import { beforeEach, describe, expect, it } from "vitest";

import type { Cloud, Edge, Flow, Node, Stock } from "@/models/graph";
import type { Operation } from "@/models/operation";

import { useGraphStore } from "./graph";

const DEFAULT_NODE: Node = {
    id: "node_0",
    x: 0,
    y: 0,
    radius: 0,
    label: "",
    description: "",
};

const DEFAULT_EDGE: Edge = {
    id: "edge_0",
    from: "",
    to: "",
    polarity: "+",
    curvature: 0,
};

const DEFAULT_STOCK: Stock = {
    id: "stock_0",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    label: "",
    description: "",
};

const DEFAULT_CLOUD: Cloud = {
    id: "cloud_0",
    x: 0,
    y: 0,
    radius: 0,
};

const DEFAULT_FLOW: Flow = {
    id: "flow_0",
    from: "stock_0",
    to: "cloud_0",
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
            id: "node_1",
            label: "Node 1",
        };

        const op: Operation = {
            type: "node/add",
            node,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.nodes["node_1"]).toEqual(node);
        expect(state.counter).toBe(2);
    });

    it("updates a node", () => {
        useGraphStore.setState({
            nodes: {
                "node_1": { ...DEFAULT_NODE, id: "node_1", label: "old" },
            },
        });

        const op: Operation = {
            type: "node/update",
            id: "node_1",
            patch: { label: "updated" },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().nodes["node_1"].label).toBe("updated");
    });

    it("deletes a node", () => {
        useGraphStore.setState({
            nodes: {
                "node_1": { ...DEFAULT_NODE, id: "node_1" },
                "node_2": { ...DEFAULT_NODE, id: "node_2" },
            },
        });

        const op: Operation = {
            type: "node/delete",
            id: "node_1",
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().nodes).toEqual({
            "node_2": { ...DEFAULT_NODE, id: "node_2" },
        });
    });

    it("adds an edge and increments counter", () => {
        const edge: Edge = {
            ...DEFAULT_EDGE,
            id: "edge_1",
            from: "node_1",
            to: "node_2",
        };

        const op: Operation = {
            type: "edge/add",
            edge,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.edges["edge_1"]).toEqual(edge);
        expect(state.counter).toBe(2);
    });

    it("updates an edge", () => {
        useGraphStore.setState({
            edges: {
                "edge_1": { ...DEFAULT_EDGE, id: "edge_1", from: "a", to: "b" },
            },
        });

        const op: Operation = {
            type: "edge/update",
            id: "edge_1",
            patch: { to: "c" },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().edges["edge_1"].to).toBe("c");
    });

    it("deletes an edge", () => {
        useGraphStore.setState({
            edges: {
                "edge_1": { ...DEFAULT_EDGE, id: "edge_1" },
                "edge_2": { ...DEFAULT_EDGE, id: "edge_2" },
            },
        });

        const op: Operation = {
            type: "edge/delete",
            id: "edge_1",
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().edges).toEqual({
            "edge_2": { ...DEFAULT_EDGE, id: "edge_2" },
        });
    });

    it("adds a stock and increments counter", () => {
        const stock: Stock = {
            ...DEFAULT_STOCK,
            id: "stock_1",
        };

        const op: Operation = {
            type: "stock/add",
            stock,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.stocks["stock_1"]).toEqual(stock);
        expect(state.counter).toBe(2);
    });

    it("updates a stock", () => {
        useGraphStore.setState({
            stocks: {
                "stock_1": { ...DEFAULT_STOCK, id: "stock_1" },
            },
        });

        const op: Operation = {
            type: "stock/update",
            id: "stock_1",
            patch: { x: 30 },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().stocks["stock_1"].x).toBe(30);
    });

    it("deletes a stock", () => {
        useGraphStore.setState({
            stocks: {
                "stock_1": { ...DEFAULT_STOCK, id: "stock_1" },
                "stock_2": { ...DEFAULT_STOCK, id: "stock_2" },
            },
        });

        const op: Operation = {
            type: "stock/delete",
            id: "stock_1",
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().stocks).toEqual({
            "stock_2": { ...DEFAULT_STOCK, id: "stock_2" },
        });
    });

    it("adds a cloud and increments counter", () => {
        const cloud: Cloud = {
            ...DEFAULT_CLOUD,
            id: "cloud_1",
        };

        const op: Operation = {
            type: "cloud/add",
            cloud: cloud,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.clouds["cloud_1"]).toEqual(cloud);
        expect(state.counter).toBe(2);
    });

    it("updates a cloud", () => {
        useGraphStore.setState({
            clouds: {
                "cloud_1": { ...DEFAULT_CLOUD, id: "cloud_1" },
            },
        });

        const op: Operation = {
            type: "cloud/update",
            id: "cloud_1",
            patch: { x: 30 },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().clouds["cloud_1"].x).toBe(30);
    });

    it("deletes a cloud", () => {
        useGraphStore.setState({
            clouds: {
                "cloud_1": { ...DEFAULT_CLOUD, id: "cloud_1" },
                "cloud_2": { ...DEFAULT_CLOUD, id: "cloud_2" },
            },
        });

        const op: Operation = {
            type: "cloud/delete",
            id: "cloud_1",
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().clouds).toEqual({
            "cloud_2": { ...DEFAULT_CLOUD, id: "cloud_2" },
        });
    });

    it("adds a flow and increments counter", () => {
        const flow: Flow = {
            ...DEFAULT_FLOW,
            id: "flow_1",
        };

        const op: Operation = {
            type: "flow/add",
            flow,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.flows["flow_1"]).toEqual(flow);
        expect(state.counter).toBe(2);
    });

    it("updates a flow", () => {
        useGraphStore.setState({
            flows: {
                "flow_1": { ...DEFAULT_FLOW, id: "flow_1" },
            },
        });

        const op: Operation = {
            type: "flow/update",
            id: "flow_1",
            patch: { curvature: 0.5 },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().flows["flow_1"].curvature).toBe(0.5);
    });

    it("deletes a flow", () => {
        useGraphStore.setState({
            flows: {
                "flow_1": { ...DEFAULT_FLOW, id: "flow_1" },
                "flow_2": { ...DEFAULT_FLOW, id: "flow_2" },
            },
        });

        const op: Operation = {
            type: "flow/delete",
            id: "flow_1",
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().flows).toEqual({
            "flow_2": { ...DEFAULT_FLOW, id: "flow_2" },
        });
    });

    it("does not increment counter on update or delete", () => {
        useGraphStore.setState({
            counter: 5,
            nodes: {
                "node_1": { ...DEFAULT_NODE, id: "node_1", label: "old" },
            },
        });

        useGraphStore.getState().apply({
            type: "node/update",
            id: "node_1",
            patch: { label: "updated" },
        });

        useGraphStore.getState().apply({
            type: "node/delete",
            id: "node_1",
        });

        expect(useGraphStore.getState().counter).toBe(5);
    });
});
