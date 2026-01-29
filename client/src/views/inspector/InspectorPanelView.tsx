import { Fragment, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { LuPanelLeftClose } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { InspectorFormView } from "./form/InspectorFormView";
import { TagSelectorView } from "./tag/TagSelectorView";

export function InspectorPanelView() {
    const [open, setOpen] = useState(false);

    const sections = [<InspectorFormView key="form" />, <TagSelectorView key="tags" />];

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-100 h-screen bg-background border-r shadow-sm",
                "w-96 transition-transform duration-200 ease-in-out",
                open ? "translate-x-0" : "-translate-x-full",
            )}
        >
            <Button
                size="icon-lg"
                variant="ghost"
                onClick={() => setOpen((o) => !o)}
                className="absolute top-2 right-[-3rem] z-50"
            >
                {open ? <LuPanelLeftClose /> : <AiOutlineEdit />}
            </Button>

            <div className="h-full overflow-y-auto p-4 flex flex-col">
                {sections.map((section, i) => (
                    <Fragment key={i}>
                        {section}
                        {i < sections.length - 1 && <Separator className="my-4" />}
                    </Fragment>
                ))}
            </div>
        </aside>
    );
}
