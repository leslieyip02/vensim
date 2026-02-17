import { type Flow, type Node } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";

export function getParentEntities(id: string): Array<Node | Flow> {
    const state = useGraphStore.getState();
    const parentSet: Set<Node | Flow> = new Set<Node | Flow>();

    const thisEntity = state.nodes[id] ?? state.flows[id] ?? state.stocks[id];

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
