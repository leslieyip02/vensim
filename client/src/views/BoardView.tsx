import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { Layer, Stage } from "react-konva";

import { useGraphStore } from "../stores/graph";
import { EdgeView } from "./graph/EdgeView";
import { NodeView } from "./graph/NodeView";
import { GridView } from "./GridView";
import { useInteractionStore } from "@/stores/interaction";
import { mouseToWorldSpace, snapToGrid, type Camera } from "@/models/geometry";

export function BoardView() {
    const [camera, setCamera] = useState<Camera>({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        zoom: 1,
    });

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

    const nodeIds = Object.keys(useGraphStore((s) => s.nodes));
    const edgeIds = Object.keys(useGraphStore((s) => s.edges));

    const { interactionMode, clearSelectedIds } = useInteractionStore((s) => s);
    const addNodeToGraph = useGraphStore((s) => s.addNode);

    const stageRef = useRef<Konva.Stage>(null);
    const isPanning = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);

    const beginPan = () => {
        isPanning.current = true;
        lastPos.current = stageRef.current!.getPointerPosition();
    };

    const handlePan = () => {
        if (!isPanning.current || !lastPos.current) {
            return;
        }

        const pos = stageRef.current!.getPointerPosition()!;
        const dx = pos.x - lastPos.current.x;
        const dy = pos.y - lastPos.current.y;

        setCamera((c) => ({
            ...c,
            x: c.x + dx,
            y: c.y + dy,
        }));

        lastPos.current = pos;
    };

    const stopPan = () => {
        isPanning.current = false;
        lastPos.current = null;
    };

    return (
        <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            scaleX={camera.zoom}
            scaleY={camera.zoom}
            x={camera.x}
            y={camera.y}
            onWheel={handleWheel}
            onMouseDown={(e) => {
                if (e.target !== e.target.getStage()) {
                    return;
                }

                if (interactionMode === "add-node") {
                    const position = snapToGrid(mouseToWorldSpace(e.evt, camera));
                    addNodeToGraph(position.x, position.y);
                    return;
                }

                clearSelectedIds();
                beginPan();
            }}
            onMouseMove={handlePan}
            onMouseUp={stopPan}
            onMouseLeave={stopPan}
        >
            <Layer>
                <GridView />

                {nodeIds.map((nodeId) => (
                    <NodeView key={nodeId} nodeId={nodeId} />
                ))}
                {edgeIds.map((edgeId) => (
                    <EdgeView key={edgeId} edgeId={edgeId} />
                ))}
            </Layer>
        </Stage>
    );
}
