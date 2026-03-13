import { useNodeForm } from "@/controllers/form";

import { EquationFieldSet } from "./EquationFieldSet";
import { EquationFormWrapper } from "./EquationFormWrapper";

export function EditNodeEquationFormView({ nodeId }: { nodeId: string }) {
    const { node, handleChange } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    return (
        <EquationFormWrapper label="Edit Equation">
            <EquationFieldSet entity={node} handleChange={handleChange} />
        </EquationFormWrapper>
    );
}
