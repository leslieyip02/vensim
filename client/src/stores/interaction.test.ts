import { beforeEach, describe, expect, it } from "vitest";

import { type InteractionMode, useInteractionStore } from "./interaction";

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
        useInteractionStore.getState().toggleSelectId("node_1");

        expect(useInteractionStore.getState().selectedIds).toEqual(["node_1"]);
    });

    it("toggles selected id off if already selected", () => {
        useInteractionStore.setState({
            selectedIds: ["node_1"],
        });

        useInteractionStore.getState().toggleSelectId("node_1");

        expect(useInteractionStore.getState().selectedIds).toEqual([]);
    });

    it("supports toggling multiple selected ids", () => {
        const store = useInteractionStore.getState();

        store.toggleSelectId("node_1");
        store.toggleSelectId("node_2");

        expect(useInteractionStore.getState().selectedIds).toEqual(["node_1", "node_2"]);
    });

    it("clears selected ids", () => {
        useInteractionStore.setState({
            selectedIds: ["node_1", "node_2"],
        });

        useInteractionStore.getState().clearSelectedIds();

        expect(useInteractionStore.getState().selectedIds).toEqual([]);
    });

    it("toggles selected tag on", () => {
        useInteractionStore.getState().toggleSelectedTag("tag_a");

        expect(useInteractionStore.getState().selectedTags).toEqual(["tag_a"]);
    });

    it("toggles selected tag off if already selected", () => {
        useInteractionStore.setState({
            selectedTags: ["tag_a"],
        });

        useInteractionStore.getState().toggleSelectedTag("tag_a");

        expect(useInteractionStore.getState().selectedTags).toEqual([]);
    });

    it("supports toggling multiple selected tags", () => {
        const store = useInteractionStore.getState();

        store.toggleSelectedTag("tag_a");
        store.toggleSelectedTag("tag_b");

        expect(useInteractionStore.getState().selectedTags).toEqual(["tag_a", "tag_b"]);
    });

    it("does not affect selectedIds when toggling tags", () => {
        useInteractionStore.setState({
            selectedIds: ["node_1"],
        });

        useInteractionStore.getState().toggleSelectedTag("tag_a");

        expect(useInteractionStore.getState().selectedIds).toEqual(["node_1"]);
        expect(useInteractionStore.getState().selectedTags).toEqual(["tag_a"]);
    });
});
