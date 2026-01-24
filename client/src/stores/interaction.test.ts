import { beforeEach,describe, expect, it } from "vitest";

import { type InteractionMode,useInteractionStore } from "./interaction";

describe("useInteractionStore", () => {
    beforeEach(() => {
        useInteractionStore.setState({
            interactionMode: "select",
            selectedIds: [],
            selectedTags: [],
        });
    });

    it("has correct initial state", () => {
        const state = useInteractionStore.getState();

        expect(state.interactionMode).toBe("select");
        expect(state.selectedIds).toEqual([]);
        expect(state.selectedTags).toEqual([]);
    });

    it("sets interaction mode", () => {
        const mode: InteractionMode = "add-node";

        useInteractionStore.getState().setInteractionMode(mode);

        expect(useInteractionStore.getState().interactionMode).toBe("add-node");
    });

    it("toggles selected id on", () => {
        useInteractionStore.getState().toggleSelectId("node-1");

        expect(useInteractionStore.getState().selectedIds).toEqual(["node-1"]);
    });

    it("toggles selected id off if already selected", () => {
        useInteractionStore.setState({
            selectedIds: ["node-1"],
        });

        useInteractionStore.getState().toggleSelectId("node-1");

        expect(useInteractionStore.getState().selectedIds).toEqual([]);
    });

    it("supports toggling multiple selected ids", () => {
        const store = useInteractionStore.getState();

        store.toggleSelectId("node-1");
        store.toggleSelectId("node-2");

        expect(useInteractionStore.getState().selectedIds).toEqual(["node-1", "node-2"]);
    });

    it("clears selected ids", () => {
        useInteractionStore.setState({
            selectedIds: ["node-1", "node-2"],
        });

        useInteractionStore.getState().clearSelectedIds();

        expect(useInteractionStore.getState().selectedIds).toEqual([]);
    });

    it("toggles selected tag on", () => {
        useInteractionStore.getState().toggleSelectedTag("tag-a");

        expect(useInteractionStore.getState().selectedTags).toEqual(["tag-a"]);
    });

    it("toggles selected tag off if already selected", () => {
        useInteractionStore.setState({
            selectedTags: ["tag-a"],
        });

        useInteractionStore.getState().toggleSelectedTag("tag-a");

        expect(useInteractionStore.getState().selectedTags).toEqual([]);
    });

    it("supports toggling multiple selected tags", () => {
        const store = useInteractionStore.getState();

        store.toggleSelectedTag("tag-a");
        store.toggleSelectedTag("tag-b");

        expect(useInteractionStore.getState().selectedTags).toEqual(["tag-a", "tag-b"]);
    });

    it("does not affect selectedIds when toggling tags", () => {
        useInteractionStore.setState({
            selectedIds: ["node-1"],
        });

        useInteractionStore.getState().toggleSelectedTag("tag-a");

        expect(useInteractionStore.getState().selectedIds).toEqual(["node-1"]);
        expect(useInteractionStore.getState().selectedTags).toEqual(["tag-a"]);
    });
});
