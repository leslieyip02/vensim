import { useFlowForm } from "@/controllers/form";

import { FlowFieldSet } from "./fields/FlowFieldSet";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

export function EditFlowFormView({ flowId }: { flowId: string }) {
    const { flow, handleCancel, handleDelete } = useFlowForm(flowId);
    if (!flow) {
        return null;
    }

    return (
        <InspectorFormWrapper onCancel={handleCancel} onDelete={handleDelete} showDelete>
            <FlowFieldSet flowId={flowId} />
        </InspectorFormWrapper>
    );
}
