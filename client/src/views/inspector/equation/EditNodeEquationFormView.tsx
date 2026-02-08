import { useEffect, useState } from "react";

import { getParentEntities } from "@/actions/graphTraversal";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useNodeForm } from "@/controllers/form";
import type { Flow, Node, Stock } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";
import {
    buildLabelToIdMap,
    removeInvalidCharacters,
    replaceEquationIdsWithLabels,
    replaceEquationLabelsWithIds,
    validateEquation,
} from "@/utils/equation";

import { EquationFormWrapper } from "./EquationFormWrapper";

function NodeEquationFieldSet({
    nodeId,
    parents,
}: {
    nodeId: string;
    parents: Array<Node | Stock | Flow>;
}) {
    const { node, handleChange } = useNodeForm(nodeId);
    const [equationError, setEquationError] = useState(false);
    const state = useGraphStore.getState();
    const committedLabelEquation = replaceEquationIdsWithLabels(
        node.equation,
        state.nodes,
        state.stocks,
        state.flows,
    );
    const [draftEquation, setDraftEquation] = useState(committedLabelEquation);
    const labelMap = buildLabelToIdMap(parents);

    useEffect(() => {
        setDraftEquation(committedLabelEquation);
    }, [committedLabelEquation]);

    useEffect(() => {
        const isValid = validateEquation(node.equation, state.nodes, state.flows, state.stocks);

        setEquationError(!isValid);
    }, [node.equation, state.nodes, state.flows, state.stocks]);

    if (!node) {
        return null;
    }

    return (
        <FieldSet>
            <Field>
                <FieldLabel>Equation</FieldLabel>
                <Textarea
                    name="equation"
                    className={`
                        ${equationError ? "border-red-500 ring-2 ring-red-500" : ""}
                    `}
                    value={draftEquation}
                    onChange={(e) => {
                        setDraftEquation(e.target.value);
                    }}
                    onBlur={() => {
                        const equationWithIds = replaceEquationLabelsWithIds(
                            draftEquation,
                            labelMap,
                        );
                        const isValidEquation = validateEquation(
                            equationWithIds,
                            state.nodes,
                            state.flows,
                            state.stocks,
                        );
                        if (!isValidEquation) {
                            setEquationError(true);
                            return;
                        }
                        setEquationError(false);
                        const cleanedEquation = removeInvalidCharacters(
                            equationWithIds,
                            state.nodes,
                            state.flows,
                            state.stocks,
                        );
                        handleChange({ equation: cleanedEquation });
                    }}
                />
            </Field>
        </FieldSet>
    );
}

export function EditNodeEquationFormView({ nodeId }: { nodeId: string }) {
    const { node, handleCancel, handleChange } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    const parents = getParentEntities(node.id);
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
            <NodeEquationFieldSet nodeId={nodeId} parents={parents} />
            {parentLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {parents?.map((parent) => {
                        if (!parent || !parent.label) return null;
                        const onClick = () =>
                            handleChange({
                                equation: `${node.equation.trim()} ${parent.id}`,
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
