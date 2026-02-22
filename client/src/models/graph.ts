export const ID_SEPARATOR = "_";

export type Polarity = "+" | "-";

interface Identifiable {
    id: string;
}

export interface Node extends Identifiable {
    x: number;
    y: number;
    radius: number;
    label: string;
    description: string;
    equation: string;
}

export interface Edge extends Identifiable {
    from: string;
    to: string;
    polarity: Polarity | null;
    curvature: number;
}

export interface Stock extends Identifiable {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    description: string;
    equation: string;
}

export interface Cloud extends Identifiable {
    x: number;
    y: number;
    radius: number;
}

export interface Flow extends Identifiable {
    label: string;
    from: string;
    to: string;
    curvature: number;
    equation: string;
}

export function makeNodeId(counter: number) {
    return `node${ID_SEPARATOR}${counter}`;
}

export function makeEdgeId(counter: number) {
    return `edge${ID_SEPARATOR}${counter}`;
}

export function makeStockId(counter: number) {
    return `stock${ID_SEPARATOR}${counter}`;
}

export function makeCloudId(counter: number) {
    return `cloud${ID_SEPARATOR}${counter}`;
}

export function makeFlowId(counter: number) {
    return `flow${ID_SEPARATOR}${counter}`;
}

export function isNodeId(id: string): boolean {
    return id.startsWith("node");
}

export function isEdgeId(id: string): boolean {
    return id.startsWith("edge");
}

export function isStockId(id: string): boolean {
    return id.startsWith("stock");
}

export function isCloudId(id: string): boolean {
    return id.startsWith("cloud");
}

export function isFlowId(id: string): boolean {
    return id.startsWith("flow");
}

export function isNode(element: Identifiable): element is Node {
    return isNodeId(element.id);
}

export function isEdge(element: Identifiable): element is Edge {
    return isEdgeId(element.id);
}

export function isStock(element: Identifiable): element is Stock {
    return isStockId(element.id);
}

export function isCloud(element: Identifiable): element is Cloud {
    return isCloudId(element.id);
}

export function isFlow(element: Identifiable): element is Flow {
    return isFlowId(element.id);
}

export type Operation =
    | { type: "node/add"; node: Node }
    | { type: "node/update"; id: string; patch: Partial<Node> }
    | { type: "node/delete"; id: string }
    | { type: "edge/add"; edge: Edge }
    | { type: "edge/update"; id: string; patch: Partial<Edge> }
    | { type: "edge/delete"; id: string }
    | { type: "stock/add"; stock: Stock }
    | { type: "stock/update"; id: string; patch: Partial<Stock> }
    | { type: "stock/delete"; id: string }
    | { type: "cloud/add"; cloud: Cloud }
    | { type: "cloud/update"; id: string; patch: Partial<Cloud> }
    | { type: "cloud/delete"; id: string }
    | { type: "flow/add"; flow: Flow }
    | { type: "flow/update"; id: string; patch: Partial<Flow> }
    | { type: "flow/delete"; id: string };
