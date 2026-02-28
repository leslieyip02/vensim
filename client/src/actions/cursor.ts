import type { CursorMessage } from "@/models/cursor";
import { useCursorStore } from "@/stores/cursor";
import { getClientId, getUsername } from "@/sync/id";
import { sendCursorMessage } from "@/sync/socket";

const THROTTLE_WINDOW = 50;

let lastSentTimestamp = Date.now();

function dispatch(message: CursorMessage) {
    const state = useCursorStore.getState();

    // always update local cursor
    state.handleMessage(message);

    // throttle updates to server
    const currentTimestamp = Date.now();
    if (currentTimestamp - lastSentTimestamp > THROTTLE_WINDOW) {
        sendCursorMessage(message);
        lastSentTimestamp = currentTimestamp;
    }
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
