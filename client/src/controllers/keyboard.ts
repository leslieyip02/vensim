import { useInteractionStore } from "@/stores/interaction";
import { useEffect } from "react";

export function useKeyboardShortcuts() {
    const { setInteractionMode, clearSelectedIds } = useInteractionStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
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