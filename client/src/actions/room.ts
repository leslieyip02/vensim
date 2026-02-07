import { useGraphStore } from "@/stores/graph";
import { connectGraphSocket } from "@/sync/graph";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;
const WS_ORIGIN = import.meta.env.VITE_WS_ORIGIN;

export async function createRoom() {
    const state = useGraphStore.getState();
    try {
        const res = await fetch(`${API_ORIGIN}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state }),
        });

        const { roomId } = await res.json();
        return roomId;
    } catch {
        throw new Error("Something went wrong with Room Creation");
    }
}

export async function joinRoom(roomId: string) {
    await connectGraphSocket(`${WS_ORIGIN}/join/${roomId}`);
}
