import { type Flow, isFlowId, isNodeId, isStockId, type Node, type Stock } from "@/models/graph";
import {
    VALID_COMMA,
    VALID_COMPARISON_REGEX,
    VALID_COMPARISON_STRING,
    VALID_ENTITY_ID_REGEX,
    VALID_EQUATION_REGEX,
    VALID_FUNCTION_REGEX,
    VALID_FUNCTIONS,
    VALID_FUNCTIONS_STRING,
    VALID_NUMBER,
    VALID_OPERATOR_REGEX,
    VALID_OPERATOR_STRING,
} from "@/utils/equationValidationRegex";

const INVALID_CHARACTERS_ERROR = `Equation can only contain numbers, operators "${VALID_OPERATOR_STRING}", comparison operators "${VALID_COMPARISON_STRING}", commas, functions "${VALID_FUNCTIONS_STRING}", and valid node/stock/flow labels.`;
const UNBALANCED_PARENTHESES_ERROR = "Equation has unbalanced parentheses.";
const INVALID_BINARY_OPERATOR_ERROR =
    "Operators and comparisons must be placed between two valid operands.";
const INVALID_COMMA_ERROR = "Commas must be inside functions and separate valid arguments.";

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
    // Empty tokens error
    if (!tokens) {
        return {
            isValid: false,
            error: INVALID_CHARACTERS_ERROR,
        };
    }

    const reconstructed = tokens.join("");
    const stripped = equation.replace(/\s+/g, "");

    // Invalid characters error
    if (reconstructed !== stripped) {
        return {
            isValid: false,
            error: INVALID_CHARACTERS_ERROR,
        };
    }

    const tokensWithValidIds = tokens.filter((tok) => {
        // numbers
        if (new RegExp(`^${VALID_NUMBER}$`).test(tok)) return true;
        // math operators
        if (new RegExp(`^${VALID_OPERATOR_REGEX}$`).test(tok)) return true;
        // comparison operators
        if (new RegExp(`^${VALID_COMPARISON_REGEX}$`).test(tok)) return true;
        // comma
        if (tok === VALID_COMMA) return true;
        // functions
        if (new RegExp(`^${VALID_FUNCTION_REGEX}$`).test(tok)) {
            return VALID_FUNCTIONS.has(tok);
        }

        // Keep ID tokens only if they exist in state
        if (isNodeId(tok)) return nodes[tok] !== undefined;
        if (isStockId(tok)) return stocks[tok] !== undefined;
        if (isFlowId(tok)) return flows[tok] !== undefined;
    });

    // Checks for valid IDs and functions
    if (tokensWithValidIds.length !== tokens.length) {
        return {
            isValid: false,
            error: INVALID_CHARACTERS_ERROR,
        };
    }

    if (!hasBalancedParentheses(tokens)) {
        return {
            isValid: false,
            error: UNBALANCED_PARENTHESES_ERROR,
        };
    }

    if (!hasValidBinaryOperatorPlacement(tokens)) {
        return {
            isValid: false,
            error: INVALID_BINARY_OPERATOR_ERROR,
        };
    }

    if (!hasValidCommaPlacement(tokens)) {
        return {
            isValid: false,
            error: INVALID_COMMA_ERROR,
        };
    }

    return { isValid: true };
}

function hasBalancedParentheses(tokens: string[]): boolean {
    let balance = 0;
    for (const token of tokens) {
        if (token === "(") {
            balance++;
        } else if (token === ")") {
            balance--;
            if (balance < 0) {
                return false;
            }
        }
    }
    return balance === 0;
}

const operators = new Set(["+", "-", "*", "/"]);
const comparisons = new Set(["==", "!=", ">", "<", ">=", "<="]);

function isBinaryOp(tok: string) {
    return operators.has(tok) || comparisons.has(tok);
}

function hasValidBinaryOperatorPlacement(tokens: string[]) {
    for (let i = 0; i < tokens.length; i++) {
        const curr = tokens[i];

        if (!isBinaryOp(curr)) continue;

        const prev = tokens[i - 1];
        const next = tokens[i + 1];

        if (curr === "-") {
            const isUnary = i === 0 || isBinaryOp(prev) || prev === "(" || prev === VALID_COMMA;

            if (isUnary) {
                if (i === tokens.length - 1) return false;

                if (isBinaryOp(next) || next === ")" || next === VALID_COMMA) {
                    return false;
                }

                continue;
            }
        }

        if (i === 0 || i === tokens.length - 1) return false;

        if (isBinaryOp(prev) || prev === "(" || prev === VALID_COMMA) {
            return false;
        }

        if (isBinaryOp(next) || next === ")" || next === VALID_COMMA) {
            return false;
        }
    }

    return true;
}

function hasValidCommaPlacement(tokens: string[]) {
    let parenDepth = 0;

    for (let i = 0; i < tokens.length; i++) {
        const curr = tokens[i];
        const prev = tokens[i - 1];
        const next = tokens[i + 1];

        if (curr === "(") parenDepth++;
        if (curr === ")") parenDepth--;

        if (curr !== VALID_COMMA) continue;

        if (parenDepth <= 0) return false;
        if (i === 0 || i === tokens.length - 1) return false;
        if (prev === "(" || prev === VALID_COMMA) return false;
        if (next === ")" || next === VALID_COMMA) return false;
    }

    return true;
}

export function removeWhitespaces(equation: string) {
    const tokens = equation.match(VALID_EQUATION_REGEX);
    if (!tokens) return "";
    return tokens.map((token) => token.trim()).join(" ");
}
