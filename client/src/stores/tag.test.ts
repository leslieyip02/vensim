import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Tag } from "@/models/tag";

import { useTagStore } from "./tag";

vi.mock("@/configs/color", () => ({
    getPaletteColor: vi.fn((i: number) => `color-${i}`),
}));

vi.mock("@/models/tag", () => ({
    makeTagId: vi.fn((counter: number) => `tag-${counter}`),
}));

describe("useTagStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        useTagStore.setState({
            counter: 1,
            tags: {},
            tagToItems: {},
        });
    });

    it("has correct initial state", () => {
        const state = useTagStore.getState();

        expect(state.counter).toBe(1);
        expect(state.tags).toEqual({});
        expect(state.tagToItems).toEqual({});
    });

    it("adds a tag with default label", () => {
        const tagId = useTagStore.getState().addTag();

        const state = useTagStore.getState();
        const tag = state.tags[tagId];

        expect(tagId).toBe("tag-1");
        expect(state.counter).toBe(2);

        expect(tag).toEqual<Tag>({
            id: "tag-1",
            label: "#tag-1",
            color: "color-0",
        });

        expect(useTagStore.getState().tagToItems[tagId]).toBeInstanceOf(Set);
        expect(useTagStore.getState().tagToItems[tagId].size).toBe(0);
    });

    it("adds a tag with a custom label", () => {
        const tagId = useTagStore.getState().addTag("Important");

        const tag = useTagStore.getState().tags[tagId];

        expect(tag.label).toBe("Important");
    });

    it("updates a tag", () => {
        const tagId = useTagStore.getState().addTag("Old");

        useTagStore.getState().updateTag(tagId, {
            label: "New",
            color: "red",
        });

        expect(useTagStore.getState().tags[tagId]).toEqual({
            id: tagId,
            label: "New",
            color: "red",
        });
    });

    it("deletes a tag and its tagToItems entry", () => {
        const tagId = useTagStore.getState().addTag();

        useTagStore.getState().deleteTag(tagId);

        expect(useTagStore.getState().tags[tagId]).toBeUndefined();
        expect(useTagStore.getState().tagToItems[tagId]).toBeUndefined();
    });

    it("toggles a tag on for an item", () => {
        const tagId = useTagStore.getState().addTag();

        useTagStore.getState().toggleTag(tagId, "item-1");

        expect(useTagStore.getState().tagToItems[tagId].has("item-1")).toBe(true);
    });

    it("toggles a tag off for an item if already tagged", () => {
        const tagId = useTagStore.getState().addTag();

        const store = useTagStore.getState();
        store.toggleTag(tagId, "item-1");
        store.toggleTag(tagId, "item-1");

        expect(useTagStore.getState().tagToItems[tagId].has("item-1")).toBe(false);
    });

    it("supports tagging multiple items with the same tag", () => {
        const tagId = useTagStore.getState().addTag();

        const store = useTagStore.getState();
        store.toggleTag(tagId, "item-1");
        store.toggleTag(tagId, "item-2");

        expect(useTagStore.getState().tagToItems[tagId]).toEqual(new Set(["item-1", "item-2"]));
    });

    it("does nothing when toggling a non-existant tag", () => {
        const tagId = "tag-1";
        useTagStore.getState().toggleTag(tagId, "item-1");

        expect(useTagStore.getState().tagToItems[tagId]).not.toBeDefined();
    });

    describe("isTagged", () => {
        it("returns true when item is tagged", () => {
            const tagId = useTagStore.getState().addTag();

            useTagStore.getState().toggleTag(tagId, "item-1");

            expect(useTagStore.getState().isTagged(tagId, "item-1")).toBe(true);
        });

        it("returns false when item is not tagged", () => {
            const tagId = useTagStore.getState().addTag();

            useTagStore.getState().addTag("item-1");

            expect(useTagStore.getState().isTagged(tagId, "item-1")).toBe(false);
        });

        it("returns false when tag does not exist", () => {
            expect(useTagStore.getState().isTagged("tag-1", "item-1")).toBe(false);
        });

        it("returns false when item does not exist", () => {
            const tagId = useTagStore.getState().addTag();

            expect(useTagStore.getState().isTagged(tagId, "item-1")).toBe(false);
        });
    });
});
