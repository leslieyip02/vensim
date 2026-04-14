import { Fragment, useState } from "react";
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
        { keys: ["Ctrl / ⌘", "\\"], description: "Toggle Inspector Sidebar" },
        { keys: ["+"], description: "Set Selected Edges' Polarity to Positive" },
        { keys: ["-"], description: "Set Selected Edges' Polarity to Negative" },
        { keys: ["Esc"], description: "Clear Selection & Select Mode" },
        { keys: ["Del / ⌫"], description: "Delete Selected Items" },
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
                            <div className="flex items-center gap-1.5">
                                {s.keys.map((key, index) => (
                                    <Fragment key={key}>
                                        <kbd className="pointer-events-none inline-flex min-w-[1.75rem] h-7 select-none items-center justify-center rounded border bg-muted px-1.5 font-mono text-[10px] font-bold opacity-100">
                                            {key === "\\" ? "\u005C" : key}
                                        </kbd>
                                        {index < s.keys.length - 1 && (
                                            <span className="text-muted-foreground text-xs">+</span>
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
