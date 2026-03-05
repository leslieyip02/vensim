import { parse } from "mathjs";

import { type Flow, isFlowId, isNodeId, isStockId, type Node, type Stock } from "@/models/graph";
import {
    VALID_ENTITY_ID_REGEX,
    VALID_EQUATION_REGEX,
    VALID_NUMBER,
    VALID_OPERATOR_REGEX,
    VALID_OPERATOR_STRING,
} from "@/utils/equationValidationRegex";

const INVALID_CHARACTERS_ERROR = `Equation can only contain numbers, operators ${VALID_OPERATOR_STRING} and valid node, stock or flow labels.`;

type EquationValidationResult = {
    isValid: boolean;
    error?: string;
};

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
        `(?<!\\w)(${Object.keys(labelMap)
            .map((l) => escapeRegExp(l))
            .join("|")})(?!\\w)`,
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
): EquationValidationResult {
    equation = equation.trim();
    if (equation.length < 1) return { isValid: true };
    const tokens = equation.match(VALID_EQUATION_REGEX);
    if (!tokens) {
        return {
            isValid: false,
            error: INVALID_CHARACTERS_ERROR,
        };
    }

    const reconstructed = tokens.join("");
    const stripped = equation.replace(/\s+/g, "");

    if (reconstructed !== stripped) {
        return {
            isValid: false,
            error: INVALID_CHARACTERS_ERROR,
        };
    }

    const tokensWithValidIds = tokens.filter((tok) => {
        // Keep numbers and operators
        if (new RegExp(`^${VALID_NUMBER}$`).test(tok)) return true;
        if (new RegExp(`^${VALID_OPERATOR_REGEX}$`).test(tok)) return true;

        // Keep ID tokens only if they exist in state
        if (isNodeId(tok)) return nodes[tok] !== undefined;
        if (isStockId(tok)) return stocks[tok] !== undefined;
        if (isFlowId(tok)) return flows[tok] !== undefined;
    });

    if (tokensWithValidIds.length !== tokens.length) {
        return {
            isValid: false,
            error: INVALID_CHARACTERS_ERROR,
        };
    }

    try {
        parse(tokensWithValidIds.join(" "));
        return { isValid: true };
    } catch {
        return {
            isValid: false,
            error: "Equation should be in the format [operand] [operator] [operand] (e.g. A + B)",
        };
    }
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

export function removeWhitespaces(equation: string) {
    const tokens = equation.match(VALID_EQUATION_REGEX);
    if (!tokens) return "";
    return tokens.map((token) => token.trim()).join(" ");
}
