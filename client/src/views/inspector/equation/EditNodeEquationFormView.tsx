import { getParentEntities } from "@/actions/graphTraversal";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNodeForm } from "@/controllers/form";
import { useGraphStore } from "@/stores/graph";

import { InspectorFormWrapper } from "../form/InspectorFormWrapper";

function renderEquation(equation: string): string {
    const state = useGraphStore.getState();

    return equation.replace(/\b(node|stock|flow)-\d+\b/g, (id) => {
        const entity = state.nodes[id] ?? state.stocks[id] ?? state.flows[id];

        return entity?.label ?? id; // fallback to id if label missing
    });
}

function EquationFieldSet({ nodeId }: { nodeId: string }) {
    const { node, handleChange } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Equation</FieldLabel>
                <Input
                    name="equation"
                    value={renderEquation(node.equation)}
                    onChange={(e) =>
                        handleChange({
                            equation: e.target.value,
                            displayedEquation: e.target.value,
                        })
                    }
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
                            displayedEquation: node.displayedEquation + " " + parent.label,
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
