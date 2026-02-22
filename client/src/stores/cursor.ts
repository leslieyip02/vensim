import { create } from "zustand";

interface Cursor {
    x: number;
    y: number;
    name: string;
}

interface CursorState {
    cursors: Record<string, Cursor>;

    addCursor: (clientId: string, x: number, y: number, name: string) => void;
    deleteCursor: (clientId: string) => void;
    updateCursor: (clientId: string, x: number, y: number) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
    cursors: {},

    addCursor: (clientId, x, y, name) =>
        set((state) => ({
            cursors: {
                ...state.cursors,
                [clientId]: { x, y, name },
            },
        })),

    deleteCursor: (clientId) =>
        set((state) => ({
            cursors: Object.fromEntries(
                Object.entries(state.cursors).filter(([id]) => id !== clientId),
            ),
        })),

    updateCursor: (clientId, x, y) =>
        set((state) => ({
            cursors: {
                ...state.cursors,
                [clientId]: { x, y, name: state.cursors[clientId].name },
            },
        })),
}));
