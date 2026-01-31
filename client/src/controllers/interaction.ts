import type { KonvaEventObject } from "konva/lib/Node";

import {
    addCloud,
    addEdge,
    addFlow,
    addNode,
    addStock,
    updateCloud,
    updateNode,
    updateStock,
} from "@/actions/graph";
import { SELECTED_STROKE_COLOR, UNSELECTED_STROKE_COLOR } from "@/configs/color";
import { mouseToWorldSpace, snapToGrid } from "@/models/geometry";
import { isCloudId, isNodeId, isStockId } from "@/models/graph";
import { useInteractionStore } from "@/stores/interaction";
import { useTagStore } from "@/stores/tag";

import type { Camera } from "./camera";

export function useInteractionController(camera: Camera) {
    const { interactionMode, clearSelectedIds } = useInteractionStore((s) => s);

    function handleStageMouseDown(e: KonvaEventObject<MouseEvent>) {
        if (e.target !== e.target.getStage()) {
            return;
        }

        if (interactionMode === "add-node") {
            const position = snapToGrid(mouseToWorldSpace(e.evt, camera));
            addNode(position.x, position.y);
            clearSelectedIds();
            return "handled";
        }

        if (interactionMode === "add-stock") {
            const position = snapToGrid(mouseToWorldSpace(e.evt, camera));
            addStock(position.x, position.y);
            clearSelectedIds();
            return "handled";
        }

        if (interactionMode === "add-cloud") {
            const position = snapToGrid(mouseToWorldSpace(e.evt, camera));
            addCloud(position.x, position.y);
            clearSelectedIds();
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

            if (
                selectedIds.length !== 1 ||
                (!selectedIds.every(isNodeId) && !selectedIds.every(isStockId))
            ) {
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
    const { interactionMode, selectedIds, selectedTags, toggleSelectId, clearSelectedIds } =
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
        onClick: () => {
            toggleSelectId(stockId);

            if (interactionMode !== "add-flow") {
                return;
            }

            if (
                selectedIds.length !== 1 ||
                (!selectedIds.every(isCloudId) && !selectedIds.every(isStockId))
            ) {
                return;
            }

            const from = selectedIds[0];
            addFlow(from, stockId);
            clearSelectedIds();
        },
        onDragEnd: (e: KonvaEventObject<DragEvent, never>) => {
            const position = snapToGrid({ x: e.target.x(), y: e.target.y() });
            e.target.position(position);

            updateStock(stockId, {
                ...position,
            });
        },
    };
}

export function useCloudInteractions(cloudId: string) {
    const { tags, isTagged } = useTagStore((s) => s);
    const { interactionMode, selectedIds, selectedTags, toggleSelectId, clearSelectedIds } =
        useInteractionStore((s) => s);

    const isSelected = selectedIds.includes(cloudId);
    const activeTagId = selectedTags.find((tagId) => isTagged(tagId, cloudId));
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
            toggleSelectId(cloudId);

            if (interactionMode !== "add-flow") {
                return;
            }

            if (
                selectedIds.length !== 1 ||
                (!selectedIds.every(isStockId) && !selectedIds.every(isCloudId))
            ) {
                return;
            }

            const from = selectedIds[0];
            addFlow(from, cloudId);
            clearSelectedIds();
        },
        onDragEnd: (e: KonvaEventObject<DragEvent, never>) => {
            const position = snapToGrid({ x: e.target.x(), y: e.target.y() });
            e.target.position(position);

            updateCloud(cloudId, {
                ...position,
            });
        },
    };
}

export function useFlowInteractions(flowId: string) {
    const { tags, isTagged } = useTagStore((s) => s);
    const { interactionMode, selectedIds, selectedTags, toggleSelectId, clearSelectedIds } =
        useInteractionStore((s) => s);

    const isSelected = selectedIds.includes(flowId);
    const activeTagId = selectedTags.find((tagId) => isTagged(tagId, flowId));
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
            toggleSelectId(flowId);

            if (interactionMode !== "add-edge") {
                return;
            }

            if (
                selectedIds.length !== 1 ||
                (!selectedIds.every(isNodeId) && !selectedIds.every(isStockId))
            ) {
                return;
            }

            const from = selectedIds[0];
            addEdge(from, flowId);
            clearSelectedIds();
        },
    };
}
