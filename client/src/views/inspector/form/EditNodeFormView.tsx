import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useNodeForm } from "@/controllers/form";

import { ToggleTagsView } from "../tag/ToggleTagsView";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

function NodeFieldSet({ nodeId }: { nodeId: string }) {
    const { node, handleChange } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    return (
        <FieldSet>
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
                    onValueChange={(v) => handleChange({ radius: Number(v[0]) })}
                />
            </Field>

            <Field>
                <FieldLabel>Tags</FieldLabel>
                <ToggleTagsView targetIds={[nodeId]} />
            </Field>
        </FieldSet>
    );
}

export function EditNodeFormView({ nodeId }: { nodeId: string }) {
    const { node, handleCancel, handleDelete } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    return (
        <InspectorFormWrapper onCancel={handleCancel} onDelete={handleDelete} showDelete>
            <NodeFieldSet nodeId={nodeId} />
        </InspectorFormWrapper>
    );
}
