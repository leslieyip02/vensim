import { useGraphStore } from "@/stores/graph";
import { useInteractionStore } from "@/stores/interaction";

export function useNodeForm(nodeId: string) {
    const { nodes, updateNode, deleteNode } = useGraphStore((s) => s);
    const { clearSelectedIds } = useInteractionStore((s) => s);

    return {
        defaultLabel: nodes[nodeId]?.label,
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const label = formData.get("label")?.toString();

            if (label) {
                updateNode(nodeId, {
                    label,
                });
            }
            clearSelectedIds();
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
        defaultPolarity: edges[edgeId]?.polarity,
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const polarity = formData.get("polarity")?.toString();

            if (polarity === "+" || polarity === "-") {
                updateEdge(edgeId, {
                    polarity,
                });
            }
            clearSelectedIds();
        },
        handleCancel: () => {
            clearSelectedIds();
        },
        handleDelete: () => {
            deleteEdge(edgeId);
            clearSelectedIds();
        }
    };
}
