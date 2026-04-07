import { ID_SEPARATOR } from "@/models/graph";

export const VALID_FUNCTION_REGEX = String.raw`\b[A-Z_][A-Z0-9_]*\b`;
export const VALID_COMPARISON_REGEX = String.raw`==|!=|>=|<=|>|<`;
export const VALID_COMMA = String.raw`,`;
export const VALID_ENTITY_ID_REGEX = String.raw`\b(node|stock|flow)${ID_SEPARATOR}\d+\b`;
export const VALID_OPERATOR_REGEX = String.raw`[+\-*/()]`;
export const VALID_NUMBER = String.raw`\d+(?:\.\d+)?`;

export const VALID_EQUATION_REGEX = new RegExp(
    `${VALID_ENTITY_ID_REGEX}|${VALID_NUMBER}|${VALID_COMPARISON_REGEX}|${VALID_OPERATOR_REGEX}|${VALID_COMMA}|${VALID_FUNCTION_REGEX}`,
    "g",
);

export const VALID_FUNCTIONS = new Set(["IF", "STEP", "LOOKUP"]);

function getValidOperators(): string {
    // Remove ^, $ and brackets
    const stripped = VALID_OPERATOR_REGEX.replace(/[\^$[\]]/g, "");
    // Remove backslashes used for escaping
    return stripped.replace(/\\/g, "").split("").join(" ") + " ";
}

export const VALID_OPERATOR_STRING = getValidOperators();

function getValidComparisonOperators(): string {
    // Remove ^ and $ from the regex string
    return VALID_COMPARISON_REGEX.replace(/[\^$]/g, "").split("|").join(" ");
}

export const VALID_COMPARISON_STRING = getValidComparisonOperators();

export const VALID_FUNCTIONS_STRING = [...VALID_FUNCTIONS].join(", ");
