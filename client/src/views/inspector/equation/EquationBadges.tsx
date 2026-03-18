import type { RefObject } from "react";

import { Badge } from "@/components/ui/badge";

export function EquationBadges({
    badges,
    badgeRefs,
    onClick,
    textAreaRef,
}: {
    badges: { id: string; label: string; included: boolean }[];
    badgeRefs: RefObject<(HTMLSpanElement | null)[]>;
    onClick: (label: string, textAreaRef: RefObject<HTMLTextAreaElement | null>) => void;
    textAreaRef: RefObject<HTMLTextAreaElement | null>;
}) {
    if (!badges || badges.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {badges?.map((badge, index) => {
                if (!badge || !badge.label) return null;
                return (
                    <Badge
                        key={badge.id}
                        ref={(el) => {
                            badgeRefs.current[index] = el;
                        }}
                        className={`h-9 px-3 flex items-center cursor-pointer rounded-md transition-colors
                            ${
                                badge.included
                                    ? "bg-gray-600 hover:bg-gray-300"
                                    : "bg-red-200 hover:bg-red-300 text-red-800"
                            }`}
                        onClick={() => onClick(badge.label, textAreaRef)}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {badge.label}
                    </Badge>
                );
            })}
        </div>
    );
}
