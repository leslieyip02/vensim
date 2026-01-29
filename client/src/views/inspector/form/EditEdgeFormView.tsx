import { useEdgeForm } from "@/controllers/form";

import { EdgeFieldSet } from "./fields/EdgeFieldSet";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

export function EditEdgeFormView({ edgeId }: { edgeId: string }) {
    const { edge, handleCancel, handleDelete } = useEdgeForm(edgeId);
    if (!edge) {
        return null;
    }

    return (
        <InspectorFormWrapper onCancel={handleCancel} onDelete={handleDelete} showDelete>
            <EdgeFieldSet edgeId={edgeId} />
        </InspectorFormWrapper>
    );
}
