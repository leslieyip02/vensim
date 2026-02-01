import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNodeForm } from "@/controllers/form";

import { InspectorFormWrapper } from "../form/InspectorFormWrapper";

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
                    value={node.equation}
                    onChange={(e) => handleChange({ equation: e.target.value })}
                />
            </Field>
        </FieldSet>
    );
}

export function EditNodeEquationFormView({ nodeId }: { nodeId: string }) {
    const { node, handleCancel, handleDelete } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    return (
        <InspectorFormWrapper
            label="Edit Equation"
            onCancel={handleCancel}
            onDelete={handleDelete}
            showDelete
        >
            <EquationFieldSet nodeId={nodeId} />
        </InspectorFormWrapper>
    );
}
