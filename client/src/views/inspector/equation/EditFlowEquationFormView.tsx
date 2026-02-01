import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFlowForm } from "@/controllers/form";

import { InspectorFormWrapper } from "../form/InspectorFormWrapper";

function EquationFieldSet({ flowId }: { flowId: string }) {
    const { flow, handleChange } = useFlowForm(flowId);
    if (!flow) {
        return null;
    }

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Equation</FieldLabel>
                <Input
                    name="equation"
                    value={flow.equation}
                    onChange={(e) => handleChange({ equation: e.target.value })}
                />
            </Field>
        </FieldSet>
    );
}

export function EditFlowEquationFormView({ flowId }: { flowId: string }) {
    const { flow, handleCancel, handleDelete } = useFlowForm(flowId);
    if (!flow) {
        return null;
    }

    return (
        <InspectorFormWrapper
            label="Edit Equation"
            onCancel={handleCancel}
            onDelete={handleDelete}
            showDelete
        >
            <EquationFieldSet flowId={flowId} />
        </InspectorFormWrapper>
    );
}
