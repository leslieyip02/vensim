import { getParentEntities } from "@/actions/graphTraversal";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNodeForm } from "@/controllers/form";
import type { Flow, Node, Stock } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";

import { InspectorFormWrapper } from "../form/InspectorFormWrapper";

function renderEquation(equation: string): string {
    const state = useGraphStore.getState();

    return equation.replace(/\b(node|stock|flow)-\d+\b/g, (id) => {
        const entity = state.nodes[id] ?? state.stocks[id] ?? state.flows[id];

        return entity?.label ?? id;
    });
}

function convertLabelsToIds(renderedEquation: string, labelMap: Record<string, string>): string {
    const regex = new RegExp(
        `\\b(${Object.keys(labelMap)
            .map((l) => escapeRegExp(l))
            .join("|")})\\b`,
        "gi",
    );

    return renderedEquation.replace(regex, (match) => labelMap[match.toLowerCase()] ?? match);
}

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildLabelMap(parents: Array<Node | Flow | Stock>) {
    const map: Record<string, string> = {};
    parents.forEach((entity) => {
        if (entity.label) {
            map[entity.label.toLowerCase()] = entity.id;
        }
    });
    return map;
}

function sanitizeEquationInput(rendered: string) {
    const tokens = rendered.match(/\b(?:node|flow|stock)-\d+\b|\d+(?:\.\d+)?|[+\-*/]/g);
    return tokens ? tokens.join(" ") : "";
}

function EquationFieldSet({ nodeId }: { nodeId: string }) {
    const { node, handleChange } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    const parents = getParentEntities(node.id);
    const labelMap = buildLabelMap(parents);

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Equation</FieldLabel>
                <Input
                    name="equation"
                    value={renderEquation(node.equation)}
                    onChange={(e) => {
                        handleChange({
                            equation: convertLabelsToIds(e.target.value, labelMap),
                        });
                    }}
                    onBlur={() => {
                        const sanitized = sanitizeEquationInput(node.equation);

                        handleChange({ equation: sanitized });
                    }}
                />
            </Field>
        </FieldSet>
    );
}

export function EditNodeEquationFormView({ nodeId }: { nodeId: string }) {
    const { node, handleCancel, handleDelete, handleChange } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    const parents = getParentEntities(node.id);

    return (
        <InspectorFormWrapper
            label="Edit Equation"
            onCancel={handleCancel}
            onDelete={handleDelete}
            showDelete
        >
            <EquationFieldSet nodeId={nodeId} />
            <div className="flex flex-wrap gap-2">
                {parents?.map((parent) => {
                    if (!parent || !parent.label) return null;
                    const onClick = () =>
                        handleChange({
                            equation: node.equation + " " + parent.id,
                        });
                    return (
                        <Badge
                            key={parent.id}
                            className="h-9 px-3 flex items-center cursor-pointer rounded-md"
                            onClick={onClick}
                        >
                            {parent.label}
                        </Badge>
                    );
                })}
            </div>
        </InspectorFormWrapper>
    );
}
