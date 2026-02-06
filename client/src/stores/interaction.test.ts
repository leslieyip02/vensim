import { beforeEach, describe, expect, it } from "vitest";

import { ID_SEPARATOR } from "@/models/graph";

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
        useInteractionStore.getState().toggleSelectId(`node${ID_SEPARATOR}1`);

        expect(useInteractionStore.getState().selectedIds).toEqual([`node${ID_SEPARATOR}1`]);
    });

    it("toggles selected id off if already selected", () => {
        useInteractionStore.setState({
            selectedIds: [`node${ID_SEPARATOR}1`],
        });

        useInteractionStore.getState().toggleSelectId(`node${ID_SEPARATOR}1`);

        expect(useInteractionStore.getState().selectedIds).toEqual([]);
    });

    it("supports toggling multiple selected ids", () => {
        const store = useInteractionStore.getState();

        store.toggleSelectId(`node${ID_SEPARATOR}1`);
        store.toggleSelectId(`node${ID_SEPARATOR}2`);

        expect(useInteractionStore.getState().selectedIds).toEqual([
            `node${ID_SEPARATOR}1`,
            `node${ID_SEPARATOR}2`,
        ]);
    });

    it("clears selected ids", () => {
        useInteractionStore.setState({
            selectedIds: [`node${ID_SEPARATOR}1`, `node${ID_SEPARATOR}2`],
        });

        useInteractionStore.getState().clearSelectedIds();

        expect(useInteractionStore.getState().selectedIds).toEqual([]);
    });

    it("toggles selected tag on", () => {
        useInteractionStore.getState().toggleSelectedTag(`tag${ID_SEPARATOR}a`);

        expect(useInteractionStore.getState().selectedTags).toEqual([`tag${ID_SEPARATOR}a`]);
    });

    it("toggles selected tag off if already selected", () => {
        useInteractionStore.setState({
            selectedTags: [`tag${ID_SEPARATOR}a`],
        });

        useInteractionStore.getState().toggleSelectedTag(`tag${ID_SEPARATOR}a`);

        expect(useInteractionStore.getState().selectedTags).toEqual([]);
    });

    it("supports toggling multiple selected tags", () => {
        const store = useInteractionStore.getState();

        store.toggleSelectedTag(`tag${ID_SEPARATOR}a`);
        store.toggleSelectedTag(`tag${ID_SEPARATOR}b`);

        expect(useInteractionStore.getState().selectedTags).toEqual([
            `tag${ID_SEPARATOR}a`,
            `tag${ID_SEPARATOR}b`,
        ]);
    });

    it("does not affect selectedIds when toggling tags", () => {
        useInteractionStore.setState({
            selectedIds: [`node${ID_SEPARATOR}1`],
        });

        useInteractionStore.getState().toggleSelectedTag(`tag${ID_SEPARATOR}a`);

        expect(useInteractionStore.getState().selectedIds).toEqual([`node${ID_SEPARATOR}1`]);
        expect(useInteractionStore.getState().selectedTags).toEqual([`tag${ID_SEPARATOR}a`]);
    });
});
