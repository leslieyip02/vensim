import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";

import { InspectorSectionWrapper } from "../InspectorSectionWrapper";

interface InspectorFormProps {
    label: string;
    children: ReactNode;
    onCancel?: () => void;
    onDelete?: () => void;
    showDelete?: boolean;
}

function InspectorFormContent({
    children,
    onCancel,
    onDelete,
    showDelete = false,
}: InspectorFormProps) {
    return (
        <FieldGroup>
            {children}

            {(onCancel || onDelete) && (
                <Field orientation="horizontal">
                    {onCancel && (
                        <Button variant="outline" type="button" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}

                    {showDelete && onDelete && (
                        <Button variant="destructive" type="button" onClick={onDelete}>
                            Clear
                        </Button>
                    )}
                </Field>
            )}
        </FieldGroup>
    );
}

export function EquationFormWrapper(props: InspectorFormProps) {
    return (
        <InspectorSectionWrapper label={props.label}>
            <InspectorFormContent {...props} />
        </InspectorSectionWrapper>
    );
}
