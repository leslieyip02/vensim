import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { isEdgeId, isNodeId } from "@/models/graph";
import { EditNodeFormView } from "./EditNodeFormView";
import { EditEdgeFormView } from "./EditEdgeFormView";
import { useInteractionStore } from "@/stores/interaction";

export function EditItemFormView() {
    const { selectedIds } = useInteractionStore((s) => s);

    if (selectedIds.length !== 1) {
        return null;
    }

    const selectedId = selectedIds[0];

    return (
        <Card className="w-sm z-100 border-b bg-background drop-shadow rounded-md">
            <CardTitle className="px-6">Edit {isNodeId(selectedId) ? "Node" : "Edge"}</CardTitle>
            <CardContent>
                {isNodeId(selectedId) && <EditNodeFormView nodeId={selectedId} />}
                {isEdgeId(selectedId) && <EditEdgeFormView edgeId={selectedId} />}
            </CardContent>
        </Card>
    );
}
