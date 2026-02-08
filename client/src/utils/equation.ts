import { type Flow, isFlowId, isNodeId, isStockId, type Node, type Stock } from "@/models/graph";

import {
    VALID_ENTITY_ID_REGEX,
    VALID_EQUATION_REGEX,
    VALID_NUMBER,
    VALID_OPERATOR_REGEX,
} from "./constants";

export function replaceEquationIdsWithLabels(
    equation: string,
    nodes: Record<string, Node>,
    stocks: Record<string, Stock>,
    flows: Record<string, Flow>,
): string {
    return equation.replace(new RegExp(VALID_ENTITY_ID_REGEX, "g"), (id) => {
        const entity = nodes[id] ?? stocks[id] ?? flows[id];
        return entity?.label ?? "??";
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

export function validateEquation(
    equation: string,
    nodes: Record<string, Node>,
    flows: Record<string, Flow>,
    stocks: Record<string, Stock>,
) {
    equation = equation.trim();
    if (equation.length < 1) return true;
    const tokens = equation.match(VALID_EQUATION_REGEX);
    if (!tokens) return false;

    const reconstructed = tokens.join("");
    const stripped = equation.replace(/\s+/g, "");

    if (reconstructed !== stripped) return false;

    const tokensWithValidIds = tokens.filter((tok) => {
        // Keep numbers and operators
        if (new RegExp(VALID_NUMBER).test(tok)) return true;
        if (new RegExp(VALID_OPERATOR_REGEX).test(tok)) return true;

        // Keep ID tokens only if they exist in state
        if (isNodeId(tok)) return nodes[tok] !== undefined;
        if (isFlowId(tok)) return flows[tok] !== undefined;
        if (isStockId(tok)) return stocks[tok] !== undefined;
        return false;
    });
    return tokensWithValidIds.length === tokens.length;
}

export function removeInvalidCharacters(
    equation: string,
    nodes: Record<string, Node>,
    flows: Record<string, Flow>,
    stocks: Record<string, Stock>,
) {
    const tokens = equation.match(VALID_EQUATION_REGEX);
    if (!tokens) return "";

    const tokensWithValidIds = tokens.filter((tok) => {
        // Keep numbers and operators
        if (new RegExp(VALID_NUMBER).test(tok)) return true;
        if (new RegExp(VALID_OPERATOR_REGEX).test(tok)) return true;

        // Keep ID tokens only if they exist in state
        if (isNodeId(tok)) return nodes[tok] !== undefined;
        if (isFlowId(tok)) return flows[tok] !== undefined;
        if (isStockId(tok)) return stocks[tok] !== undefined;

        return false;
    });

    return tokensWithValidIds.join(" ");
}
