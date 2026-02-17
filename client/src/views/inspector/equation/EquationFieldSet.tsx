import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useOutsideClickHandler } from "@/controllers/clickOutside";
import type { Flow, Node, Stock } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";
import { VALID_OPERATOR_STRING } from "@/utils/constants";
import {
    buildLabelToIdMap,
    removeWhitespaces,
    replaceEquationIdsWithLabels,
    replaceEquationLabelsWithIds,
    validateEquation,
} from "@/utils/equation";
import { getParentEntities } from "@/utils/graphTraversal";

export interface HandleEquationBlurParams {
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

    const isValidEquation = validateEquation(equationWithIds, state.nodes, state.flows);
    if (!isValidEquation) {
        setEquationError(true);
        return;
    }
    setEquationError(false);

    const cleanedEquation = removeWhitespaces(equationWithIds);
    handleChange({ equation: cleanedEquation });
}

export function EquationFieldSet({
    entity,
    handleChange,
}: {
    entity: Node | Flow;
    handleChange: (patch: Partial<Node>) => void;
}) {
    // Draft equation
    const state = useGraphStore.getState();
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

    // handleEquationBlur params
    const parents = getParentEntities(entity.id);
    const parentLabels = parents
        ?.filter((parent) => parent.label && parent.label.trim() != "")
        .map((parent) => parent.label);
    const labelMap = buildLabelToIdMap(parents);

    // Badge onclick handler
    const handleBadgeClick = (label: string) => {
        const textarea = document.querySelector(
            'textarea[name="equation"]',
        ) as HTMLTextAreaElement | null;
        textarea?.focus();
        setDraftEquation(
            draftEquation && draftEquation.trim() !== "" ? `${draftEquation} ${label}` : label,
        );
    };

    // Mousedown listener
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const badgeRefs = useRef<(HTMLSpanElement | null)[]>([]);
    useOutsideClickHandler(textareaRef, badgeRefs.current, handleEquationBlur, {
        draftEquation,
        labelMap,
        state,
        handleChange,
        setEquationError,
    });

    return (
        <>
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
                            setEquationError(
                                !validateEquation(e.target.value, state.nodes, state.flows),
                            );
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
                        ref={textareaRef}
                    />
                    {equationError && (
                        <p className="text-sm text-red-600 mt-1">
                            Equation can only contain numbers, operators ({VALID_OPERATOR_STRING})
                            and valid node, stock or flow labels.
                        </p>
                    )}
                </Field>
            </FieldSet>
            {parentLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {parents?.map((parent, index) => {
                        if (!parent || !parent.label) return null;
                        const onClick = () => {
                            handleBadgeClick(parent.label);
                        };
                        return (
                            <Badge
                                key={parent.id}
                                ref={(el) => {
                                    badgeRefs.current[index] = el;
                                }}
                                className="h-9 px-3 flex items-center cursor-pointer rounded-md bg-gray-600 hover:bg-gray-300 transition-colors"
                                onClick={onClick}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {parent.label}
                            </Badge>
                        );
                    })}
                </div>
            )}
        </>
    );
}
