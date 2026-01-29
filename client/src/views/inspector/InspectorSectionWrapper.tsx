import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface InspectorSectionProps {
    label: string;
    children: ReactNode;
}

export function InspectorSectionWrapper({ label, children }: InspectorSectionProps) {
    return (
        <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger className="flex flex-row w-full">
                <h2 className="text-lg font-medium">{label}</h2>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">{children}</CollapsibleContent>
        </Collapsible>
    );
}
