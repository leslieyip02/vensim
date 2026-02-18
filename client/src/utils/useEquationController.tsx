import { type RefObject, useEffect, useState } from "react";

import type { Flow, Node } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";
import {
    buildLabelToIdMap,
    removeWhitespaces,
    replaceEquationIdsWithLabels,
    replaceEquationLabelsWithIds,
    validateEquation,
} from "@/utils/displayEquationHelpers";
import { getParentEntities } from "@/utils/getParentEntities";

export function useEquationController(
    entity: Node | Flow,
    handleChange: (patch: Partial<Node>) => void,
) {
    const state = useGraphStore.getState();

    const [draftEquation, setDraftEquation] = useState("");
    const [equationError, setEquationError] = useState(false);

    // Update equations and errors of other room members
    useEffect(() => {
        const committedLabelEquation = replaceEquationIdsWithLabels(
            entity.equation,
            state.nodes,
            state.stocks,
            state.flows,
        );
        setDraftEquation(committedLabelEquation);

        const isValid = validateEquation(entity.equation, state.nodes, state.flows, state.stocks);
        setEquationError(!isValid);
    }, [entity.equation, state.nodes, state.flows, state.stocks]);

    // handleEquationBlur params
    const parents = getParentEntities(entity.id);
    const labelMap = buildLabelToIdMap(parents);

    // Handlers
    const handleEquationFieldBlur = () => {
        const equationWithIds = replaceEquationLabelsWithIds(draftEquation, labelMap);
        const isValid = validateEquation(equationWithIds, state.nodes, state.flows, state.stocks);

        setEquationError(!isValid);
        if (!isValid) return;

        handleChange({ equation: removeWhitespaces(equationWithIds) });
    };

    const handleChangeDraftEquation = (value: string) => {
        setDraftEquation(value);
        setEquationError(!validateEquation(value, state.nodes, state.flows, state.stocks));
    };

    const handleBadgeClick = (
        label: string,
        textareaRef: RefObject<HTMLTextAreaElement | null>,
    ) => {
        textareaRef.current?.focus();
        setDraftEquation((prev) => (prev?.trim() ? `${prev} ${label}` : label));
    };

    return {
        draftEquation,
        equationError,
        parents,
        handleEquationFieldBlur,
        handleChangeDraftEquation,
        handleBadgeClick,
    };
}
