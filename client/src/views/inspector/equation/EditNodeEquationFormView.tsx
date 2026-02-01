import { getParentEntities } from "@/actions/graphTraversal";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { useNodeForm } from "@/controllers/form";
import { useGraphStore } from "@/stores/graph";

import { InspectorFormWrapper } from "../form/InspectorFormWrapper";

function tokenizeEquation(equation: string) {
    const state = useGraphStore.getState();

    const parts = equation.split(/\s+/);

    return parts.map((part) => {
        const entity = state.nodes[part] ?? state.stocks[part] ?? state.flows[part];

        if (entity) {
            return { type: "variable", id: part, label: entity.label };
        }

        return { type: "text", value: part };
    });
}

function EquationFieldSet({ nodeId }: { nodeId: string }) {
    const { node, handleChange } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    const tokens = tokenizeEquation(node.equation);

    const removeToken = (tokenIndex: number) => {
        const newTokens = tokens.filter((_, i) => i !== tokenIndex);

        const newEquation = newTokens
            .map((t) => (t.type === "variable" ? t.id : t.value))
            .join(" ");

        handleChange({ equation: newEquation });
    };

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Equation</FieldLabel>
                <div className="flex flex-wrap items-center gap-1 border p-2 rounded">
                    {tokens.map((t, i) =>
                        t.type === "variable" ? (
                            <Badge
                                key={t.id}
                                className="inline-flex px-2 py-1 rounded bg-gray-200 cursor-pointer items-center"
                                onClick={() => removeToken(i)}
                            >
                                {t.label}
                            </Badge>
                        ) : (
                            <input
                                key={i}
                                type="text"
                                value={t.value}
                                className="inline-block h-full w-auto border-none outline-none"
                                onChange={(e) => {
                                    const newTokens = [...tokens];
                                    newTokens[i] = { type: "text", value: e.target.value };
                                    const newEquation = newTokens
                                        .map((tok) =>
                                            tok.type === "variable" ? tok.id : tok.value,
                                        )
                                        .join(" ");
                                    handleChange({ equation: newEquation });
                                }}
                            />
                        ),
                    )}
                </div>
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
