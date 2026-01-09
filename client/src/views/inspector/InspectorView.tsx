import { useInteractionStore } from "@/stores/interaction";
import { EditNodeFormView } from "./EditNodeFormView";
import { EditEdgeFormView } from "./EditEdgeFormView";

export function InspectorView() {
    const { selectedIds } = useInteractionStore((s) => s);
    if (selectedIds.length !== 1) {
        return;
    }

    const selectedId = selectedIds[0];

    return (
        <div className="absolute top-5 left-5 w-sm z-100 p-4 border-b bg-background drop-shadow rounded-md">
            {selectedId.startsWith("node") ? <EditNodeFormView /> : <EditEdgeFormView />}
        </div>
    );
}
