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
import { getNameColor, UNSELECTED_STROKE_COLOR } from "@/configs/color";
import { mouseToWorldSpace, snapToGrid } from "@/models/geometry";
import { ID_SEPARATOR, isCloudId, isNodeId, isStockId, type Selectable } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";
import { useInteractionStore } from "@/stores/interaction";
import { useTagStore } from "@/stores/tag";
import { getUsername } from "@/sync/id";

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

function useBaseInteractions(id: string) {
    const { tags, isTagged } = useTagStore((s) => s);
    const { selectedTags, toggleSelectId, clearSelectedIds } = useInteractionStore((s) => s);

    const entityType = id.split(ID_SEPARATOR)[0];
    const records = useGraphStore.getState().getRecords(entityType);
    const entity = records[id] as Selectable;

    const isSelectedByUser = entity.selectedBy === getUsername();
    const isSelectedByOther = !isSelectedByUser && !!entity.selectedBy;

    const activeTagId = selectedTags.find((tagId) => isTagged(tagId, id));

    let stroke = activeTagId ? tags[activeTagId].color : UNSELECTED_STROKE_COLOR;
    if (entity.selectedBy) {
        stroke = getNameColor(entity.selectedBy);
    }

    const opacity = selectedTags.length === 0 || activeTagId ? 1 : 0.25;

    return {
        isSelectedByUser,
        isSelectedByOther,
        stroke,
        opacity,
        onClick: (e: MouseEvent) => {
            if (isSelectedByOther) {
                return;
            }

            // only allow multiselect when shifting
            if (e.shiftKey) {
                toggleSelectId(id);
                return;
            }

            clearSelectedIds();
            toggleSelectId(id);
        },
    };
}

export function useNodeInteractions(nodeId: string) {
    const { interactionMode, selectedIds, clearSelectedIds } = useInteractionStore((s) => s);
    const { isSelectedByOther, stroke, opacity, onClick } = useBaseInteractions(nodeId);

    return {
        isSelectedByOther,
        stroke,
        opacity,
        onClick: (e: MouseEvent) => {
            onClick(e);

            if (isSelectedByOther || interactionMode !== "add-edge") {
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
    const { stroke, opacity, onClick } = useBaseInteractions(edgeId);
    return {
        stroke,
        opacity,
        onClick: (e: MouseEvent) => onClick(e),
    };
}

export function useStockInteractions(stockId: string) {
    const { interactionMode, selectedIds, clearSelectedIds } = useInteractionStore((s) => s);
    const { isSelectedByOther, stroke, opacity, onClick } = useBaseInteractions(stockId);

    return {
        isSelectedByOther,
        stroke,
        opacity,
        onClick: (e: MouseEvent) => {
            onClick(e);

            if (isSelectedByOther || interactionMode !== "add-flow") {
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
    const { interactionMode, selectedIds, clearSelectedIds } = useInteractionStore((s) => s);
    const { isSelectedByOther, stroke, opacity, onClick } = useBaseInteractions(cloudId);

    return {
        isSelectedByOther,
        stroke,
        opacity,
        onClick: (e: MouseEvent) => {
            onClick(e);

            if (isSelectedByOther || interactionMode !== "add-flow") {
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
    const { interactionMode, selectedIds, clearSelectedIds } = useInteractionStore((s) => s);
    const { isSelectedByOther, stroke, opacity, onClick } = useBaseInteractions(flowId);

    return {
        isSelectedByOther,
        stroke,
        opacity,
        onClick: (e: MouseEvent) => {
            onClick(e);

            if (isSelectedByOther || interactionMode !== "add-edge") {
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
