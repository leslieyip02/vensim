import { useEffect, useState } from "react";

import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { Flow, Node, Stock } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";
import { VALID_OPERATOR_STRING } from "@/utils/constants";
import {
    buildLabelToIdMap,
    removeInvalidCharacters,
    replaceEquationIdsWithLabels,
    replaceEquationLabelsWithIds,
    validateEquation,
} from "@/utils/equation";

interface HandleEquationBlurParams {
    draftEquation: string;
    labelMap: Record<string, string>;
    state: {
        nodes: Record<string, Node>;
        stocks: Record<string, Stock>;
        flows: Record<string, Flow>;
    };
    handleChange: (patch: Partial<Node>) => void;
    setEquationError: (error: boolean) => void;
}

function handleEquationBlur({
    draftEquation,
    labelMap,
    state,
    handleChange,
    setEquationError,
}: HandleEquationBlurParams) {
    const equationWithIds = replaceEquationLabelsWithIds(draftEquation, labelMap);

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
}

export function EquationFieldSet({
    entity,
    handleChange,
    parents,
}: {
    entity: Node | Stock | Flow;
    handleChange: (patch: Partial<Node>) => void;
    parents: Array<Node | Stock | Flow>;
}) {
    const state = useGraphStore.getState();
    const committedLabelEquation = replaceEquationIdsWithLabels(
        entity.equation,
        state.nodes,
        state.stocks,
        state.flows,
    );
    const [draftEquation, setDraftEquation] = useState(committedLabelEquation);
    const [equationError, setEquationError] = useState(false);
    const labelMap = buildLabelToIdMap(parents);

    useEffect(() => {
        setDraftEquation(committedLabelEquation);
    }, [committedLabelEquation]);

    useEffect(() => {
        const isValid = validateEquation(entity.equation, state.nodes, state.flows, state.stocks);

        setEquationError(!isValid);
    }, [entity.equation, state.nodes, state.flows, state.stocks]);

    if (!entity) {
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
                        handleEquationBlur({
                            draftEquation,
                            labelMap,
                            state,
                            handleChange,
                            setEquationError,
                        });
                    }}
                />
                {equationError && (
                    <p className="text-sm text-red-600 mt-1">
                        Equation can only contain numbers, operators ({VALID_OPERATOR_STRING}) and
                        valid node, stock or flow labels.
                    </p>
                )}
            </Field>
        </FieldSet>
    );
}
