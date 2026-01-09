import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useGraphStore } from "@/stores/graph";
import { useInteractionStore } from "@/stores/interaction";
import { LuTrash2 } from "react-icons/lu";

export function EditNodeFormView() {
    const { selectedIds, clearSelectedIds } = useInteractionStore((s) => s);
    if (selectedIds.length !== 1) {
        return;
    }

    const selectedId = selectedIds[0];
    if (!selectedId.startsWith("node")) {
        return;
    }

    const node = useGraphStore((s) => s.nodes[selectedId]);
    const { updateNode, deleteNode } = useGraphStore((s) => s);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const label = formData.get("label")?.toString();

        if (label) {
            updateNode(node.id, {
                label,
            });
        }
        clearSelectedIds();
    };

    const handleDelete = () => {
        deleteNode(node.id);
        clearSelectedIds();
    };

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>Edit Node</FieldLegend>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="label">Node Label</FieldLabel>
                            <Input id="label" name="label" defaultValue={node.label} />
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <Field orientation="horizontal">
                    <Button type="submit">Confirm Changes</Button>
                    <Button variant="outline" type="button" onClick={clearSelectedIds}>
                        Cancel
                    </Button>
                    <Button variant="destructive" type="button" onClick={handleDelete}>
                        <LuTrash2 />
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
