import type { RefObject } from "react";

import { Badge } from "@/components/ui/badge";
import type { Flow, Node } from "@/models/graph";

export function EquationBadges({
    parents,
    badgeRefs,
    onClick,
    textAreaRef,
}: {
    parents: (Node | Flow)[];
    badgeRefs: RefObject<(HTMLSpanElement | null)[]>;
    onClick: (label: string, textAreaRef: RefObject<HTMLTextAreaElement | null>) => void;
    textAreaRef: RefObject<HTMLTextAreaElement | null>;
}) {
    const parentLabels = parents
        ?.filter((parent) => parent.label && parent.label.trim() != "")
        .map((parent) => parent.label);
    if (!parentLabels || parentLabels.length < 1) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {parents?.map((parent, index) => {
                if (!parent || !parent.label) return null;
                return (
                    <Badge
                        key={parent.id}
                        ref={(el) => {
                            badgeRefs.current[index] = el;
                        }}
                        className="h-9 px-3 flex items-center cursor-pointer rounded-md bg-gray-600 hover:bg-gray-300 transition-colors"
                        onClick={() => onClick(parent.label, textAreaRef)}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {parent.label}
                    </Badge>
                );
            })}
        </div>
    );
}
