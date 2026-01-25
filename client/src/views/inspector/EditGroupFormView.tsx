import { LuTrash2 } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { useGroupForm } from "@/controllers/form";

import { EditTagsView } from "./EditTagsView";

export function EditGroupFormView({ targetIds }: { targetIds: string[] }) {
    const { handleCancel, handleDelete } = useGroupForm(targetIds);

    return (
        <FieldGroup>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Tags</FieldLabel>
                        <EditTagsView targetIds={targetIds} />
                    </Field>
                </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
                <Button variant="outline" type="button" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="destructive" type="button" onClick={handleDelete}>
                    <LuTrash2 />
                </Button>
            </Field>
        </FieldGroup>
    );
}
