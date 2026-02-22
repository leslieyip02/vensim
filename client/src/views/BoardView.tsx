import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { Layer, Stage } from "react-konva";

import { useCameraController } from "@/controllers/camera";
import { useCursorController } from "@/controllers/cursor";
import { useInteractionController as useInteractionController } from "@/controllers/interaction";
import { useKeyboardShortcuts } from "@/controllers/keyboard";

import { CursorView } from "./cursor/CursorView";
import { GraphView } from "./graph/GraphView";
import { GridView } from "./GridView";

export function BoardView() {
    const stageRef = useRef<Konva.Stage>(null);

    const cameraController = useCameraController(stageRef, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        zoom: 1,
    });
    const interactionController = useInteractionController(cameraController.camera);

    useKeyboardShortcuts();
    useCursorController(stageRef);

    const stageProps = {
        ref: stageRef,
        width: window.innerWidth,
        height: window.innerHeight,
        scaleX: cameraController.camera.zoom,
        scaleY: cameraController.camera.zoom,
        x: cameraController.camera.x,
        y: cameraController.camera.y,
        onWheel: cameraController.handleWheel,
        onMouseDown: (e: KonvaEventObject<MouseEvent>) => {
            const result = interactionController.handleStageMouseDown(e);
            if (result === "pan") {
                cameraController.beginPan();
            }
        },
        onMouseMove: cameraController.handlePan,
        onMouseUp: cameraController.stopPan,
        onMouseLeave: cameraController.stopPan,
    };

    return (
        <Stage {...stageProps} style={{ cursor: "none" }}>
            <Layer>
                <GridView />
                <GraphView />
                <CursorView />
            </Layer>
        </Stage>
    );
}
