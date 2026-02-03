import ClickerIcon from "@/assets/clicker.svg?react";
import { useInteractionStore } from "@/stores/interaction";

import { InspectorSectionWrapper } from "../InspectorSectionWrapper";
import { EditCloudFormView } from "./EditCloudFormView";
import { EditEdgeFormView } from "./EditEdgeFormView";
import { EditFlowFormView } from "./EditFlowFormView";
import { EditGroupFormView } from "./EditGroupFormView";
import { EditNodeFormView } from "./EditNodeFormView";
import { EditStockFormView } from "./EditStockFormView";
import { ID_SEPARATOR } from "@/models/graph";

type FormType = "node" | "edge" | "stock" | "cloud" | "flow" | "group";

interface FormProps {
    formType: FormType | null;
    selectedIds: string[];
}

const getFormType = (selectedIds: string[]): FormType | null => {
    if (selectedIds.length > 1) {
        return "group";
    }

    const selectedId = selectedIds[0];
    return selectedId.split(ID_SEPARATOR)[0] as FormType | null;
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

export function InspectorFormView() {
    const { selectedIds } = useInteractionStore((s) => s);

    if (selectedIds.length === 0) {
        return (
            <InspectorSectionWrapper label="Edit">
                <p className="text-sm flex flex-row items-center">
                    Select (<ClickerIcon width="1rem" height="1rem" className="m-1" />) something to
                    start editing!
                </p>
            </InspectorSectionWrapper>
        );
    }

    const formProps = {
        formType: getFormType(selectedIds),
        selectedIds,
    };

    return <FormView {...formProps} />;
}
