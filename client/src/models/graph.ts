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
}
