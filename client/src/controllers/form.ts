import {
    updateCloud,
    updateEdge,
    updateFlow,
    updateLoop,
    updateNode,
    updateStock,
} from "@/actions/graph";
import { type Cloud, type Edge, type Flow, type Loop, type Node, type Stock } from "@/models/graph";
import type { Tag } from "@/models/tag";
import { useGraphStore } from "@/stores/graph";
import { useInteractionStore } from "@/stores/interaction";
import { useTagStore } from "@/stores/tag";

import { useCommands } from "./command";

export function useNodeForm(nodeId: string) {
    const { nodes } = useGraphStore((s) => s);
    const { deleteId, cancelSelection } = useCommands();

    return {
        node: nodes[nodeId],
        handleChange: (patch: Partial<Node>) => {
            updateNode(nodeId, patch);
        },
        handleCancel: () => {
            cancelSelection();
        },
        handleDelete: () => {
            deleteId(nodeId);
        },
    };
}

export function useEdgeForm(edgeId: string) {
    const { edges } = useGraphStore((s) => s);
    const { deleteId, cancelSelection } = useCommands();

    return {
        edge: edges[edgeId],
        handleChange: (patch: Partial<Edge>) => updateEdge(edgeId, patch),
        handleCancel: cancelSelection,
        handleDelete: () => deleteId(edgeId),
    };
}

export function useStockForm(stockId: string) {
    const { stocks } = useGraphStore((s) => s);
    const { deleteId, cancelSelection } = useCommands();

    return {
        stock: stocks[stockId],
        handleChange: (patch: Partial<Stock>) => updateStock(stockId, patch),
        handleCancel: cancelSelection,
        handleDelete: () => deleteId(stockId),
    };
}

export function useCloudForm(cloudId: string) {
    const { clouds } = useGraphStore((s) => s);
    const { deleteId, cancelSelection } = useCommands();

    return {
        cloud: clouds[cloudId],
        handleChange: (patch: Partial<Cloud>) => {
            updateCloud(cloudId, patch);
        },
        handleCancel: () => {
            cancelSelection();
        },
        handleDelete: () => {
            deleteId(cloudId);
        },
    };
}

export function useFlowForm(flowId: string) {
    const { flows } = useGraphStore((s) => s);
    const { deleteId, cancelSelection } = useCommands();

    return {
        flow: flows[flowId],
        handleChange: (patch: Partial<Flow>) => {
            updateFlow(flowId, patch);
        },
        handleCancel: () => {
            cancelSelection();
        },
        handleDelete: () => {
            deleteId(flowId);
        },
    };
}

export function useLoopForm(loopId: string) {
    const { loops } = useGraphStore((s) => s);
    const { deleteId, cancelSelection } = useCommands();

    return {
        loop: loops[loopId],
        handleChange: (patch: Partial<Loop>) => {
            updateLoop(loopId, patch);
        },
        handleCancel: () => {
            cancelSelection();
        },
        handleDelete: () => {
            deleteId(loopId);
        },
    };
}

export function useGroupForm() {
    const { deleteSelectedIds, cancelSelection } = useCommands();

    return {
        handleCancel: () => {
            cancelSelection();
        },
        handleDelete: () => {
            deleteSelectedIds();
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
