import { type RefObject, useEffect, useMemo, useState } from "react";

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
    const [equationError, setEquationError] = useState<string | null>(null);

    // handleEquationBlur params
    const parents = getParentEntities(entity.id);
    const labelMap = buildLabelToIdMap(parents);
    const equationWithIds = useMemo(() => {
        if (!draftEquation) return "";
        return replaceEquationLabelsWithIds(draftEquation, labelMap);
    }, [draftEquation, labelMap]);

    const badges = useMemo(() => {
        if (!parents || parents.length === 0) return [];

        return parents.map((parent) => ({
            id: parent.id,
            label: parent.label ?? "",
            included: equationWithIds.includes(parent.id),
        }));
    }, [equationWithIds, parents]);

    // Update equations and errors of other room members
    // Sync committed equation to draft
    useEffect(() => {
        const committedLabelEquation = replaceEquationIdsWithLabels(
            entity.equation,
            state.nodes,
            state.stocks,
            state.flows,
        );
        setDraftEquation(committedLabelEquation);
    }, [entity.equation, state.nodes, state.flows, state.stocks]);

    // Validate equation when draft changes
    useEffect(() => {
        if (!draftEquation) {
            setEquationError(null);
            return;
        }

        // Bug where error flashes when concurrent user edits label for parent node
        const timer = setTimeout(() => {
            const result = validateEquation(
                equationWithIds,
                state.nodes,
                state.flows,
                state.stocks,
            );
            setEquationError(result.isValid ? null : (result.error ?? "Invalid equation."));
        }, 0);

        return () => clearTimeout(timer);
    }, [draftEquation, equationWithIds, labelMap, state.nodes, state.flows, state.stocks]);

    // Handlers
    const handleEquationFieldBlur = () => {
        if (equationError) return;
        const equationWithIds = replaceEquationLabelsWithIds(draftEquation, labelMap);
        handleChange({ equation: removeWhitespaces(equationWithIds) });
    };

    const handleBadgeClick = (
        label: string,
        textareaRef: RefObject<HTMLTextAreaElement | null>,
    ) => {
        const textArea = textareaRef.current;
        if (!textArea) return;
        textArea.focus();

        const start = textArea.selectionStart ?? 0;
        const end = textArea.selectionEnd ?? 0;

        setDraftEquation((prev) => {
            const value = prev ?? "";

            const charBefore = value[start - 1];
            const charAfter = value[end];
            const spaceBefore = start > 0 && charBefore && charBefore !== " " ? " " : "";
            const spaceAfter = charAfter && charAfter !== " " ? " " : "";
            const before = value.slice(0, start);
            const after = value.slice(end);

            // Cursor position restored after React updates state
            setTimeout(() => {
                const newPos = start + (spaceBefore ? 1 : 0) + label.length;
                textArea.selectionStart = textArea.selectionEnd = newPos;
            }, 0);

            return before + spaceBefore + label + spaceAfter + after;
        });
    };

    return {
        draftEquation,
        equationError,
        handleEquationFieldBlur,
        handleChangeDraftEquation: setDraftEquation,
        handleBadgeClick,
        badges,
    };
}
