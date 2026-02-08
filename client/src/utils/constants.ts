export const VALID_ENTITY_ID_REGEX = String.raw`\b(node|stock|flow)-\d+\b`;
export const VALID_OPERATOR_REGEX = String.raw`^[+\-*/]$`;
export const VALID_NUMBER = String.raw`^\d+(?:\.\d+)?$`;

export const VALID_EQUATION_REGEX = new RegExp(
    `${VALID_ENTITY_ID_REGEX}|${VALID_NUMBER}|${VALID_OPERATOR_REGEX}`,
    "g",
);
