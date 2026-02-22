import type { CursorMessage } from "@/models/cursor";
import { useCursorStore } from "@/stores/cursor";
import { getClientId, getUsername } from "@/sync/id";
import { sendCursorMessage } from "@/sync/socket";

function dispatch(message: CursorMessage) {
    const state = useCursorStore.getState();
    state.handleMessage(message);
    sendCursorMessage(message);
}

export function updateCursor(x: number, y: number) {
    const clientId = getClientId();
    const username = getUsername();
    const message: CursorMessage = {
        type: "cursor/update",
        clientId,
        cursor: { x, y, username },
    };
    dispatch(message);
}

export function deleteCursor(clientId: string) {
    const message: CursorMessage = {
        type: "cursor/delete",
        clientId,
    };
    dispatch(message);
}
