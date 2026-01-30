import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { useGroupForm } from "@/controllers/form";

import { ToggleTagsView } from "../tag/ToggleTagsView";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

function GroupFieldSet({ targetIds }: { targetIds: string[] }) {
    return (
        <FieldSet>
            <Field>
                <FieldLabel>Tags</FieldLabel>
                <ToggleTagsView targetIds={targetIds} />
            </Field>
        </FieldSet>
    );
}

export function EditGroupFormView({ targetIds }: { targetIds: string[] }) {
    const { handleCancel, handleDelete } = useGroupForm(targetIds);

    return (
        <InspectorFormWrapper onCancel={handleCancel} onDelete={handleDelete} showDelete>
            <GroupFieldSet targetIds={targetIds} />
        </InspectorFormWrapper>
    );
}
