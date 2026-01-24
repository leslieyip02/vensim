import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useFlowForm } from "@/controllers/form";
import { LuTrash2 } from "react-icons/lu";
import { EditTagsView } from "./EditTagsView";

export function EditFlowFormView({ flowId }: { flowId: string }) {
    const { flow, handleChange, handleCancel, handleDelete } = useFlowForm(flowId);
    if (!flow) {
        return null;
    }

    return (
        <FieldGroup>
            <FieldSet>
                <FieldGroup>
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
                        <EditTagsView targetIds={[flowId]} />
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
