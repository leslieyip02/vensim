import type { Operation } from "@/models/operation";
import { useGraphStore } from "@/stores/graph";

let socket: WebSocket | null = null;
let clientId: string | null = null;

export function connectGraphSocket(url: string) {
    socket = new WebSocket(url);

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
