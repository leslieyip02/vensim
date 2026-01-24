import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useInteractionStore, type InteractionMode } from "@/stores/interaction";

import { LuArrowUpRight, LuCircle, LuMousePointer2, LuRectangleHorizontal, LuWaves, LuChevronsRight } from "react-icons/lu";

export function ToolbarView() {
    const { interactionMode, setInteractionMode } = useInteractionStore((s) => s);

    const SelectButton = () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <ToggleGroupItem
                    value="select"
                    className={interactionMode === "select" ? "bg-input" : ""}
                >
                    <LuMousePointer2 />
                </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
                <p>Select</p>
            </TooltipContent>
        </Tooltip>
    );

    const AddNodeButton = () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <ToggleGroupItem
                    value="add-node"
                    className={interactionMode === "add-node" ? "bg-input" : ""}
                >
                    <LuCircle />
                </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add Node</p>
            </TooltipContent>
        </Tooltip>
    );

    const AddEdgeButton = () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <ToggleGroupItem
                    value="add-edge"
                    className={interactionMode === "add-edge" ? "bg-input" : ""}
                >
                    <LuArrowUpRight />
                </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add Edge</p>
            </TooltipContent>
        </Tooltip>
    );

    const AddStockButton = () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <ToggleGroupItem
                    value="add-stock"
                    className={interactionMode === "add-stock" ? "bg-input" : ""}
                >
                    <LuRectangleHorizontal />
                </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add Stock</p>
            </TooltipContent>
        </Tooltip>
    );

    const AddCloudButton = () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <ToggleGroupItem
                    value="add-cloud"
                    className={interactionMode === "add-cloud" ? "bg-input" : ""}
                >
                    <LuWaves />
                </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add Cloud</p>
            </TooltipContent>
        </Tooltip>
    );

    const AddFlowButton = () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <ToggleGroupItem
                    value="add-flow"
                    className={interactionMode === "add-flow" ? "bg-input" : ""}
                >
                    <LuChevronsRight />
                </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add Flow</p>
            </TooltipContent>
        </Tooltip>
    );

    return (
        <div className="absolute w-full h-full flex flex-col items-center justify-end">
            <ToggleGroup
                type="single"
                className="border-b bg-background drop-shadow px-1 py-1 mb-5 z-100"
                value={interactionMode}
                onValueChange={(v) => {
                    v && setInteractionMode(v as InteractionMode);
                }}
            >
                <SelectButton />
                <AddNodeButton />
                <AddEdgeButton />
                <AddStockButton />
                <AddCloudButton />
                <AddFlowButton />
            </ToggleGroup>
        </div>
    );
}
