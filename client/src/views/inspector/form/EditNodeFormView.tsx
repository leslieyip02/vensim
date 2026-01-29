import { useNodeForm } from "@/controllers/form";

import { NodeFieldSet } from "./fields/NodeFieldSet";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

export function EditNodeFormView({ nodeId }: { nodeId: string }) {
    const { node, handleCancel, handleDelete } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    return (
        <InspectorFormWrapper onCancel={handleCancel} onDelete={handleDelete} showDelete>
            <NodeFieldSet nodeId={nodeId} />
        </InspectorFormWrapper>
    );
}
