import { Button } from "@/components/ui/button";
import { useInteractionStore } from "@/stores/interaction";
import { useTagStore } from "@/stores/tag";

import { InspectorSectionWrapper } from "../InspectorSectionWrapper";
import { TagBadgeView } from "./TagBadgeView";

export function TagSelectorView() {
    const { tags, addTag } = useTagStore();
    const { selectedTags, toggleSelectedTag } = useInteractionStore();

    return (
        <InspectorSectionWrapper label="Select Tags">
            <div className="flex flex-wrap gap-2">
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
            </div>
        </InspectorSectionWrapper>
    );
}
