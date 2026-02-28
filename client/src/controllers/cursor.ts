import type Konva from "konva";
import { type RefObject, useEffect } from "react";

import { updateCursor } from "@/actions/cursor";

export function useCursorController(stageRef: RefObject<Konva.Stage | null>) {
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
        const handleMouseMove = (_: MouseEvent) => {
            const stage = stageRef.current!;
            const position = stage.getPointerPosition();
            if (!position) {
                return;
            }

            updateCursor(
                (position.x - stage.x()) / stage.scaleX(),
                (position.y - stage.y()) / stage.scaleY(),
            );
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [stageRef]);
}
