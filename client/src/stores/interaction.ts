import { create } from "zustand";

import { updateEntity } from "@/actions/graph";
import { ID_SEPARATOR } from "@/models/graph";
import { getUsername } from "@/sync/id";

interface InteractionState {
    interactionMode: InteractionMode;
    selectedIds: string[];
    selectedTags: string[];

    setInteractionMode: (interactionMode: InteractionMode) => void;
    toggleSelectId: (id: string) => void;
    clearSelectedIds: () => void;
    toggleSelectedTag: (id: string) => void;

    inspectorOpen: boolean;
    toggleInspectorOpen: () => void;
}

export type InteractionMode =
    | "select"
    | "add-node"
    | "add-edge"
    | "add-stock"
    | "add-cloud"
    | "add-flow";

export const useInteractionStore = create<InteractionState>((set, get) => ({
    interactionMode: "select",
    selectedIds: [],
    selectedTags: [],
    inspectorOpen: false,

    setInteractionMode: (interactionMode) =>
        set(() => ({
            interactionMode,
        })),

    toggleSelectId: (id) => {
        const isSelected = get().selectedIds.includes(id);

        set((state) => ({
            selectedIds: isSelected
                ? state.selectedIds.filter((selectedId) => selectedId !== id)
                : [...state.selectedIds, id],
        }));

        // HACK: this sucks
        const entityType = id.split(ID_SEPARATOR)[0];
        const patch = { selectedBy: isSelected ? null : getUsername() };
        updateEntity(entityType, id, patch);
    },

    clearSelectedIds: () => {
        const selectedIds = get().selectedIds;
        selectedIds.forEach((selectedId) => get().toggleSelectId(selectedId));
    },

    toggleSelectedTag: (id) =>
        set((state) => ({
            selectedTags: state.selectedTags.includes(id)
                ? state.selectedTags.filter((selectedTag) => selectedTag !== id)
                : [...state.selectedTags, id],
        })),

    toggleInspectorOpen: () =>
        set((state) => ({
            inspectorOpen: !state.inspectorOpen,
        })),
}));
