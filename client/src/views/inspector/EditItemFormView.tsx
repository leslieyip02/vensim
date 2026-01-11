import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { isEdgeId, isNodeId } from "@/models/graph";
import { EditNodeFormView } from "./EditNodeFormView";
import { EditEdgeFormView } from "./EditEdgeFormView";
import { useInteractionStore } from "@/stores/interaction";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { LuChevronDown } from "react-icons/lu";
import { useState } from "react";

export function EditItemFormView() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { selectedIds } = useInteractionStore((s) => s);

    if (selectedIds.length !== 1) {
        return null;
    }

    const selectedId = selectedIds[0];

    return (
        <Card className="w-sm py-4 z-100 border-b bg-background drop-shadow rounded-md">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-2">
                <CollapsibleTrigger>
                    <CardTitle className="px-6 flex flex-row items-center justify-between">
                        Edit {isNodeId(selectedId) ? "Node" : "Edge"}
                        <Button variant="ghost" className="bg-transparent">
                            <LuChevronDown />
                        </Button>
                    </CardTitle>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        {isNodeId(selectedId) && <EditNodeFormView nodeId={selectedId} />}
                        {isEdgeId(selectedId) && <EditEdgeFormView edgeId={selectedId} />}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
