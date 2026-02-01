type VariableRef = { type: "variable"; id: string };
type NumberLiteral = { type: "number"; value: number };
type Operation = { type: "operation"; op: "+" | "-" | "*" | "/"; left: Equation; right: Equation };

export type Equation = VariableRef | NumberLiteral | Operation;
