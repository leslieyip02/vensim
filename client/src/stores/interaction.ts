import { create } from "zustand";

interface InteractionState {
    interactionMode: InteractionMode;
    selectedIds: string[];
    selectedTags: string[];

    setInteractionMode: (interactionMode: InteractionMode) => void;
    toggleSelectId: (id: string) => void;
    clearSelectedIds: () => void;
    toggleSelectedTag: (id: string) => void;
}

export type InteractionMode = "select" | "add-node" | "add-edge" | "add-stock" | "add-cloud" | "add-flow";

export const useInteractionStore = create<InteractionState>((set) => ({
    interactionMode: "select",
    selectedIds: [],
    selectedTags: [],

    setInteractionMode: (interactionMode) =>
        set((_) => ({
            interactionMode,
        })),

    toggleSelectId: (id) =>
        set((state) => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter((selectedId) => selectedId !== id)
                : [...state.selectedIds, id],
        })),

    clearSelectedIds: () =>
        set((_) => ({
            selectedIds: [],
        })),

    toggleSelectedTag: (id) =>
        set((state) => ({
            selectedTags: state.selectedTags.includes(id)
                ? state.selectedTags.filter((selectedTag) => selectedTag !== id)
                : [...state.selectedTags, id],
        })),
}));
