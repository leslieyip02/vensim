import type { Operation } from "@/models/operation";
import { useGraphStore } from "@/stores/graph";

let socket: WebSocket | null = null;
let clientId: string | null = null;

export function isGraphSocketConnected() {
    return socket !== null;
}

export function connectGraphSocket(url: string): Promise<void> {
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
            const msg = JSON.parse(event.data);

            if (msg.type === "clientId") {
                clientId = msg.clientId;
                return;
            }

            if (msg.type === "snapshot") {
                useGraphStore.setState(msg.state);
                return;
            }

            useGraphStore.getState().apply(msg);
        };
    });
}

export function sendGraphOperation(op: Operation) {
    if (socket?.readyState === WebSocket.OPEN && clientId) {
        socket.send(
            JSON.stringify({
                ...op,
                senderId: clientId,
            }),
        );
    }
}
