import { type RefObject, useEffect } from "react";

import type { HandleEquationBlurParams } from "@/views/inspector/equation/EquationFieldSet";

export function useOutsideClickHandler(
    textRef: RefObject<HTMLElement | null>,
    badgeRefs: (HTMLSpanElement | null)[],
    handler: (params: HandleEquationBlurParams) => void,
    handlerParams: HandleEquationBlurParams,
) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            const el = textRef.current;
            if (!el || el.contains(event.target as Node)) return;
            for (const badge of badgeRefs) {
                if (badge?.contains(event.target as Node)) {
                    return;
                }
            }
            handler(handlerParams);
        };
        window.addEventListener("mousedown", listener, true);
        return () => {
            window.removeEventListener("mousedown", listener, true);
        };
    }, [textRef, badgeRefs, handler, handlerParams]);
}
