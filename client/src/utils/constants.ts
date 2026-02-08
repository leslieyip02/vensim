import { ID_SEPARATOR } from "@/models/graph";

export const VALID_ENTITY_ID_REGEX = String.raw`\b(node|stock|flow)${ID_SEPARATOR}\d+\b`;
export const VALID_OPERATOR_REGEX = String.raw`[+\-*/]`;
export const VALID_NUMBER = String.raw`\d+(?:\.\d+)?`;

export const VALID_EQUATION_REGEX = new RegExp(
    `${VALID_ENTITY_ID_REGEX}|${VALID_NUMBER}|${VALID_OPERATOR_REGEX}`,
    "g",
);

function getValidOperators(): string {
    // Remove ^, $ and brackets
    const stripped = VALID_OPERATOR_REGEX.replace(/[\^$[\]]/g, "");
    // Remove backslashes used for escaping
    return stripped.replace(/\\/g, "").split("").join(" ");
}

export const VALID_OPERATOR_STRING = getValidOperators();
