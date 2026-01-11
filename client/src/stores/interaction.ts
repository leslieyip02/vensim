import { create } from "zustand";

interface InteractionState {
    interactionMode: InteractionMode;
    selectedIds: string[];
    selectedTags: string[];

    setInteractionMode: (interactionMode: InteractionMode) => void;
    toggleSelectId: (id: string) => void;
    clearSelectedIds: () => void;
    toggleSelectTag: (tagId: string) => void;
}

export type InteractionMode = "select" | "add-node" | "add-edge";

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

    toggleSelectTag: (tagId) =>
        set((state) => ({
            selectedTags: state.selectedTags.includes(tagId)
                ? state.selectedTags.filter((selectedTag) => selectedTag !== tagId)
                : [...state.selectedTags, tagId],
        })),
}));
