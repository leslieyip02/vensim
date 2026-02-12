import { useInteractionStore } from "@/stores/interaction";
import { useEffect } from "react";

export function useKeyboardShortcuts() {
    const { setInteractionMode, clearSelectedIds, toggleInspectorOpen } = useInteractionStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ctrl + ... commands
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
            
            // single key commands, should ignore if typing
            switch (e.key) {
                case "Escape":
                    clearSelectedIds();
                    setInteractionMode("select");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [clearSelectedIds, setInteractionMode]);
}