import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
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
import { LuTrash2 } from "react-icons/lu";

export function EditEdgeFormView({ edgeId }: { edgeId: string }) {
    const { edge, handleChange, handleCancel, handleDelete } = useEdgeForm(edgeId);
    if (!edge) {
        return null;
    }

    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>Edit Edge</FieldLegend>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Polarity</FieldLabel>
                        <Select
                            value={edge.polarity}
                            onValueChange={(v) => handleChange({ polarity: v as Polarity })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-100">
                                <SelectItem value="+">+</SelectItem>
                                <SelectItem value="-">-</SelectItem>
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
