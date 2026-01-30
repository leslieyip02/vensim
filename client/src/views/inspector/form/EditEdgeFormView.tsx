import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useEdgeForm } from "@/controllers/form";
import type { Polarity } from "@/models/graph";

import { ToggleTagsView } from "../tag/ToggleTagsView";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

function EdgeFieldSet({ edgeId }: { edgeId: string }) {
    const { edge, handleChange } = useEdgeForm(edgeId);
    if (!edge) {
        return null;
    }

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Polarity</FieldLabel>
                <Select
                    value={edge.polarity ?? "None"}
                    onValueChange={(v) => {
                        const newValue = v === "None" ? null : (v as Polarity);
                        handleChange({ polarity: newValue });
                    }}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-100">
                        <SelectItem value="+">+</SelectItem>
                        <SelectItem value="-">-</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                </Select>
            </Field>

            <Field>
                <FieldLabel>Curvature</FieldLabel>
                <Input
                    type="number"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={edge.curvature}
                    onChange={(e) => handleChange({ curvature: Number(e.target.value) })}
                />
                <Slider
                    min={-1}
                    max={1}
                    step={0.01}
                    value={[edge.curvature]}
                    onValueChange={(v) => handleChange({ curvature: Number(v) })}
                />
            </Field>

            <Field>
                <FieldLabel>Tags</FieldLabel>
                <ToggleTagsView targetIds={[edgeId]} />
            </Field>
        </FieldSet>
    );
}

export function EditEdgeFormView({ edgeId }: { edgeId: string }) {
    const { edge, handleCancel, handleDelete } = useEdgeForm(edgeId);
    if (!edge) {
        return null;
    }

    return (
        <InspectorFormWrapper onCancel={handleCancel} onDelete={handleDelete} showDelete>
            <EdgeFieldSet edgeId={edgeId} />
        </InspectorFormWrapper>
    );
}
