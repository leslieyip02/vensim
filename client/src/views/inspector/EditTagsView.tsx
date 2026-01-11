import { Button } from "@/components/ui/button";
import { useTagStore } from "@/stores/tag";
import { TagBadgeView } from "./TagBadgeView";

export function EditTagsView({ targetId }: { targetId: string }) {
    const { tags, tagToItems, addTag, toggleTag } = useTagStore((s) => s);

    // TODO: add context menu for editing tags
    return (
        <div className="flex flex-wrap gap-2">
            {Object.entries(tags).map(([tagId, tag]) => (
                <TagBadgeView
                    isSelected={tagToItems[tagId].has(targetId)}
                    tag={tag}
                    onClick={() => toggleTag(tagId, targetId)}
                />
            ))}
            <Button
                variant="outline"
                onClick={() => {
                    const tagId = addTag("default");
                    toggleTag(tagId, targetId);
                }}
            >
                + Add tag
            </Button>
        </div>
    );
}
