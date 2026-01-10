import { useInteractionStore } from "@/stores/interaction";
import { EditNodeFormView } from "./EditNodeFormView";
import { EditEdgeFormView } from "./EditEdgeFormView";
import { isEdgeId, isNodeId } from "@/models/graph";

export function InspectorView() {
    const { selectedIds } = useInteractionStore((s) => s);

    // TODO: handle multiple select?
    if (selectedIds.length !== 1) {
        return null;
    }

    const selectedId = selectedIds[0];

    return (
        <div className="absolute top-5 left-5 w-sm z-100 p-4 border-b bg-background drop-shadow rounded-md">
            {isNodeId(selectedId) && <EditNodeFormView nodeId={selectedId} />}
            {isEdgeId(selectedId) && <EditEdgeFormView edgeId={selectedId} />}
        </div>
    );
}
