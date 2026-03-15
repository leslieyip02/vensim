import { type Node, type Stock, type Flow } from "@/models/graph";

export function haveNonEmptyLabels(entities: (Node | Stock | Flow)[]): boolean {
    return entities.every(e => e.label && e.label.trim() !== "");
}

export function haveUniqueLabels(entities: (Node | Stock | Flow)[]): boolean {
    const names = entities.map(e => e.label.trim());
    return new Set(names).size === names.length;
}

export function haveNonEmptyEquations(entities: (Node | Flow)[]): boolean {
    return entities.every(e => e.equation && e.equation.trim() !== "");
}

export function haveAllInitialValues(stocks: Stock[]): boolean {
    return stocks.every(s => s.initialValue !== undefined && s.initialValue !== null);
}

export function haveStock(stocks: Stock[]): boolean {
    return stocks.length > 0;
}