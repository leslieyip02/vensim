import { useRef } from "react";
import { LuCircleHelp } from "react-icons/lu";

import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
                    <FieldLabel>
                        Equation
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <LuCircleHelp />
                            </TooltipTrigger>
                            <TooltipContent className="flex flex-col gap-2">
                                <div className="space-y-1">
                                    <code className="font-semibold">
                                        IF(cond, trueValue, falseValue)
                                    </code>
                                    <p className="text-sm text-muted-foreground">
                                        Returns <code className="text-gray-400">trueValue</code> if{" "}
                                        <code className="text-gray-400">cond</code> is true,
                                        otherwise <code className="text-gray-400">falseValue</code>.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <code className="font-semibold">STEP(value, targetTime)</code>
                                    <p className="text-sm text-muted-foreground">
                                        Returns <code className="text-gray-400">value</code> when{" "}
                                        <code className="text-gray-400">targetTime</code> ≥ current
                                        time, otherwise 0.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <code className="font-semibold">
                                        LOOKUP(target, x1, ..., xn, y1, ..., yn)
                                    </code>
                                    <p className="text-sm text-muted-foreground">
                                        Performs piecewise linear interpolation for{" "}
                                        <code className="text-gray-400">target</code>.
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </FieldLabel>
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
