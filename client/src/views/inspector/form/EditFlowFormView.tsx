import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useFlowForm } from "@/controllers/form";

import { ToggleTagsView } from "../tag/ToggleTagsView";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

function FlowFieldSet({ flowId }: { flowId: string }) {
    const { flow, handleChange } = useFlowForm(flowId);
    if (!flow) {
        return null;
    }

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Curvature</FieldLabel>
                <Input
                    type="number"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={flow.curvature}
                    onChange={(e) => handleChange({ curvature: Number(e.target.value) })}
                />
                <Slider
                    min={-1}
                    max={1}
                    step={0.01}
                    value={[flow.curvature]}
                    onValueChange={(v) => handleChange({ curvature: Number(v) })}
                />
            </Field>

            <Field>
                <FieldLabel>Tags</FieldLabel>
                <ToggleTagsView targetIds={[flowId]} />
            </Field>
        </FieldSet>
    );
}

export function EditFlowFormView({ flowId }: { flowId: string }) {
    const { flow, handleCancel, handleDelete } = useFlowForm(flowId);
    if (!flow) {
        return null;
    }

    return (
        <InspectorFormWrapper
            label="Edit Flow"
            onCancel={handleCancel}
            onDelete={handleDelete}
            showDelete
        >
            <FlowFieldSet flowId={flowId} />
        </InspectorFormWrapper>
    );
}
