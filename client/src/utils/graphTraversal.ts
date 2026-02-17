import { type Flow, isStockId, type Node, type Stock } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";

export function getParentEntities(id: string): Array<Node | Flow | Stock> {
    const state = useGraphStore.getState();
    const parentSet: Set<Node | Flow | Stock> = new Set<Node | Flow | Stock>();

    const thisEntity = state.nodes[id] ?? state.flows[id] ?? state.stocks[id];

    if (isStockId(id)) {
        const incomingFlows = Object.values(state.flows).filter((flow) => flow.to === id);
        // Not a parent but referenced in equation
        const outgoingFlows = Object.values(state.flows).filter((flow) => flow.from === id);
        incomingFlows.forEach((flow) => parentSet.add(flow));
        outgoingFlows.forEach((flow) => parentSet.add(flow));
        parentSet.add(thisEntity);
        return [...parentSet];
    }

    const incomingEdges = Object.values(state.edges).filter((edge) => edge.to === id);
    for (const edge of incomingEdges) {
        const sourceId = edge.from;
        const entity = state.nodes[sourceId] ?? state.flows[sourceId] ?? state.stocks[sourceId];
        if (entity) {
            parentSet.add(entity);
        }
    }

    parentSet.delete(thisEntity);
    return [...parentSet];
}
