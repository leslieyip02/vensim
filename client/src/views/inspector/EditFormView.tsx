import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { isNodeId } from "@/models/graph";
import { EditNodeFormView } from "./EditNodeFormView";
import { EditEdgeFormView } from "./EditEdgeFormView";
import { useInteractionStore } from "@/stores/interaction";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { useState } from "react";
import { EditGroupFormView } from "./EditGroupFormView";

type FormType = "node" | "edge" | "group";

export function EditFormView() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { selectedIds } = useInteractionStore((s) => s);

    if (selectedIds.length === 0) {
        return null;
    }

    const formType: FormType =
        selectedIds.length > 1 ? "group" : isNodeId(selectedIds[0]) ? "node" : "edge";

    const FormView = () => {
        switch (formType) {
            case "node":
                return <EditNodeFormView nodeId={selectedIds[0]} />;
            case "edge":
                return <EditEdgeFormView edgeId={selectedIds[0]} />;
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
