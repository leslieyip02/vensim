export type Polarity = "+" | "-";

export interface Node {
    id: string;
    x: number;
    y: number;
    label: string;
    fixed?: boolean;
}

export interface Edge {
    id: string;
    from: string;
    to: string;
    polarity: Polarity;
    curvature: number;
}

export function toNodeId(counter: number) {
    return `node-${counter}`;
}

export function toEdgeId(counter: number) {
    return `edge-${counter}`;
}

export function isNodeId(id: string): boolean {
    return id.startsWith("node");
}

export function isEdgeId(id: string): boolean {
    return id.startsWith("edge");
}