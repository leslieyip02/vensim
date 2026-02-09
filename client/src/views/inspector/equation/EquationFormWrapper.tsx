import type { ReactNode } from "react";

import { FieldGroup } from "@/components/ui/field";

import { InspectorSectionWrapper } from "../InspectorSectionWrapper";

interface InspectorFormProps {
    label: string;
    children: ReactNode;
    onCancel?: () => void;
    onDelete?: () => void;
    showDelete?: boolean;
}

function InspectorFormContent({ children }: InspectorFormProps) {
    return <FieldGroup>{children}</FieldGroup>;
}

export function EquationFormWrapper(props: InspectorFormProps) {
    return (
        <InspectorSectionWrapper label={props.label}>
            <InspectorFormContent {...props} />
        </InspectorSectionWrapper>
    );
}
