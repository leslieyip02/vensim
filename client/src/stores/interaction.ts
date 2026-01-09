import { create } from "zustand";

interface InteractionState {
    selectedIds: string[];
    interactionMode: InteractionMode;

    selectId: (id: string) => void;
    clearSelectedIds: () => void;
    setInteractionMode: (interactionMode: InteractionMode) => void;
}

export type InteractionMode = "select" | "add-node" | "add-edge";

export const useInteractionStore = create<InteractionState>((set) => ({
    selectedIds: [],
    interactionMode: "select",

    selectId: (id) =>
        set((state) => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter((selectedId) => selectedId !== id)
                : [...state.selectedIds, id],
        })),

    clearSelectedIds: () =>
        set((_) => ({
            selectedIds: [],
        })),

    setInteractionMode: (interactionMode) =>
        set((_) => ({
            interactionMode,
        })),
}));
