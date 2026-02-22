import type Konva from "konva";
import { type RefObject, useEffect } from "react";

import { useCursorStore } from "@/stores/cursor";
import { getClientId, getUsername } from "@/sync/id";

export function useCursorController(stageRef: RefObject<Konva.Stage | null>) {
    const { addCursor, updateCursor } = useCursorStore();

    useEffect(() => {
        const clientId = getClientId();
        const username = getUsername();
        addCursor(clientId, 0, 0, username);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
        const handleMouseMove = (_: MouseEvent) => {
            const stage = stageRef.current!;
            const position = stage.getPointerPosition()!;
            const scale = stage.scaleX();
            const x = (position.x - stage.x()) / scale;
            const y = (position.y - stage.y()) / scale;
            updateCursor(clientId, x, y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [addCursor, updateCursor, stageRef]);
}
