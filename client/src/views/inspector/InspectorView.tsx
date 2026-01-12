import { RoomCardView } from "../room/RoomCardView";
import { EditFormView } from "./EditFormView";
import { TagSelectorView } from "./TagSelectorView";

export function InspectorView() {
    return (
        <div className="absolute flex flex-col gap-4 h-full p-4 overflow-scroll">
            {/* TODO: move this out into a menu bar? */}
            <RoomCardView />

            <EditFormView />
            <TagSelectorView />
        </div>
    );
}
