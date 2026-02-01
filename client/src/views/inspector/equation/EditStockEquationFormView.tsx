import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStockForm } from "@/controllers/form";

import { InspectorFormWrapper } from "../form/InspectorFormWrapper";

function EquationFieldSet({ stockId }: { stockId: string }) {
    const { stock, handleChange } = useStockForm(stockId);
    if (!stock) {
        return null;
    }

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Equation</FieldLabel>
                <Input
                    name="equation"
                    value={stock.equation}
                    onChange={(e) => handleChange({ equation: e.target.value })}
                />
            </Field>
        </FieldSet>
    );
}

export function EditStockEquationFormView({ stockId }: { stockId: string }) {
    const { stock, handleCancel, handleDelete } = useStockForm(stockId);
    if (!stock) {
        return null;
    }

    return (
        <InspectorFormWrapper
            label="Edit Equation"
            onCancel={handleCancel}
            onDelete={handleDelete}
            showDelete
        >
            <EquationFieldSet stockId={stockId} />
        </InspectorFormWrapper>
    );
}
