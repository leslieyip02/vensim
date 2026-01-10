import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";

export interface Camera {
    x: number;
    y: number;
    zoom: number;
}

export function useCameraController(initial: Camera) {
    const [camera, setCamera] = useState<Camera>(initial);

    const stageRef = useRef<Konva.Stage>(null);
    const isPanning = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);

    function handleWheel(e: KonvaEventObject<WheelEvent>) {
        e.evt.preventDefault();

        const scaleBy = 1.05;
        const stage = e.target.getStage()!;
        const oldScale = stage.scaleX();

        const pointer = stage.getPointerPosition()!;
        const mousePoint = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        setCamera({
            zoom: newScale,
            x: pointer.x - mousePoint.x * newScale,
            y: pointer.y - mousePoint.y * newScale,
        });
    }

    function beginPan() {
        isPanning.current = true;
        lastPos.current = stageRef.current!.getPointerPosition();
    }

    function handlePan() {
        if (!isPanning.current || !lastPos.current) return;

        const pos = stageRef.current!.getPointerPosition()!;
        const dx = pos.x - lastPos.current.x;
        const dy = pos.y - lastPos.current.y;

        setCamera((c) => ({
            ...c,
            x: c.x + dx,
            y: c.y + dy,
        }));

        lastPos.current = pos;
    }

    function stopPan() {
        isPanning.current = false;
        lastPos.current = null;
    }

    return {
        camera,
        stageRef,
        handleWheel,
        beginPan,
        handlePan,
        stopPan,
    };
}
