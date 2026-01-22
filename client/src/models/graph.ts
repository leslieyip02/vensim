export type Polarity = "+" | "-";

export interface Node {
    id: string;
    x: number;
    y: number;
    radius: number;
    label: string;
    description: string;
}

export interface Edge {
    id: string;
    from: string;
    to: string;
    polarity: Polarity;
    curvature: number;
}

export interface Stock {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    description: string;
}

export function makeNodeId(counter: number) {
    return `node-${counter}`;
}

export function makeEdgeId(counter: number) {
    return `edge-${counter}`;
}

export function makeStockId(counter: number) {
    return `stock-${counter}`;
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