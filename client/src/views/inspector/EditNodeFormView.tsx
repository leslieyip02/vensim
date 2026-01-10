import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNodeForm } from "@/controllers/form";
import { LuTrash2 } from "react-icons/lu";

export function EditNodeFormView({ nodeId }: { nodeId: string }) {
    const { defaultLabel, handleSubmit, handleCancel, handleDelete } = useNodeForm(nodeId);

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>Edit Node</FieldLegend>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="label">Node Label</FieldLabel>
                            <Input id="label" name="label" defaultValue={defaultLabel} />
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <Field orientation="horizontal">
                    <Button type="submit">Confirm Changes</Button>
                    <Button variant="outline" type="button" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="destructive" type="button" onClick={handleDelete}>
                        <LuTrash2 />
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
