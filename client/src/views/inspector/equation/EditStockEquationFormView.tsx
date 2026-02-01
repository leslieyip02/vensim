import { getParentEntities } from "@/actions/graphTraversal";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStockForm } from "@/controllers/form";
import type { Flow, Node, Stock } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";
import {
    buildLabelToIdMap,
    removeInvalidCharacters,
    replaceEquationIdsWithLabels,
    replaceEquationLabelsWithIds,
} from "@/utils/equation";

import { EquationFormWrapper } from "./EquationFormWrapper";

function StockEquationFieldSet({
    stockId,
    parents,
}: {
    stockId: string;
    parents: Array<Node | Stock | Flow>;
}) {
    const { stock, handleChange } = useStockForm(stockId);
    if (!stock) {
        return null;
    }

    const labelMap = buildLabelToIdMap(parents);
    const state = useGraphStore.getState();

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Equation</FieldLabel>
                <Input
                    name="equation"
                    value={replaceEquationIdsWithLabels(
                        stock.equation,
                        state.nodes,
                        state.stocks,
                        state.flows,
                    )}
                    onChange={(e) => {
                        handleChange({
                            equation: replaceEquationLabelsWithIds(e.target.value, labelMap),
                        });
                    }}
                    onBlur={() => {
                        const validEquation = removeInvalidCharacters(stock.equation);

                        handleChange({ equation: validEquation });
                    }}
                />
            </Field>
        </FieldSet>
    );
}

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
            <StockEquationFieldSet stockId={stockId} parents={parents} />
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
