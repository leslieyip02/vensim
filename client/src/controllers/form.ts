import type { Edge, Node } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";
import { useInteractionStore } from "@/stores/interaction";

export function useNodeForm(nodeId: string) {
    const { nodes, updateNode, deleteNode } = useGraphStore((s) => s);
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
    const { edges, updateEdge, deleteEdge } = useGraphStore((s) => s);
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
