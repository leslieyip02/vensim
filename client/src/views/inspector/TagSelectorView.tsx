import { useInteractionStore } from "@/stores/interaction";
import { useTagStore } from "@/stores/tag";
import { TagBadgeView } from "./TagBadgeView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { useState } from "react";

export function TagSelectorView() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { tags, addTag } = useTagStore();
    const { selectedTags, toggleSelectedTag } = useInteractionStore();

    if (Object.keys(tags).length === 0) {
        return null;
    }

    return (
        <Card className="w-sm py-4 z-100 border-b bg-background drop-shadow rounded-md">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-2">
                <CollapsibleTrigger>
                    <CardTitle className="px-6 flex flex-row items-center justify-between">
                        Select Tags
                        <Button variant="ghost" className="bg-transparent">
                            {isOpen ? <LuChevronUp /> : <LuChevronDown />}
                        </Button>
                    </CardTitle>
                </CollapsibleTrigger>
                <CollapsibleContent>
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
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
