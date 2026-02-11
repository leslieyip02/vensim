import { useGraphStore } from "@/stores/graph";
import { connectGraphSocket } from "@/sync/graph";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;
const WS_ORIGIN = import.meta.env.VITE_WS_ORIGIN;

export async function createRoom() {
    const state = useGraphStore.getState();
    const path = `${API_ORIGIN}/create`;

    const params = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
    };

    const response = await fetch(path, params);

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Server error: ${response.status}`);
    }

    const data = await response.json();
    const roomId = data?.roomId;

    if (!roomId) {
        throw new Error("Unable to create room. Please try again.");
    }

    return roomId;
}

export async function joinRoom(roomId: string) {
    const checkPath = `${API_ORIGIN}/check/${roomId}`;
    const response = await fetch(checkPath);

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Server error: ${response.status}`);
    }

    const wsPath = `${WS_ORIGIN}/join/${roomId}`;
    await connectGraphSocket(wsPath);
}
