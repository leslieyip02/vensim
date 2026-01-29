import { Field, FieldLabel, FieldSet } from "@/components/ui/field";

import { ToggleTagsView } from "../../tag/ToggleTagsView";

export function GroupFieldSet({ targetIds }: { targetIds: string[] }) {
    return (
        <FieldSet>
            <Field>
                <FieldLabel>Tags</FieldLabel>
                <ToggleTagsView targetIds={targetIds} />
            </Field>
        </FieldSet>
    );
}
