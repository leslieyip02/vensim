import type { ReactNode } from "react";
import { LuTrash2 } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";

import { InspectorSectionWrapper } from "../InspectorSectionWrapper";

interface InspectorFormProps {
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
                            <LuTrash2 />
                        </Button>
                    )}
                </Field>
            )}
        </FieldGroup>
    );
}

export function InspectorFormWrapper(props: InspectorFormProps) {
    return (
        <InspectorSectionWrapper label="Edit">
            <InspectorFormContent {...props} />
        </InspectorSectionWrapper>
    );
}
