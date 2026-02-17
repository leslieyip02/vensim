import { Badge } from "@/components/ui/badge";
import { useNodeForm } from "@/controllers/form";
import { getParentEntities } from "@/utils/graphTraversal";

import { EquationFieldSet } from "./EquationFieldSet";
import { EquationFormWrapper } from "./EquationFormWrapper";

export function EditNodeEquationFormView({ nodeId }: { nodeId: string }) {
    const { node, handleChange } = useNodeForm(nodeId);
    if (!node) {
        return null;
    }

    const parents = getParentEntities(node.id);
    const parentLabels = parents
        ?.filter((parent) => parent.label && parent.label.trim() != "")
        .map((parent) => parent.label);

    return (
        <EquationFormWrapper label="Edit Equation">
            <EquationFieldSet entity={node} handleChange={handleChange} parents={parents} />
            {parentLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {parents?.map((parent) => {
                        if (!parent || !parent.label) return null;
                        const onClick = () =>
                            handleChange({
                                equation: `${node.equation.trim()} ${parent.id}`,
                            });
                        return (
                            <Badge
                                key={parent.id}
                                className="h-9 px-3 flex items-center cursor-pointer rounded-md bg-gray-600 hover:bg-gray-300 transition-colors"
                                onClick={onClick}
                            >
                                {parent.label}
                            </Badge>
                        );
                    })}
                </div>
            )}
        </EquationFormWrapper>
    );
}
