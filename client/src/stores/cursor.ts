import { create } from "zustand";

import type { Cursor, CursorMessage } from "@/models/cursor";

interface CursorState {
    cursors: Record<string, Cursor>;

    handleMessage: (message: CursorMessage) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
    cursors: {},

    handleMessage: (message) =>
        set((state) => {
            switch (message.type) {
                case "cursor/update":
                    return {
                        cursors: {
                            ...state.cursors,
                            [message.clientId]: {
                                ...state.cursors[message.clientId],
                                ...message.cursor,
                            },
                        },
                    };

                case "cursor/delete":
                    return {
                        cursors: Object.fromEntries(
                            Object.entries(state.cursors).filter(([id]) => id !== message.clientId),
                        ),
                    };
            }
        }),
}));
