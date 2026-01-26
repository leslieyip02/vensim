import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useInteractionStore } from "@/stores/interaction";

import { EditCloudFormView } from "./EditCloudFormView";
import { EditEdgeFormView } from "./EditEdgeFormView";
import { EditFlowFormView } from "./EditFlowFormView";
import { EditGroupFormView } from "./EditGroupFormView";
import { EditNodeFormView } from "./EditNodeFormView";
import { EditStockFormView } from "./EditStockFormView";

type FormType = "node" | "edge" | "stock" | "cloud" | "flow" | "group";

const getFormType = (selectedIds: string[]): FormType | null => {
    if (selectedIds.length > 1) {
        return "group";
    }

    const selectedId = selectedIds[0];
    return selectedId.split("-")[0] as FormType | null;
};

interface FormProps {
    formType: FormType | null;
    selectedIds: string[];
    isOpen: boolean;
}

const FormHeader = ({ formType, isOpen }: FormProps) => {
    if (!formType) {
        return null;
    }

    const formTitle = {
        node: "Edit Node",
        edge: "Edit Edge",
        stock: "Edit Stock",
        cloud: "Edit Cloud",
        flow: "Edit Flow",
        group: "Edit",
    }[formType];

    return (
        <>
            {formTitle}
            <Button variant="ghost" className="bg-transparent">
                {isOpen ? <LuChevronUp /> : <LuChevronDown />}
            </Button>
        </>
    );
};

const FormView = ({ formType, selectedIds }: FormProps) => {
    switch (formType) {
        case "node":
            return <EditNodeFormView nodeId={selectedIds[0]} />;
        case "edge":
            return <EditEdgeFormView edgeId={selectedIds[0]} />;
        case "stock":
            return <EditStockFormView stockId={selectedIds[0]} />;
        case "cloud":
            return <EditCloudFormView cloudId={selectedIds[0]} />;
        case "flow":
            return <EditFlowFormView flowId={selectedIds[0]} />;
        case "group":
            return <EditGroupFormView targetIds={selectedIds} />;
        default:
            return null;
    }
};

export function EditFormView() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { selectedIds } = useInteractionStore((s) => s);

    if (selectedIds.length === 0) {
        return null;
    }

    const formProps = {
        formType: getFormType(selectedIds),
        selectedIds,
        isOpen,
    };

    return (
        <Card className="w-sm py-4 z-100 border-b bg-background drop-shadow rounded-md">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-2">
                <CollapsibleTrigger>
                    <CardTitle className="px-6 flex flex-row items-center justify-between">
                        <FormHeader {...formProps} />
                    </CardTitle>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <FormView {...formProps} />
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
