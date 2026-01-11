import type { KonvaEventObject } from "konva/lib/Node";

import { mouseToWorldSpace, snapToGrid } from "@/models/geometry";
import { useGraphStore } from "@/stores/graph";
import { useInteractionStore } from "@/stores/interaction";

import type { Camera } from "./camera";
import { isNodeId } from "@/models/graph";
import { useTagStore } from "@/stores/tag";

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
    const { isTagged } = useTagStore((s) => s);
    const { interactionMode, selectedIds, selectedTags, toggleSelectId, clearSelectedIds } =
        useInteractionStore((s) => s);

    const isNodeTagged = selectedTags.some((tagId) => isTagged(tagId, nodeId));

    return {
        isSelected: selectedIds.includes(nodeId),
        opacity: selectedTags.length === 0 || isNodeTagged ? 1 : 0.25,
        onClick: () => {
            toggleSelectId(nodeId);

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
    const { isTagged } = useTagStore((s) => s);
    const { selectedIds, selectedTags, toggleSelectId } = useInteractionStore((s) => s);

    const isEdgeTagged = selectedTags.some((tagId) => isTagged(tagId, edgeId));

    return {
        isSelected: selectedIds.includes(edgeId),
        opacity: selectedTags.length === 0 || isEdgeTagged ? 1 : 0.25,
        onClick: () => toggleSelectId(edgeId),
    };
}
