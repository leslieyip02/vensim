import { useRef } from "react";

import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { Flow, Node } from "@/models/graph";
import { useEquationController } from "@/utils/useEquationController";
import { useOutsideClickHandler } from "@/utils/useOutsideClickHandler";
import { EquationBadges } from "@/views/inspector/equation/EquationBadges";

export function EquationFieldSet({
    entity,
    handleChange,
}: {
    entity: Node | Flow;
    handleChange: (patch: Partial<Node>) => void;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const badgeRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const {
        draftEquation,
        equationError,
        handleEquationFieldBlur,
        handleChangeDraftEquation,
        handleBadgeClick,
        badges,
    } = useEquationController(entity, handleChange);

    useOutsideClickHandler(textareaRef, badgeRefs, handleEquationFieldBlur);

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
                        onChange={(e) => handleChangeDraftEquation(e.target.value)}
                        onBlur={handleEquationFieldBlur}
                        ref={textareaRef}
                    />
                    {equationError && <p className="text-sm text-red-600 mt-1">{equationError}</p>}
                </Field>
            </FieldSet>
            <EquationBadges
                badges={badges}
                badgeRefs={badgeRefs}
                onClick={handleBadgeClick}
                textAreaRef={textareaRef}
            />
        </>
    );
}
