import type { Edge, Node } from "@/models/graph";
import type { Tag } from "@/models/tag";
import { useGraphStore } from "@/stores/graph";
import { useInteractionStore } from "@/stores/interaction";
import { useTagStore } from "@/stores/tag";

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
