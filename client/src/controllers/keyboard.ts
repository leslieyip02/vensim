import { useInteractionStore } from "@/stores/interaction";
import { useEffect } from "react";

export function useKeyboardShortcuts() {
    const { setInteractionMode, clearSelectedIds } = useInteractionStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isTyping = 
                e.target instanceof HTMLInputElement || 
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement).isContentEditable;

            if (isTyping) return;

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