import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { isCloudId, isFlowId, isNodeId, isStockId } from "@/models/graph";
import { EditNodeFormView } from "./EditNodeFormView";
import { EditEdgeFormView } from "./EditEdgeFormView";
import { useInteractionStore } from "@/stores/interaction";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { useState } from "react";
import { EditGroupFormView } from "./EditGroupFormView";
import { EditStockFormView } from "./EditStockFormView";
import { EditCloudFormView } from "./EditCloudView";
import { EditFlowFormView } from "./EdtiFlowView";

type FormType = "node" | "edge" | "stock" | "cloud" | "flow" | "group";

export function EditFormView() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { selectedIds } = useInteractionStore((s) => s);

    if (selectedIds.length === 0) {
        return null;
    }

    const formType: FormType =
        selectedIds.length > 1
            ? "group"
            : isNodeId(selectedIds[0])
            ? "node"
            : isStockId(selectedIds[0])
            ? "stock"
            : isCloudId(selectedIds[0])
            ? "cloud"
            : isFlowId(selectedIds[0])
            ? "flow"
            : "edge";


    const FormView = () => {
        switch (formType) {
            case "node":
                return <EditNodeFormView nodeId={selectedIds[0]} />;
            case "edge":
                return <EditEdgeFormView edgeId={selectedIds[0]} />;
            case "stock":
                return <EditStockFormView stockId={selectedIds[0]} />;
            case "cloud":
                return <EditCloudFormView nodeId={selectedIds[0]} />;
            case "flow":
                return <EditFlowFormView flowId={selectedIds[0]} />;
            case "group":
                return <EditGroupFormView targetIds={selectedIds} />;
            default:
                return null;
        }
    };

    const getFormTitle = () => {
        switch (formType) {
            case "node":
                return "Edit Node";
            case "edge":
                return "Edit Edge";
            case "stock":
                return "Edit Stock";
            case "cloud":
                return "Edit Cloud";
            case "group":
                return "Edit Group";
            default:
                return null;
        }
    };

    return (
        <Card className="w-sm py-4 z-100 border-b bg-background drop-shadow rounded-md">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-2">
                <CollapsibleTrigger>
                    <CardTitle className="px-6 flex flex-row items-center justify-between">
                        {getFormTitle()}
                        <Button variant="ghost" className="bg-transparent">
                            {isOpen ? <LuChevronUp /> : <LuChevronDown />}
                        </Button>
                    </CardTitle>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <FormView />
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
