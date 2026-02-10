import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStockForm } from "@/controllers/form";
import type { Stock } from "@/models/graph";
import { VALID_NUMBER } from "@/utils/constants";
import { getParentEntities } from "@/utils/graphTraversal";

import { EquationFieldSet } from "./EquationFieldSet";
import { EquationFormWrapper } from "./EquationFormWrapper";

interface handleValueBlurParams {
    draftInitialValue: string;
    handleChange: (patch: Partial<Stock>) => void;
    setInitialValueError: (error: boolean) => void;
}

function handleValueBlur({
    draftInitialValue,
    handleChange,
    setInitialValueError,
}: handleValueBlurParams) {
    if (new RegExp(`^${VALID_NUMBER}$`).test(draftInitialValue)) {
        setInitialValueError(false);
        handleChange({
            initialValue: Number(draftInitialValue),
        });
    } else {
        setInitialValueError(true);
    }
}

export function EditStockEquationFormView({ stockId }: { stockId: string }) {
    const { stock, handleCancel, handleChange } = useStockForm(stockId);
    const [initialValueError, setInitialValueError] = useState(false);
    const [draftInitialValue, setDraftInitialValue] = useState("");

    if (!stock) {
        return null;
    }

    const parents = getParentEntities(stock.id);
    const parentLabels = parents
        ?.filter((parent) => parent.label && parent.label.trim() != "")
        .map((parent) => parent.label);

    return (
        <EquationFormWrapper
            label="Edit Equation"
            onCancel={handleCancel}
            onDelete={() => handleChange({ equation: "" })}
            showDelete
        >
            <EquationFieldSet entity={stock} handleChange={handleChange} parents={parents} />
            {parentLabels.length > 0 && (
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
            <Field>
                <FieldLabel>Initial value</FieldLabel>
                <Input
                    name="initial value"
                    className={`
                        ${initialValueError ? "border-red-500 ring-2 ring-red-500" : ""}
                    `}
                    value={draftInitialValue}
                    onChange={(e) => {
                        setDraftInitialValue(e.target.value);
                    }}
                    onBlur={() => {
                        handleValueBlur({ draftInitialValue, handleChange, setInitialValueError });
                    }}
                />
                {initialValueError && (
                    <p className="text-sm text-red-600 mt-1">
                        Initial value can only contain numbers
                    </p>
                )}
            </Field>
        </EquationFormWrapper>
    );
}
