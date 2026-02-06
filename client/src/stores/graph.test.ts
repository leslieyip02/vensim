import { beforeEach, describe, expect, it } from "vitest";

import {
    type Cloud,
    type Edge,
    type Flow,
    ID_SEPARATOR,
    type Node,
    type Stock,
} from "@/models/graph";
import type { Operation } from "@/models/operation";

import { useGraphStore } from "./graph";

const DEFAULT_NODE: Node = {
    id: `node${ID_SEPARATOR}0`,
    x: 0,
    y: 0,
    radius: 0,
    label: "",
    description: "",
};

const DEFAULT_EDGE: Edge = {
    id: `edge${ID_SEPARATOR}0`,
    from: "",
    to: "",
    polarity: "+",
    curvature: 0,
};

const DEFAULT_STOCK: Stock = {
    id: `stock${ID_SEPARATOR}0`,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    label: "",
    description: "",
};

const DEFAULT_CLOUD: Cloud = {
    id: `cloud${ID_SEPARATOR}0`,
    x: 0,
    y: 0,
    radius: 0,
};

const DEFAULT_FLOW: Flow = {
    id: `flow${ID_SEPARATOR}0`,
    from: `stock${ID_SEPARATOR}0`,
    to: `cloud${ID_SEPARATOR}0`,
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
            id: `node${ID_SEPARATOR}1`,
            label: "Node 1",
        };

        const op: Operation = {
            type: "node/add",
            node,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.nodes[`node${ID_SEPARATOR}1`]).toEqual(node);
        expect(state.counter).toBe(2);
    });

    it("updates a node", () => {
        useGraphStore.setState({
            nodes: {
                [`node${ID_SEPARATOR}1`]: {
                    ...DEFAULT_NODE,
                    id: `node${ID_SEPARATOR}1`,
                    label: "old",
                },
            },
        });

        const op: Operation = {
            type: "node/update",
            id: `node${ID_SEPARATOR}1`,
            patch: { label: "updated" },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().nodes[`node${ID_SEPARATOR}1`].label).toBe("updated");
    });

    it("deletes a node", () => {
        useGraphStore.setState({
            nodes: {
                [`node${ID_SEPARATOR}1`]: { ...DEFAULT_NODE, id: `node${ID_SEPARATOR}1` },
                [`node${ID_SEPARATOR}2`]: { ...DEFAULT_NODE, id: `node${ID_SEPARATOR}2` },
            },
        });

        const op: Operation = {
            type: "node/delete",
            id: `node${ID_SEPARATOR}1`,
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().nodes).toEqual({
            [`node${ID_SEPARATOR}2`]: { ...DEFAULT_NODE, id: `node${ID_SEPARATOR}2` },
        });
    });

    it("adds an edge and increments counter", () => {
        const edge: Edge = {
            ...DEFAULT_EDGE,
            id: `edge${ID_SEPARATOR}1`,
            from: `node${ID_SEPARATOR}1`,
            to: `node${ID_SEPARATOR}2`,
        };

        const op: Operation = {
            type: "edge/add",
            edge,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.edges[`edge${ID_SEPARATOR}1`]).toEqual(edge);
        expect(state.counter).toBe(2);
    });

    it("updates an edge", () => {
        useGraphStore.setState({
            edges: {
                [`edge${ID_SEPARATOR}1`]: {
                    ...DEFAULT_EDGE,
                    id: `edge${ID_SEPARATOR}1`,
                    from: "a",
                    to: "b",
                },
            },
        });

        const op: Operation = {
            type: "edge/update",
            id: `edge${ID_SEPARATOR}1`,
            patch: { to: "c" },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().edges[`edge${ID_SEPARATOR}1`].to).toBe("c");
    });

    it("deletes an edge", () => {
        useGraphStore.setState({
            edges: {
                [`edge${ID_SEPARATOR}1`]: { ...DEFAULT_EDGE, id: `edge${ID_SEPARATOR}1` },
                [`edge${ID_SEPARATOR}2`]: { ...DEFAULT_EDGE, id: `edge${ID_SEPARATOR}2` },
            },
        });

        const op: Operation = {
            type: "edge/delete",
            id: `edge${ID_SEPARATOR}1`,
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().edges).toEqual({
            [`edge${ID_SEPARATOR}2`]: { ...DEFAULT_EDGE, id: `edge${ID_SEPARATOR}2` },
        });
    });

    it("adds a stock and increments counter", () => {
        const stock: Stock = {
            ...DEFAULT_STOCK,
            id: `stock${ID_SEPARATOR}1`,
        };

        const op: Operation = {
            type: "stock/add",
            stock,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.stocks[`stock${ID_SEPARATOR}1`]).toEqual(stock);
        expect(state.counter).toBe(2);
    });

    it("updates a stock", () => {
        useGraphStore.setState({
            stocks: {
                [`stock${ID_SEPARATOR}1`]: { ...DEFAULT_STOCK, id: `stock${ID_SEPARATOR}1` },
            },
        });

        const op: Operation = {
            type: "stock/update",
            id: `stock${ID_SEPARATOR}1`,
            patch: { x: 30 },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().stocks[`stock${ID_SEPARATOR}1`].x).toBe(30);
    });

    it("deletes a stock", () => {
        useGraphStore.setState({
            stocks: {
                [`stock${ID_SEPARATOR}1`]: { ...DEFAULT_STOCK, id: `stock${ID_SEPARATOR}1` },
                [`stock${ID_SEPARATOR}2`]: { ...DEFAULT_STOCK, id: `stock${ID_SEPARATOR}2` },
            },
        });

        const op: Operation = {
            type: "stock/delete",
            id: `stock${ID_SEPARATOR}1`,
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().stocks).toEqual({
            [`stock${ID_SEPARATOR}2`]: { ...DEFAULT_STOCK, id: `stock${ID_SEPARATOR}2` },
        });
    });

    it("adds a cloud and increments counter", () => {
        const cloud: Cloud = {
            ...DEFAULT_CLOUD,
            id: `cloud${ID_SEPARATOR}1`,
        };

        const op: Operation = {
            type: "cloud/add",
            cloud: cloud,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.clouds[`cloud${ID_SEPARATOR}1`]).toEqual(cloud);
        expect(state.counter).toBe(2);
    });

    it("updates a cloud", () => {
        useGraphStore.setState({
            clouds: {
                [`cloud${ID_SEPARATOR}1`]: { ...DEFAULT_CLOUD, id: `cloud${ID_SEPARATOR}1` },
            },
        });

        const op: Operation = {
            type: "cloud/update",
            id: `cloud${ID_SEPARATOR}1`,
            patch: { x: 30 },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().clouds[`cloud${ID_SEPARATOR}1`].x).toBe(30);
    });

    it("deletes a cloud", () => {
        useGraphStore.setState({
            clouds: {
                [`cloud${ID_SEPARATOR}1`]: { ...DEFAULT_CLOUD, id: `cloud${ID_SEPARATOR}1` },
                [`cloud${ID_SEPARATOR}2`]: { ...DEFAULT_CLOUD, id: `cloud${ID_SEPARATOR}2` },
            },
        });

        const op: Operation = {
            type: "cloud/delete",
            id: `cloud${ID_SEPARATOR}1`,
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().clouds).toEqual({
            [`cloud${ID_SEPARATOR}2`]: { ...DEFAULT_CLOUD, id: `cloud${ID_SEPARATOR}2` },
        });
    });

    it("adds a flow and increments counter", () => {
        const flow: Flow = {
            ...DEFAULT_FLOW,
            id: `flow${ID_SEPARATOR}1`,
        };

        const op: Operation = {
            type: "flow/add",
            flow,
        };

        useGraphStore.getState().apply(op);

        const state = useGraphStore.getState();

        expect(state.flows[`flow${ID_SEPARATOR}1`]).toEqual(flow);
        expect(state.counter).toBe(2);
    });

    it("updates a flow", () => {
        useGraphStore.setState({
            flows: {
                [`flow${ID_SEPARATOR}1`]: { ...DEFAULT_FLOW, id: `flow${ID_SEPARATOR}1` },
            },
        });

        const op: Operation = {
            type: "flow/update",
            id: `flow${ID_SEPARATOR}1`,
            patch: { curvature: 0.5 },
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().flows[`flow${ID_SEPARATOR}1`].curvature).toBe(0.5);
    });

    it("deletes a flow", () => {
        useGraphStore.setState({
            flows: {
                [`flow${ID_SEPARATOR}1`]: { ...DEFAULT_FLOW, id: `flow${ID_SEPARATOR}1` },
                [`flow${ID_SEPARATOR}2`]: { ...DEFAULT_FLOW, id: `flow${ID_SEPARATOR}2` },
            },
        });

        const op: Operation = {
            type: "flow/delete",
            id: `flow${ID_SEPARATOR}1`,
        };

        useGraphStore.getState().apply(op);

        expect(useGraphStore.getState().flows).toEqual({
            [`flow${ID_SEPARATOR}2`]: { ...DEFAULT_FLOW, id: `flow${ID_SEPARATOR}2` },
        });
    });

    it("does not increment counter on update or delete", () => {
        useGraphStore.setState({
            counter: 5,
            nodes: {
                [`node${ID_SEPARATOR}1`]: {
                    ...DEFAULT_NODE,
                    id: `node${ID_SEPARATOR}1`,
                    label: "old",
                },
            },
        });

        useGraphStore.getState().apply({
            type: "node/update",
            id: `node${ID_SEPARATOR}1`,
            patch: { label: "updated" },
        });

        useGraphStore.getState().apply({
            type: "node/delete",
            id: `node${ID_SEPARATOR}1`,
        });

        expect(useGraphStore.getState().counter).toBe(5);
    });
});
