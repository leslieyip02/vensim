import { useFlowForm } from "@/controllers/form";

import { EquationFieldSet } from "./EquationFieldSet";
import { EquationFormWrapper } from "./EquationFormWrapper";

export function EditFlowEquationFormView({ flowId }: { flowId: string }) {
    const { flow, handleChange } = useFlowForm(flowId);
    if (!flow) {
        return null;
    }

    return (
        <EquationFormWrapper label="Edit Equation">
            <EquationFieldSet entity={flow} handleChange={handleChange} />
        </EquationFormWrapper>
    );
}
