import { useEffect } from "react";

import { useInteractionStore } from "@/stores/interaction";
import { useCommands } from "./command";

export function useKeyboardShortcuts() {
    const { setInteractionMode, toggleInspectorOpen } = useInteractionStore();
    const { deleteSelectedIds, cancelSelection } = useCommands();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // commands from anywhere
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case "\\":
                        e.preventDefault();
                        toggleInspectorOpen();
                        break;
                }
            }

            const isTyping =
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement).isContentEditable;

            if (isTyping) return;

            // should ignore these commands if inside text box
            switch (e.key) {
                case "Escape":
                    cancelSelection();
                    setInteractionMode("select");
                    break;
                case "Delete":
                    deleteSelectedIds();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [deleteSelectedIds, cancelSelection, setInteractionMode]);
}
