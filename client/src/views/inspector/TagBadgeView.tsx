import { Badge } from "@/components/ui/badge";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";
import type { Tag } from "@/models/tag";
import { EditTagFormView } from "./EditTagFormView";

interface TagBadgeProps {
    isSelected: boolean;
    tag: Tag;
    onClick: () => void;
}

export function TagBadgeView({ isSelected, tag, onClick }: TagBadgeProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Badge
                    key={tag.id}
                    className={`h-9 px-3 flex items-center cursor-pointer rounded-md ${isSelected ? "opacity-100" : "opacity-25"}`}
                    onClick={onClick}
                >
                    {tag.label}
                </Badge>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-sm p-6 z-100">
                <EditTagFormView tagId={tag.id} />
            </ContextMenuContent>
        </ContextMenu>
    );
}
