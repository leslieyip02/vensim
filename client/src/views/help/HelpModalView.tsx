import { useState } from "react";
import { LuCircleHelp } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function HelpModalView() {
    const [isOpen, setIsOpen] = useState(false);

    const shortcuts = [
        { keys: ["Ctrl", "\\"], description: "Toggle Inspector Sidebar" },
        { keys: ["Esc"], description: "Clear Selection & Select Mode" },
        { keys: ["Del"], description: "Delete Selected Items" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-8 right-8 z-100 w-10 h-10"
                >
                    <LuCircleHelp className="w-5 h-5" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] z-100">
                <DialogHeader>
                    <DialogTitle className="text-xl">Keyboard Shortcuts</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {shortcuts.map((s, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between border-b pb-2 last:border-0"
                        >
                            <span className="text-sm text-muted-foreground font-medium">
                                {s.description}
                            </span>
                            <div className="flex gap-1">
                                {s.keys.map((key) => (
                                    <kbd
                                        key={key}
                                        className="pointer-events-none inline-flex h-7 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-bold opacity-100"
                                    >
                                        {key === "\\" ? " \u005C " : key}
                                    </kbd>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
