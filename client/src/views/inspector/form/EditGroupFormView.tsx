import { Field, FieldLabel } from "@/components/ui/field";
import { useGroupForm } from "@/controllers/form";

import { EditTagsView } from "./EditTagsView";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

export function EditGroupFormView({ targetIds }: { targetIds: string[] }) {
    const { handleCancel, handleDelete } = useGroupForm(targetIds);

    return (
        <InspectorFormWrapper onCancel={handleCancel} onDelete={handleDelete} showDelete>
            <Field>
                <FieldLabel>Tags</FieldLabel>
                <EditTagsView targetIds={targetIds} />
            </Field>
        </InspectorFormWrapper>
    );
}
