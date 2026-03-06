import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLoopForm } from "@/controllers/form";

import { ToggleTagsView } from "../tag/ToggleTagsView";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

function LoopFieldSet({ loopId }: { loopId: string }) {
    const { loop, handleChange } = useLoopForm(loopId);
    if (!loop) {
        return null;
    }

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Label</FieldLabel>
                <Input
                    name="label"
                    value={loop.label}
                    onChange={(e) => handleChange({ label: e.target.value })}
                />
            </Field>

            <Field>
                <FieldLabel>Tags</FieldLabel>
                <ToggleTagsView targetIds={[loopId]} />
            </Field>
        </FieldSet>
    );
}

export function EditLoopFormView({ loopId }: { loopId: string }) {
    const { loop, handleCancel, handleDelete } = useLoopForm(loopId);
    if (!loop) {
        return null;
    }

    return (
        <InspectorFormWrapper
            label="Edit Loop"
            onCancel={handleCancel}
            onDelete={handleDelete}
            showDelete
        >
            <LoopFieldSet loopId={loopId} />
        </InspectorFormWrapper>
    );
}
