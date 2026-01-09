import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useGraphStore } from "@/stores/graph";
import { useInteractionStore } from "@/stores/interaction";
import { LuTrash2 } from "react-icons/lu";

export function EditEdgeFormView() {
    const { selectedIds, clearSelectedIds } = useInteractionStore((s) => s);
    if (selectedIds.length !== 1) {
        return;
    }

    const selectedId = selectedIds[0];
    if (!selectedId.startsWith("edge")) {
        return;
    }

    const edge = useGraphStore((s) => s.edges[selectedId]);
    const { updateEdge, deleteEdge } = useGraphStore((s) => s);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const polarity = formData.get("polarity")?.toString();

        if (polarity === "+" || polarity === "-") {
            updateEdge(edge.id, {
                polarity,
            });
        }
        clearSelectedIds();
    };

    const handleDelete = () => {
        deleteEdge(edge.id);
        clearSelectedIds();
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>Edit Edge</FieldLegend>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="polarity">Edge Polarity</FieldLabel>
                            <Select name="polarity" defaultValue={edge.polarity}>
                                <SelectTrigger id="polarity">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="z-100">
                                    <SelectItem value="+">+</SelectItem>
                                    <SelectItem value="-">-</SelectItem>
                                </SelectContent>
                            </Select>
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
