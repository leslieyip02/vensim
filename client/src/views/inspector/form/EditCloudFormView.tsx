import { useCloudForm } from "@/controllers/form";

import { CloudFieldSet } from "./fields/CloudFieldSet";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

export function EditCloudFormView({ cloudId }: { cloudId: string }) {
    const { cloud, handleCancel, handleDelete } = useCloudForm(cloudId);
    if (!cloud) {
        return null;
    }

    return (
        <InspectorFormWrapper onCancel={handleCancel} onDelete={handleDelete} showDelete>
            <CloudFieldSet cloudId={cloudId} />
        </InspectorFormWrapper>
    );
}
