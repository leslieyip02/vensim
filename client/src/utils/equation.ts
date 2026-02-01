import type { Flow, Node, Stock } from "@/models/graph";

export function replaceEquationIdsWithLabels(
    equation: string,
    nodes: Record<string, Node>,
    stocks: Record<string, Stock>,
    flows: Record<string, Flow>,
): string {
    return equation.replace(/\b(node|stock|flow)-\d+\b/g, (id) => {
        const entity = nodes[id] ?? stocks[id] ?? flows[id];
        return entity?.label ?? id;
    });
}

/**
 * Escapes special RegExp characters that may be present in user-provided labels
 * Allows for RegExp to correctly match labels
 *
 * Example:
 *   "(rate)" -> "\\(rate\\)"
 */
function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function replaceEquationLabelsWithIds(
    equation: string,
    labelMap: Record<string, string>,
): string {
    const regex = new RegExp(
        `\\b(${Object.keys(labelMap)
            .map((l) => escapeRegExp(l))
            .join("|")})\\b`,
        "g",
    );

    return equation.replace(regex, (match) => labelMap[match] ?? match);
}

export function buildLabelToIdMap(parents: Array<Node | Flow | Stock>) {
    const map: Record<string, string> = {};
    parents.forEach((entity) => {
        if (entity.label) {
            map[entity.label] = entity.id;
        }
    });
    return map;
}

export function removeInvalidCharacters(equation: string) {
    const tokens = equation.match(/\b(?:node|flow|stock)-\d+\b|\d+(?:\.\d+)?|[+\-*/]/g);
    return tokens ? tokens.join(" ") : "";
}
