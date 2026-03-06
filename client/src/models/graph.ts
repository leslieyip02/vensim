export const ID_SEPARATOR = "_";

export type Polarity = "+" | "-";

export type LoopType = "R" | "B" | null;

export interface Identifiable {
    id: string;
}

export interface Selectable {
    // this refers to username instead of client
    // because the cursor model already includes it
    selectedBy?: string | null;
}

export interface Node extends Identifiable, Selectable {
    x: number;
    y: number;
    radius: number;
    label: string;
    description: string;
    equation: string;
}

export interface Edge extends Identifiable, Selectable {
    from: string;
    to: string;
    polarity: Polarity | null;
    curvature: number;
}

export interface Stock extends Identifiable, Selectable {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    description: string;
    equation: string;
}

export interface Cloud extends Identifiable, Selectable {
    x: number;
    y: number;
    radius: number;
}

export interface Flow extends Identifiable, Selectable {
    label: string;
    from: string;
    to: string;
    curvature: number;
    equation: string;
}

export interface Loop extends Identifiable, Selectable {
    relX: number;
    relY: number;
    edgeIds: string[];
    loopType: LoopType;
    label: string;
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

export function isLoopId(id: string): boolean {
    return id.startsWith("loop");
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

export function isLoop(element: Identifiable): element is Loop {
    return isLoopId(element.id);
}
