import type { Cloud, Edge, Flow, Loop, Node, Stock } from "./graph";

export type OperationType =
    | "node/add"
    | "node/update"
    | "node/delete"
    | "edge/add"
    | "edge/update"
    | "edge/delete"
    | "stock/add"
    | "stock/update"
    | "stock/delete"
    | "cloud/add"
    | "cloud/update"
    | "cloud/delete"
    | "flow/add"
    | "flow/update"
    | "flow/delete"
    | "loop/add"
    | "loop/update"
    | "loop/delete";

export type Operation = { type: OperationType } & (
    | { node: Node }
    | { id: string; patch: Partial<Node> }
    | { id: string }
    | { edge: Edge }
    | { id: string; patch: Partial<Edge> }
    | { id: string }
    | { stock: Stock }
    | { id: string; patch: Partial<Stock> }
    | { id: string }
    | { cloud: Cloud }
    | { id: string; patch: Partial<Cloud> }
    | { id: string }
    | { flow: Flow }
    | { id: string; patch: Partial<Flow> }
    | { id: string }
    | { loop: Loop }
    | { id: string; patch: Partial<Loop> }
    | { id: string }
);
