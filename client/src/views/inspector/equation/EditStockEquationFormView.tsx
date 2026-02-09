import { getParentEntities } from "@/actions/graphTraversal";
import { Badge } from "@/components/ui/badge";
import { useStockForm } from "@/controllers/form";

import { EquationFieldSet } from "./EquationFieldSet";
import { EquationFormWrapper } from "./EquationFormWrapper";

export function EditStockEquationFormView({ stockId }: { stockId: string }) {
    const { stock, handleCancel, handleChange } = useStockForm(stockId);
    if (!stock) {
        return null;
    }

    const parents = getParentEntities(stock.id);

    return (
        <EquationFormWrapper
            label="Edit Equation"
            onCancel={handleCancel}
            onDelete={() => handleChange({ equation: "" })}
            showDelete
        >
            <EquationFieldSet entity={stock} handleChange={handleChange} parents={parents} />
            {parents.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {parents?.map((parent) => {
                        if (!parent || !parent.label) return null;
                        const onClick = () =>
                            handleChange({
                                equation: `${stock.equation.trim()} ${parent.id}`,
                            });
                        return (
                            <Badge
                                key={parent.id}
                                className="h-9 px-3 flex items-center cursor-pointer rounded-md bg-gray-600 hover:bg-gray-300 transition-colors"
                                onClick={onClick}
                            >
                                {parent.label}
                            </Badge>
                        );
                    })}
                </div>
            )}
        </EquationFormWrapper>
    );
}
