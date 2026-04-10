import {
    deleteCloud,
    deleteEdge,
    deleteFlow,
    deleteLoop,
    deleteNode,
    deleteStock,
    updateEdge,
} from "@/actions/graph";
import { isCloudId, isEdgeId, isFlowId, isLoopId, isNodeId, isStockId } from "@/models/graph";
import { useInteractionStore } from "@/stores/interaction";

export function useCommands() {
    const { selectedIds, clearSelectedIds } = useInteractionStore();

    const deleteIds = (ids: string[]) => {
        ids.forEach((id) => {
            if (isNodeId(id)) deleteNode(id);
            else if (isStockId(id)) deleteStock(id);
            else if (isEdgeId(id)) deleteEdge(id);
            else if (isCloudId(id)) deleteCloud(id);
            else if (isFlowId(id)) deleteFlow(id);
            else if (isLoopId(id)) deleteLoop(id);
        });
        clearSelectedIds();
    };

    const updateEdgePolarities = (ids: string[], patch: Partial<{ polarity: "+" | "-" }>) => {
        ids.forEach((id) => {
            if (isEdgeId(id)) updateEdge(id, patch);
        });
    };

    return {
        deleteSelectedIds: () => deleteIds(selectedIds),
        deleteId: (id: string) => deleteIds([id]),
        updateSelectedEdgePolarities: (polarity: "+" | "-") =>
            updateEdgePolarities(selectedIds, { polarity }),
        cancelSelection: () => clearSelectedIds(),
    };
}
