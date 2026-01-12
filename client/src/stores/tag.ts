import { getPaletteColor } from "@/configs/color";
import { makeTagId, type Tag } from "@/models/tag";
import { create } from "zustand";

interface TagState {
    counter: number;
    tags: Record<string, Tag>;
    tagToItems: Record<string, Set<string>>;

    addTag: (label?: string) => string;
    updateTag: (id: string, patch: Partial<Tag>) => void;
    deleteTag: (id: string) => void;
    toggleTag: (tagId: string, itemId: string) => void;
    isTagged: (tagId: string, itemId: string) => boolean;
}

export const useTagStore = create<TagState>((set, get) => ({
    counter: 1,
    tags: {},
    tagToItems: {},

    addTag: (label) => {
        const tagId = makeTagId(get().counter);
        const color = getPaletteColor(get().counter - 1);

        set((state) => ({
            counter: state.counter + 1,
            tags: {
                ...state.tags,
                [tagId]: {
                    id: tagId,
                    label: label ?? `#${tagId}`,
                    color,
                },
            },
            tagToItems: {
                ...state.tagToItems,
                [tagId]: new Set(),
            },
        }));

        return tagId;
    },

    updateTag: (id, patch) =>
        set((state) => ({
            tags: {
                ...state.tags,
                [id]: {
                    ...state.tags[id],
                    ...patch,
                },
            },
        })),

    deleteTag: (tagId) =>
        set((state) => {
            const { [tagId]: _, ...restTags } = state.tags;
            const { [tagId]: __, ...restMap } = state.tagToItems;

            return {
                tags: restTags,
                tagToItems: restMap,
            };
        }),

    toggleTag: (tagId, itemId) =>
        set((state) => {
            const setForTag = state.tagToItems[tagId] ?? new Set();

            const next = new Set(setForTag);
            if (next.has(itemId)) {
                next.delete(itemId);
            } else {
                next.add(itemId);
            }

            return {
                tagToItems: {
                    ...state.tagToItems,
                    [tagId]: next,
                },
            };
        }),

    isTagged: (tagId, itemId) => get().tagToItems[tagId].has(itemId),
}));
