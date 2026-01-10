import type { KonvaEventObject } from "konva/lib/Node";

import { mouseToWorldSpace, snapToGrid } from "@/models/geometry";
import { useGraphStore } from "@/stores/graph";
import { useInteractionStore } from "@/stores/interaction";

import type { Camera } from "./camera";
import { isNodeId } from "@/models/graph";

export function useInteractionController(camera: Camera) {
    const addNode = useGraphStore((s) => s.addNode);
    const { interactionMode, clearSelectedIds } = useInteractionStore((s) => s);

    function handleStageMouseDown(e: KonvaEventObject<MouseEvent>) {
        if (e.target !== e.target.getStage()) return;

        if (interactionMode === "add-node") {
            const position = snapToGrid(mouseToWorldSpace(e.evt, camera));
            addNode(position.x, position.y);
            return "handled";
        }

        clearSelectedIds();
        return "pan";
    }

    return {
        handleStageMouseDown,
    };
}

export function useNodeInteractions(nodeId: string) {
    const { addEdge, updateNode } = useGraphStore((s) => s);
    const { selectedIds, selectId, clearSelectedIds, interactionMode } = useInteractionStore(
        (s) => s,
    );

    return {
        isSelected: selectedIds.includes(nodeId),
        onClick: () => {
            selectId(nodeId);

            if (interactionMode !== "add-edge") {
                return;
            }

            if (selectedIds.length !== 1 || !selectedIds.every(isNodeId)) {
                return;
            }

            const from = selectedIds[0];
            addEdge(from, nodeId);
            clearSelectedIds();
        },
        onDragEnd: (e: KonvaEventObject<DragEvent, never>) => {
            const position = snapToGrid({ x: e.target.x(), y: e.target.y() });
            e.target.position(position);

            updateNode(nodeId, {
                ...position,
            });
        },
    };
}

export function useEdgeInteractions(edgeId: string) {
    const { selectedIds, selectId } = useInteractionStore((s) => s);

    return {
        isSelected: selectedIds.includes(edgeId),
        onClick: () => selectId(edgeId),
    };
}
