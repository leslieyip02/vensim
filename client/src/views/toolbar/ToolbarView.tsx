import ClickerIcon from "@/assets/clicker.svg?react";
import CloudIcon from "@/assets/cloud.svg?react";
import EdgeIcon from "@/assets/edge.svg?react";
import FlowIcon from "@/assets/flow.svg?react";
import NodeIcon from "@/assets/node.svg?react";
import StockIcon from "@/assets/stock.svg?react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type InteractionMode, useInteractionStore } from "@/stores/interaction";

interface ButtonProps {
    interactionMode: InteractionMode;
}

const SelectButton = ({ interactionMode }: ButtonProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <ToggleGroupItem
                value="select"
                className={interactionMode === "select" ? "bg-input" : ""}
            >
                <ClickerIcon />
            </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
            <p>Select</p>
        </TooltipContent>
    </Tooltip>
);

const AddNodeButton = ({ interactionMode }: ButtonProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <ToggleGroupItem
                value="add-node"
                className={interactionMode === "add-node" ? "bg-input" : ""}
            >
                <NodeIcon />
            </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
            <p>Add Node</p>
        </TooltipContent>
    </Tooltip>
);

const AddEdgeButton = ({ interactionMode }: ButtonProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <ToggleGroupItem
                value="add-edge"
                className={interactionMode === "add-edge" ? "bg-input" : ""}
            >
                <EdgeIcon />
            </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
            <p>Add Edge</p>
        </TooltipContent>
    </Tooltip>
);

const AddStockButton = ({ interactionMode }: ButtonProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <ToggleGroupItem
                value="add-stock"
                className={interactionMode === "add-stock" ? "bg-input" : ""}
            >
                <StockIcon />
            </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
            <p>Add Stock</p>
        </TooltipContent>
    </Tooltip>
);

const AddCloudButton = ({ interactionMode }: ButtonProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <ToggleGroupItem
                value="add-cloud"
                className={interactionMode === "add-cloud" ? "bg-input" : ""}
            >
                <CloudIcon />
            </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
            <p>Add Cloud</p>
        </TooltipContent>
    </Tooltip>
);

const AddFlowButton = ({ interactionMode }: ButtonProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <ToggleGroupItem
                value="add-flow"
                className={interactionMode === "add-flow" ? "bg-input" : ""}
            >
                <FlowIcon />
            </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
            <p>Add Flow</p>
        </TooltipContent>
    </Tooltip>
);

export function ToolbarView() {
    const { interactionMode, setInteractionMode } = useInteractionStore((s) => s);

    return (
        <div className="absolute w-full h-full flex flex-col items-center justify-end">
            <ToggleGroup
                type="single"
                className="border-b bg-background drop-shadow px-1 py-1 mb-5 z-100"
                value={interactionMode}
                onValueChange={(v) => {
                    if (v) {
                        setInteractionMode(v as InteractionMode);
                    }
                }}
            >
                <SelectButton interactionMode={interactionMode} />
                <AddNodeButton interactionMode={interactionMode} />
                <AddEdgeButton interactionMode={interactionMode} />
                <AddStockButton interactionMode={interactionMode} />
                <AddCloudButton interactionMode={interactionMode} />
                <AddFlowButton interactionMode={interactionMode} />
            </ToggleGroup>
        </div>
    );
}
