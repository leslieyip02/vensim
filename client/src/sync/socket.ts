import { deleteCursor } from "@/actions/cursor";
import type { CursorMessage } from "@/models/cursor";
import type { Operation } from "@/models/operation";
import { useCursorStore } from "@/stores/cursor";
import { useGraphStore } from "@/stores/graph";

import { getClientId, isClientIdAssigned, setClientId } from "./id";

let socket: WebSocket | null = null;

export function isSocketConnected() {
    return socket !== null;
}

export function connectSocket(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        socket = new WebSocket(url);

        socket.onopen = () => {
            resolve();
        };

        socket.onerror = () => {
            socket = null;
            const roomId = url.split("/").at(-1);
            reject(new Error(`Failed to join room ID:${roomId}`));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "clientId") {
                // delete the "local" cursor
                const currentId = getClientId();
                deleteCursor(currentId);
                setClientId(message.clientId);
                return;
            }

            if (message.type === "snapshot") {
                // always overwrite data with snapshot
                // the server state is the source of truth
                useGraphStore.setState(message.state);
                return;
            }

            if (message.type === "leave") {
                deleteCursor(message.clientId);
                return;
            }

            if (message.type === "cursor") {
                useCursorStore.getState().handleMessage(message.data);
                return;
            }

            if (message.type === "graph") {
                useGraphStore.getState().apply(message.data);
                return;
            }
        };
    });
}

export function sendGraphOperation(op: Operation) {
    if (!socket || socket.readyState !== WebSocket.OPEN || !isClientIdAssigned()) {
        return;
    }

    const message = JSON.stringify({
        type: "graph",
        senderId: getClientId(),
        data: { ...op },
    });

    socket.send(message);
}

export function sendCursorMessage(message: CursorMessage) {
    if (!socket || socket.readyState !== WebSocket.OPEN || !isClientIdAssigned()) {
        return;
    }

    socket.send(
        JSON.stringify({
            type: "cursor",
            senderId: getClientId(),
            data: { ...message },
        }),
    );
}
