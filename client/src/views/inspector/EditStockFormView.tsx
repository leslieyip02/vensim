import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useStockForm } from "@/controllers/form";
import { LuTrash2 } from "react-icons/lu";
import { EditTagsView } from "./EditTagsView";

export function EditStockFormView({ stockId }: { stockId: string }) {
    const { stock, handleChange, handleCancel, handleDelete } = useStockForm(stockId);
    if (!stock) {
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
                            value={stock.label}
                            onChange={(e) => handleChange({ label: e.target.value })}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea
                            value={stock.description}
                            onChange={(e) => handleChange({ description: e.target.value })}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Width</FieldLabel>
                        <Input
                            type="number"
                            min={16}
                            max={512}
                            step={1}
                            value={stock.width}
                            onChange={(e) => handleChange({ width: Number(e.target.value) })}
                        />
                        <Slider
                            min={16}
                            max={512}
                            step={1}
                            value={[stock.width]}
                            onValueChange={(v) => handleChange({ width: Number(v) })}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Height</FieldLabel>
                        <Input
                            type="number"
                            min={16}
                            max={512}
                            step={1}
                            value={stock.height}
                            onChange={(e) => handleChange({ height: Number(e.target.value) })}
                        />
                        <Slider
                            min={16}
                            max={512}
                            step={1}
                            value={[stock.height]}
                            onValueChange={(v) => handleChange({ height: Number(v) })}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Tags</FieldLabel>
                        <EditTagsView targetIds={[stockId]} />
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
