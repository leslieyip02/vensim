import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEdgeForm } from "@/controllers/form";
import { LuTrash2 } from "react-icons/lu";

export function EditEdgeFormView({ edgeId }: { edgeId: string }) {
    const { defaultPolarity, handleSubmit, handleCancel, handleDelete } = useEdgeForm(edgeId);

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>Edit Edge</FieldLegend>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="polarity">Edge Polarity</FieldLabel>
                            <Select name="polarity" defaultValue={defaultPolarity}>
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
                    <Button variant="outline" type="button" onClick={handleCancel}>
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
