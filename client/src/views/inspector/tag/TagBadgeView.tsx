import { LuTrash2 } from "react-icons/lu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTagForm } from "@/controllers/form";
import type { Tag } from "@/models/tag";

interface TagBadgeProps {
    isSelected: boolean;
    tag: Tag;
    onClick: () => void;
}

function EditTagView({ tagId }: { tagId: string }) {
    const { tag, handleChange, handleDelete } = useTagForm(tagId);
    if (!tag) {
        return null;
    }

    return (
        <FieldSet>
            <FieldGroup>
                <Field>
                    <FieldLabel>Label</FieldLabel>
                    <Input
                        name="label"
                        value={tag.label}
                        onChange={(e) => handleChange({ label: e.target.value })}
                    />
                </Field>
            </FieldGroup>
            <Field orientation="horizontal">
                <Button variant="destructive" type="button" onClick={handleDelete}>
                    <LuTrash2 />
                </Button>
            </Field>
        </FieldSet>
    );
}

export function TagBadgeView({ isSelected, tag, onClick }: TagBadgeProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Badge
                    key={tag.id}
                    className={`h-9 px-3 flex items-center cursor-pointer rounded-md ${isSelected ? "opacity-100" : "opacity-25"}`}
                    onClick={onClick}
                    style={{ backgroundColor: tag.color }}
                >
                    {tag.label}
                </Badge>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-sm p-6 z-100">
                <EditTagView tagId={tag.id} />
            </ContextMenuContent>
        </ContextMenu>
    );
}
