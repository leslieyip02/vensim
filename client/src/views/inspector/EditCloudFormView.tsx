import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useCloudForm } from "@/controllers/form";
import { LuTrash2 } from "react-icons/lu";
import { EditTagsView } from "./EditTagsView";

export function EditCloudFormView({ nodeId }: { nodeId: string }) {
    const { cloud, handleChange, handleCancel, handleDelete } = useCloudForm(nodeId);
    if (!cloud) {
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
                            value={cloud.label}
                            onChange={(e) => handleChange({ label: e.target.value })}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea
                            value={cloud.description}
                            onChange={(e) => handleChange({ description: e.target.value })}
                        />
                    </Field>
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
                        <EditTagsView targetIds={[nodeId]} />
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
