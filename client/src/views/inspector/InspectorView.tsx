import { EditItemFormView } from "./EditItemFormView";
import { TagSelectorView } from "./TagSelectorView";

export function InspectorView() {
    return (
        <div className="absolute flex flex-col gap-4 h-full p-4 overflow-scroll">
            <EditItemFormView />
            <TagSelectorView />
        </div>
    );
}
