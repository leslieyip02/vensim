import type { Edge, Node, Stock } from "./graph";

export type Operation =
    | { type: "node/add"; node: Node }
    | { type: "node/update"; id: string; patch: Partial<Node> }
    | { type: "node/delete"; id: string }
    | { type: "edge/add"; edge: Edge }
    | { type: "edge/update"; id: string; patch: Partial<Edge> }
    | { type: "edge/delete"; id: string }
    | { type: "stock/add"; stock: Stock }
    | { type: "stock/update"; id: string; patch: Partial<Stock> }
    | { type: "stock/delete"; id: string };
