import { Layer, Stage } from "react-konva";

import { useGraphStore } from "../stores/graph";
import { EdgeView } from "./graph/EdgeView";
import { NodeView } from "./graph/NodeView";
import { StockView } from "./graph/StockView";
import { GridView } from "./GridView";
import { useCameraController } from "@/controllers/camera";
import { useInteractionController as useInteractionController } from "@/controllers/interaction";

export function BoardView() {
    const nodeIds = Object.keys(useGraphStore((s) => s.nodes));
    const edgeIds = Object.keys(useGraphStore((s) => s.edges));
    const stockIds = Object.keys(useGraphStore((s) => s.stocks));

    const cameraController = useCameraController({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        zoom: 1,
    });

    const interactionController = useInteractionController(cameraController.camera);

    return (
        <Stage
            ref={cameraController.stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            scaleX={cameraController.camera.zoom}
            scaleY={cameraController.camera.zoom}
            x={cameraController.camera.x}
            y={cameraController.camera.y}
            onWheel={cameraController.handleWheel}
            onMouseDown={(e) => {
                const result = interactionController.handleStageMouseDown(e);
                if (result === "pan") {
                    cameraController.beginPan();
                }
            }}
            onMouseMove={cameraController.handlePan}
            onMouseUp={cameraController.stopPan}
            onMouseLeave={cameraController.stopPan}
        >
            <Layer>
                <GridView />
                {nodeIds.map((id) => (
                    <NodeView key={id} nodeId={id} />
                ))}
                {edgeIds.map((id) => (
                    <EdgeView key={id} edgeId={id} />
                ))}
                {stockIds.map((id) => (
                    <StockView key={id} stockId={id} />
                ))}
            </Layer>
        </Stage>
    );
}
