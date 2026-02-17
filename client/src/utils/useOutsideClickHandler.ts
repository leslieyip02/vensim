import { type RefObject, useEffect } from "react";

export function useOutsideClickHandler(
    textRef: RefObject<HTMLElement | null>,
    badgeRefs: RefObject<(HTMLSpanElement | null)[]>,
    handler: () => void,
) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            const el = textRef.current;
            if (!el || el.contains(event.target as Node)) return;
            for (const badge of badgeRefs.current) {
                if (badge?.contains(event.target as Node)) {
                    return;
                }
            }
            handler();
        };
        window.addEventListener("mousedown", listener, true);
        return () => {
            window.removeEventListener("mousedown", listener, true);
        };
    }, [textRef, badgeRefs, handler]);
}
