import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useStockForm } from "@/controllers/form";

import { ToggleTagsView } from "../tag/ToggleTagsView";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

function StockFieldSet({ stockId }: { stockId: string }) {
    const { stock, handleChange } = useStockForm(stockId);
    if (!stock) {
        return null;
    }

    return (
        <FieldSet>
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
                <ToggleTagsView targetIds={[stockId]} />
            </Field>
        </FieldSet>
    );
}

export function EditStockFormView({ stockId }: { stockId: string }) {
    const { stock, handleCancel, handleDelete } = useStockForm(stockId);
    if (!stock) {
        return null;
    }

    return (
        <InspectorFormWrapper onCancel={handleCancel} onDelete={handleDelete} showDelete>
            <StockFieldSet stockId={stockId} />
        </InspectorFormWrapper>
    );
}
