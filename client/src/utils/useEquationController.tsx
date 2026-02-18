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

    // Displayed equation and equation error
    const committedLabelEquation = replaceEquationIdsWithLabels(
        entity.equation,
        state.nodes,
        state.stocks,
        state.flows,
    );

    const [draftEquation, setDraftEquation] = useState(committedLabelEquation);
    const [equationError, setEquationError] = useState(
        !validateEquation(committedLabelEquation, state.nodes, state.flows),
    );

    useEffect(() => {
        setDraftEquation(committedLabelEquation);
    }, [committedLabelEquation]);

    // handleEquationBlur params
    const parents = getParentEntities(entity.id);
    const labelMap = buildLabelToIdMap(parents);

    // Handlers
    const handleEquationFieldBlur = () => {
        const equationWithIds = replaceEquationLabelsWithIds(draftEquation, labelMap);
        const isValid = validateEquation(equationWithIds, state.nodes, state.flows);

        setEquationError(!isValid);
        if (!isValid) return;

        handleChange({ equation: removeWhitespaces(equationWithIds) });
    };

    const handleChangeDraftEquation = (value: string) => {
        setDraftEquation(value);
        setEquationError(!validateEquation(value, state.nodes, state.flows));
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
