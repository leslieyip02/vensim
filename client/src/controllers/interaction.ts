import type { KonvaEventObject } from "konva/lib/Node";

import { mouseToWorldSpace, snapToGrid } from "@/models/geometry";
import { useInteractionStore } from "@/stores/interaction";

import type { Camera } from "./camera";
import { isNodeId } from "@/models/graph";
import { useTagStore } from "@/stores/tag";
import { SELECTED_STROKE_COLOR, UNSELECTED_STROKE_COLOR } from "@/configs/color";
import { addEdge, addNode, updateNode, addStock, updateStock } from "@/actions/graph";

export function useInteractionController(camera: Camera) {
    const { interactionMode, clearSelectedIds } = useInteractionStore((s) => s);

    function handleStageMouseDown(e: KonvaEventObject<MouseEvent>) {
        if (e.target !== e.target.getStage()) return;

        if (interactionMode === "add-node") {
            const position = snapToGrid(mouseToWorldSpace(e.evt, camera));
            addNode(position.x, position.y);
            return "handled";
        }

        if (interactionMode === "add-stock") {
            const position = snapToGrid(mouseToWorldSpace(e.evt, camera));
            addStock(position.x, position.y);
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
    const { tags, isTagged } = useTagStore((s) => s);
    const { interactionMode, selectedIds, selectedTags, toggleSelectId, clearSelectedIds } =
        useInteractionStore((s) => s);

    const isSelected = selectedIds.includes(nodeId);
    const activeTagId = selectedTags.find((tagId) => isTagged(tagId, nodeId));
    const stroke = activeTagId
        ? tags[activeTagId].color
        : isSelected
          ? SELECTED_STROKE_COLOR
          : UNSELECTED_STROKE_COLOR;

    return {
        isSelected,
        stroke,
        opacity: selectedTags.length === 0 || activeTagId ? 1 : 0.25,
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
    const { tags, isTagged } = useTagStore((s) => s);
    const { selectedIds, selectedTags, toggleSelectId } = useInteractionStore((s) => s);

    const isSelected = selectedIds.includes(edgeId);
    const activeTagId = selectedTags.find((tagId) => isTagged(tagId, edgeId));
    const stroke = activeTagId
        ? tags[activeTagId].color
        : isSelected
          ? SELECTED_STROKE_COLOR
          : UNSELECTED_STROKE_COLOR;

    return {
        isSelected,
        stroke,
        opacity: selectedTags.length === 0 || activeTagId ? 1 : 0.25,
        onClick: () => toggleSelectId(edgeId),
    };
}

export function useStockInteractions(stockId: string) {
    const { tags, isTagged } = useTagStore((s) => s);
    const { selectedIds, selectedTags, toggleSelectId } =
        useInteractionStore((s) => s);

    const isSelected = selectedIds.includes(stockId);
    const activeTagId = selectedTags.find((tagId) => isTagged(tagId, stockId));
    const stroke = activeTagId
        ? tags[activeTagId].color
        : isSelected
          ? SELECTED_STROKE_COLOR
          : UNSELECTED_STROKE_COLOR;

    return {
        isSelected,
        stroke,
        opacity: selectedTags.length === 0 || activeTagId ? 1 : 0.25,
        onClick: () => toggleSelectId(stockId),
        onDragEnd: (e: KonvaEventObject<DragEvent, never>) => {
            const position = snapToGrid({ x: e.target.x(), y: e.target.y() });
            e.target.position(position);

            updateStock(stockId, {
                ...position,
            });
        },
    };
}
