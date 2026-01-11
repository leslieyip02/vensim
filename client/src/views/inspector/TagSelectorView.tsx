import { useInteractionStore } from "@/stores/interaction";
import { useTagStore } from "@/stores/tag";
import { TagBadgeView } from "./TagBadgeView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function TagSelectorView() {
    const { tags, addTag } = useTagStore();
    const { selectedTags, toggleSelectedTag } = useInteractionStore();

    if (Object.keys(tags).length === 0) {
        return null;
    }

    return (
        <Card className="w-sm z-100 border-b bg-background drop-shadow rounded-md">
            <CardTitle className="px-6">Select Tags</CardTitle>
            <CardContent className="flex flex-wrap gap-2">
                {Object.entries(tags).map(([tagId, tag]) => (
                    <TagBadgeView
                        isSelected={selectedTags.includes(tagId)}
                        tag={tag}
                        onClick={() => toggleSelectedTag(tagId)}
                    />
                ))}
                <Button variant="outline" onClick={() => addTag()}>
                    + Add tag
                </Button>
            </CardContent>
        </Card>
    );
}
