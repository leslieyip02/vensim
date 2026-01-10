import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useNodeForm } from "@/controllers/form";
import { LuTrash2 } from "react-icons/lu";

export function EditNodeFormView({ nodeId }: { nodeId: string }) {
    const { node, handleChange, handleCancel, handleDelete } = useNodeForm(nodeId);

    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>Edit Node</FieldLegend>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Label</FieldLabel>
                        <Input
                            name="label"
                            value={node.label}
                            onChange={(e) => handleChange({ label: e.target.value })}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea
                            value={node.description}
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
                            value={node.radius}
                            onChange={(e) => handleChange({ radius: Number(e.target.value) })}
                        />
                        <Slider
                            min={1}
                            max={100}
                            step={1}
                            value={[node.radius]}
                            onValueChange={(v) => handleChange({ radius: Number(v) })}
                        />
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
    );
}
