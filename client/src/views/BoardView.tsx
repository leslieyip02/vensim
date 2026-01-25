import type { KonvaEventObject } from "konva/lib/Node";
import { Layer, Stage } from "react-konva";

import { useCameraController } from "@/controllers/camera";
import { useInteractionController as useInteractionController } from "@/controllers/interaction";

import { useGraphStore } from "../stores/graph";
import { CloudView } from "./graph/CloudView";
import { EdgeView } from "./graph/EdgeView";
import { FlowView } from "./graph/FlowView";
import { NodeView } from "./graph/NodeView";
import { StockView } from "./graph/StockView";
import { GridView } from "./GridView";

export function BoardView() {
    const nodes = Object.values(useGraphStore((s) => s.nodes));
    const edges = Object.values(useGraphStore((s) => s.edges));
    const stocks = Object.values(useGraphStore((s) => s.stocks));
    const clouds = Object.values(useGraphStore((s) => s.clouds));
    const flows = Object.values(useGraphStore((s) => s.flows));

    const cameraController = useCameraController({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        zoom: 1,
    });

    const interactionController = useInteractionController(cameraController.camera);

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
                {nodes.map((node) => (
                    <NodeView key={node.id} node={node} />
                ))}
                {edges.map((edge) => (
                    <EdgeView key={edge.id} edge={edge} />
                ))}
                {stocks.map((stock) => (
                    <StockView key={stock.id} stock={stock} />
                ))}
                {clouds.map((cloud) => (
                    <CloudView key={cloud.id} cloud={cloud} />
                ))}
                {flows.map((flow) => (
                    <FlowView key={flow.id} flow={flow} />
                ))}
            </Layer>
        </Stage>
    );
}
