import type { KonvaEventObject } from "konva/lib/Node";
import { Layer, Stage } from "react-konva";

import { useCameraController } from "@/controllers/camera";
import { useInteractionController as useInteractionController } from "@/controllers/interaction";
import { useKeyboardShortcuts } from "@/controllers/keyboard";

import { GraphView } from "./graph/GraphView";
import { GridView } from "./GridView";

export function BoardView() {
    const cameraController = useCameraController({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        zoom: 1,
    });

    const interactionController = useInteractionController(cameraController.camera);
    useKeyboardShortcuts();

    const stageProps = {
        ref: cameraController.stageRef,
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
        <Stage {...stageProps}>
            <Layer>
                <GridView />
                <GraphView />
            </Layer>
        </Stage>
    );
}
