import { Button } from "@/components/ui/button";
import { useTagStore } from "@/stores/tag";

import { TagBadgeView } from "./TagBadgeView";

export function ToggleTagsView({ targetIds }: { targetIds: string[] }) {
    const { tags, tagToItems, addTag, toggleTag } = useTagStore((s) => s);

    return (
        <div className="flex flex-wrap gap-2">
            {Object.entries(tags).map(([tagId, tag]) => {
                const isSelected = targetIds.every((targetId) => tagToItems[tagId].has(targetId));
                const onClick = () => {
                    const shouldToggleOn = !isSelected;
                    targetIds.forEach((targetId) => {
                        if (shouldToggleOn && !tagToItems[tagId].has(targetId)) {
                            toggleTag(tagId, targetId);
                        }

                        if (!shouldToggleOn && tagToItems[tagId].has(targetId)) {
                            toggleTag(tagId, targetId);
                        }
                    });
                };

                return (
                    <TagBadgeView key={tagId} isSelected={isSelected} tag={tag} onClick={onClick} />
                );
            })}

            <Button
                variant="outline"
                onClick={() => {
                    const tagId = addTag();
                    targetIds.forEach((targetId) => toggleTag(tagId, targetId));
                }}
            >
                + Add tag
            </Button>
        </div>
    );
}
