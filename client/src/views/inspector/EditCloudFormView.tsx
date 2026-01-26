import { LuTrash2 } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useCloudForm } from "@/controllers/form";

import { EditTagsView } from "./EditTagsView";

export function EditCloudFormView({ cloudId }: { cloudId: string }) {
    const { cloud, handleChange, handleCancel, handleDelete } = useCloudForm(cloudId);
    if (!cloud) {
        return null;
    }

    return (
        <FieldGroup>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Radius</FieldLabel>
                        <Input
                            type="number"
                            min={1}
                            max={100}
                            step={1}
                            value={cloud.radius}
                            onChange={(e) => handleChange({ radius: Number(e.target.value) })}
                        />
                        <Slider
                            min={1}
                            max={100}
                            step={1}
                            value={[cloud.radius]}
                            onValueChange={(v) => handleChange({ radius: Number(v) })}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Tags</FieldLabel>
                        <EditTagsView targetIds={[cloudId]} />
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
