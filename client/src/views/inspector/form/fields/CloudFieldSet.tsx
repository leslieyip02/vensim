import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useCloudForm } from "@/controllers/form";

import { ToggleTagsView } from "../../tag/ToggleTagsView";

export function CloudFieldSet({ cloudId }: { cloudId: string }) {
    const { cloud, handleChange } = useCloudForm(cloudId);
    if (!cloud) {
        return null;
    }

    return (
        <FieldSet>
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
                <ToggleTagsView targetIds={[cloudId]} />
            </Field>
        </FieldSet>
    );
}
