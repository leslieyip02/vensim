import { useGraphStore } from "@/stores/graph";

import { CloudView } from "./CloudView";
import { EdgeView } from "./EdgeView";
import { FlowView } from "./FlowView";
import { LoopView } from "./LoopView";
import { NodeView } from "./NodeView";
import { StockView } from "./StockView";

export function GraphView() {
    const nodes = Object.values(useGraphStore((s) => s.nodes));
    const edges = Object.values(useGraphStore((s) => s.edges));
    const stocks = Object.values(useGraphStore((s) => s.stocks));
    const clouds = Object.values(useGraphStore((s) => s.clouds));
    const flows = Object.values(useGraphStore((s) => s.flows));
    const loops = Object.values(useGraphStore((s) => s.loops));

    return (
        <>
            {nodes.map((node) => (
                <NodeView key={node.id} node={node} />
            ))}
            {edges.map((edge) => (
                <EdgeView key={edge.id} edge={edge} />
            ))}
            {stocks.map((stock) => (
                <StockView key={stock.id} stock={stock} />
            ))}
            {clouds.map((cloud) => (
                <CloudView key={cloud.id} cloud={cloud} />
            ))}
            {flows.map((flow) => (
                <FlowView key={flow.id} flow={flow} />
            ))}
            {loops.map((loop) => (
                <LoopView key={loop.id} loop={loop} />
            ))}
        </>
    );
}
