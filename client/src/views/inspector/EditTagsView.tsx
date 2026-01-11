import { Button } from "@/components/ui/button";
import { useTagStore } from "@/stores/tag";
import { TagBadgeView } from "./TagBadgeView";

export function EditTagsView({ targetId }: { targetId: string }) {
    const { tags, tagToItems, addTag, toggleTag } = useTagStore((s) => s);

    return (
        <div className="flex flex-wrap gap-2">
            {Object.entries(tags).map(([tagId, tag]) => (
                <TagBadgeView
                    key={tagId}
                    isSelected={tagToItems[tagId].has(targetId)}
                    tag={tag}
                    onClick={() => toggleTag(tagId, targetId)}
                />
            ))}
            <Button
                variant="outline"
                onClick={() => {
                    const tagId = addTag();
                    toggleTag(tagId, targetId);
                }}
            >
                + Add tag
            </Button>
        </div>
    );
}
