import { getParentEntities } from "@/actions/graphTraversal";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNodeForm } from "@/controllers/form";
import { useGraphStore } from "@/stores/graph";
import {
    buildLabelToIdMap,
    removeInvalidCharacters,
    replaceEquationIdsWithLabels,
    replaceEquationLabelsWithIds,
} from "@/utils/equation";

import { EquationFormWrapper } from "./EquationFormWrapper";

function EquationFieldSet({ nodeId }: { nodeId: string }) {
    const { node, handleChange } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    const parents = getParentEntities(node.id);
    const labelMap = buildLabelToIdMap(parents);
    const state = useGraphStore.getState();

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Equation</FieldLabel>
                <Input
                    name="equation"
                    value={replaceEquationIdsWithLabels(
                        node.equation,
                        state.nodes,
                        state.stocks,
                        state.flows,
                    )}
                    onChange={(e) => {
                        handleChange({
                            equation: replaceEquationLabelsWithIds(e.target.value, labelMap),
                        });
                    }}
                    onBlur={() => {
                        const validEquation = removeInvalidCharacters(node.equation);

                        handleChange({ equation: validEquation });
                    }}
                />
            </Field>
        </FieldSet>
    );
}

export function EditNodeEquationFormView({ nodeId }: { nodeId: string }) {
    const { node, handleCancel, handleChange } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    const parents = getParentEntities(node.id);

    return (
        <EquationFormWrapper
            label="Edit Equation"
            onCancel={handleCancel}
            onDelete={() => handleChange({ equation: "" })}
            showDelete
        >
            <EquationFieldSet nodeId={nodeId} />
            {parents.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {parents?.map((parent) => {
                        if (!parent || !parent.label) return null;
                        const onClick = () =>
                            handleChange({
                                equation: `${node.equation.trim()} ${parent.id}`,
                            });
                        return (
                            <Badge
                                key={parent.id}
                                className="h-9 px-3 flex items-center cursor-pointer rounded-md bg-gray-600 hover:bg-gray-300 transition-colors"
                                onClick={onClick}
                            >
                                {parent.label}
                            </Badge>
                        );
                    })}
                </div>
            )}
        </EquationFormWrapper>
    );
}
