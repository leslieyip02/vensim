import { LuTrash2 } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTagForm } from "@/controllers/form";

export function EditTagFormView({ tagId }: { tagId: string }) {
    const { tag, handleChange, handleDelete } = useTagForm(tagId);
    if (!tag) {
        return null;
    }

    return (
        <FieldGroup>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Label</FieldLabel>
                        <Input
                            name="label"
                            value={tag.label}
                            onChange={(e) => handleChange({ label: e.target.value })}
                        />
                    </Field>
                </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
                <Button variant="destructive" type="button" onClick={handleDelete}>
                    <LuTrash2 />
                </Button>
            </Field>
        </FieldGroup>
    );
}
