import {
    deleteCloud,
    deleteEdge,
    deleteFlow,
    deleteNode,
    deleteStock,
    updateCloud,
    updateEdge,
    updateFlow,
    updateNode,
    updateStock} from "@/actions/graph";
import { type Cloud, type Edge, type Flow,isCloudId, isEdgeId, isNodeId, isStockId, type Node, type Stock } from "@/models/graph";
import type { Tag } from "@/models/tag";
import { useGraphStore } from "@/stores/graph";
import { useInteractionStore } from "@/stores/interaction";
import { useTagStore } from "@/stores/tag";

export function useNodeForm(nodeId: string) {
    const { nodes } = useGraphStore((s) => s);
    const { clearSelectedIds } = useInteractionStore((s) => s);

    return {
        node: nodes[nodeId],
        handleChange: (patch: Partial<Node>) => {
            updateNode(nodeId, patch);
        },
        handleCancel: () => {
            clearSelectedIds();
        },
        handleDelete: () => {
            deleteNode(nodeId);
            clearSelectedIds();
        },
    };
}

export function useEdgeForm(edgeId: string) {
    const { edges } = useGraphStore((s) => s);
    const { clearSelectedIds } = useInteractionStore((s) => s);

    return {
        edge: edges[edgeId],
        handleChange: (patch: Partial<Edge>) => {
            updateEdge(edgeId, patch);
        },
        handleCancel: () => {
            clearSelectedIds();
        },
        handleDelete: () => {
            deleteEdge(edgeId);
            clearSelectedIds();
        },
    };
}

export function useStockForm(stockId: string) {
    const { stocks } = useGraphStore((s) => s);
    const { clearSelectedIds } = useInteractionStore((s) => s);

    return {
        stock: stocks[stockId],
        handleChange: (patch: Partial<Stock>) => {
            updateStock(stockId, patch);
        },
        handleCancel: () => {
            clearSelectedIds();
        },
        handleDelete: () => {
            deleteStock(stockId);
            clearSelectedIds();
        },
    };
}

export function useCloudForm(cloudId: string) {
    const { clouds } = useGraphStore((s) => s);
    const { clearSelectedIds } = useInteractionStore((s) => s);

    return {
        cloud: clouds[cloudId],
        handleChange: (patch: Partial<Cloud>) => {
            updateCloud(cloudId, patch);
        },
        handleCancel: () => {
            clearSelectedIds();
        },
        handleDelete: () => {
            deleteCloud(cloudId);
            clearSelectedIds();
        },
    };
}

export function useFlowForm(flowId: string) {
    const { flows } = useGraphStore((s) => s);
    const { clearSelectedIds } = useInteractionStore((s) => s);

    return {
        flow: flows[flowId],
        handleChange: (patch: Partial<Flow>) => {
            updateFlow(flowId, patch);
        },
        handleCancel: () => {
            clearSelectedIds();
        },
        handleDelete: () => {
            deleteFlow(flowId);
            clearSelectedIds();
        },
    };
}

export function useGroupForm(targetIds: string[]) {
    const { clearSelectedIds } = useInteractionStore((s) => s);

    return {
        handleCancel: () => {
            clearSelectedIds();
        },
        handleDelete: () => {
            targetIds.forEach((targetId) => {
                if (isNodeId(targetId)) {
                    deleteNode(targetId);
                } else if (isStockId(targetId)) {
                    deleteStock(targetId);
                } else if (isEdgeId(targetId)) {
                    deleteEdge(targetId);
                } else if (isCloudId(targetId)) {
                    deleteCloud(targetId);
                }
            });
            clearSelectedIds();
        },
    };
}

export function useTagForm(tagId: string) {
    const { tags, updateTag, deleteTag } = useTagStore((s) => s);
    const { selectedTags, toggleSelectedTag } = useInteractionStore((s) => s);

    return {
        tag: tags[tagId],
        handleChange: (patch: Partial<Tag>) => {
            updateTag(tagId, patch);
        },
        handleDelete: () => {
            if (selectedTags.includes(tagId)) {
                toggleSelectedTag(tagId);
            }
            deleteTag(tagId);
        },
    };
}
