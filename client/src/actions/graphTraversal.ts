import type { Flow, Node, Stock } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";

export function getParentEntities(startId: string): Array<Node | Flow | Stock> {
    const state = useGraphStore.getState();
    const visited = new Set<string>();
    const parents: Array<Node | Flow | Stock> = [];

    const queue: string[] = [startId];

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (visited.has(currentId)) continue;
        visited.add(currentId);

        const incomingEdges = Object.values(state.edges).filter((edge) => edge.to === currentId);

        for (const edge of incomingEdges) {
            const sourceId = edge.from;
            if (visited.has(sourceId)) continue;

            const entity = state.nodes[sourceId] ?? state.flows[sourceId] ?? state.stocks[sourceId];

            if (entity) {
                parents.push(entity);
                queue.push(entity.id);
            }
        }
    }
    const uniqueParents = Array.from(new Map(parents.map((p) => [p.id, p])).values());
    return uniqueParents;
}
