import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateEntity } from "@/actions/graph";
import { ID_SEPARATOR } from "@/models/graph";

import { type InteractionMode, useInteractionStore } from "./interaction";

vi.mock("@/actions/graph", () => ({
    updateEntity: vi.fn(),
}));

vi.mock("@/sync/id", () => ({
    getUsername: vi.fn(() => "test-user"),
}));

describe("useInteractionStore", () => {
    beforeEach(() => {
        useInteractionStore.setState({
            interactionMode: "select",
            selectedIds: [],
            selectedTags: [],
            inspectorOpen: false,
        });
        vi.clearAllMocks();
    });

    it("has correct initial state", () => {
        const state = useInteractionStore.getState();

        expect(state.interactionMode).toBe("select");
        expect(state.selectedIds).toEqual([]);
        expect(state.selectedTags).toEqual([]);
        expect(state.inspectorOpen).toBe(false);
    });

    it("sets interaction mode", () => {
        const mode: InteractionMode = "add-node";

        useInteractionStore.getState().setInteractionMode(mode);

        expect(useInteractionStore.getState().interactionMode).toBe("add-node");
    });

    it("toggles selected id on", () => {
        useInteractionStore.getState().toggleSelectId(`node${ID_SEPARATOR}1`);

        expect(useInteractionStore.getState().selectedIds).toEqual([`node${ID_SEPARATOR}1`]);
        expect(updateEntity).toHaveBeenCalledWith("node", `node${ID_SEPARATOR}1`, {
            selectedBy: "test-user",
        });
    });

    it("toggles selected id off if already selected", () => {
        useInteractionStore.setState({
            selectedIds: [`node${ID_SEPARATOR}1`],
        });

        useInteractionStore.getState().toggleSelectId(`node${ID_SEPARATOR}1`);

        expect(useInteractionStore.getState().selectedIds).toEqual([]);
        expect(updateEntity).toHaveBeenCalledWith("node", `node${ID_SEPARATOR}1`, {
            selectedBy: null,
        });
    });

    it("supports toggling multiple selected ids", () => {
        const store = useInteractionStore.getState();

        store.toggleSelectId(`node${ID_SEPARATOR}1`);
        store.toggleSelectId(`node${ID_SEPARATOR}2`);

        expect(useInteractionStore.getState().selectedIds).toEqual([
            `node${ID_SEPARATOR}1`,
            `node${ID_SEPARATOR}2`,
        ]);
        expect(updateEntity).toHaveBeenCalledWith("node", `node${ID_SEPARATOR}1`, {
            selectedBy: "test-user",
        });
        expect(updateEntity).toHaveBeenCalledWith("node", `node${ID_SEPARATOR}2`, {
            selectedBy: "test-user",
        });
    });

    it("clearSelectedIds calls toggleSelectId for each selectedId and clears them", () => {
        useInteractionStore.setState({
            selectedIds: [`node${ID_SEPARATOR}1`, `stock${ID_SEPARATOR}2`],
        });

        const toggleSpy = vi.spyOn(useInteractionStore.getState(), "toggleSelectId");

        useInteractionStore.getState().clearSelectedIds();

        expect(toggleSpy).toHaveBeenCalledWith(`node${ID_SEPARATOR}1`);
        expect(toggleSpy).toHaveBeenCalledWith(`stock${ID_SEPARATOR}2`);
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

    it("sets selectedBy to username when selecting and to null when deselecting", () => {
        const id = `node${ID_SEPARATOR}123`;

        useInteractionStore.getState().toggleSelectId(id);
        expect(updateEntity).toHaveBeenLastCalledWith("node", id, { selectedBy: "test-user" });

        useInteractionStore.getState().toggleSelectId(id);
        expect(updateEntity).toHaveBeenLastCalledWith("node", id, { selectedBy: null });
    });

    it("extracts entityType from id when toggling selection", () => {
        const edgeId = `edge${ID_SEPARATOR}5`;

        useInteractionStore.getState().toggleSelectId(edgeId);

        expect(updateEntity).toHaveBeenCalledWith("edge", edgeId, { selectedBy: "test-user" });
    });

    it("toggles inspectorOpen", () => {
        expect(useInteractionStore.getState().inspectorOpen).toBe(false);

        useInteractionStore.getState().toggleInspectorOpen();
        expect(useInteractionStore.getState().inspectorOpen).toBe(true);

        useInteractionStore.getState().toggleInspectorOpen();
        expect(useInteractionStore.getState().inspectorOpen).toBe(false);
    });
});
