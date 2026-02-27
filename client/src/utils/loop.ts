import { type Edge, type LoopType } from "@/models/graph";

type DetectedCycle = {
    edgeIds: string[];
    loopType: LoopType;
};

export function detectCycleFromEdge(
    edges: Record<string, Edge>,
    newEdge: Edge,
): DetectedCycle | null {
    const outgoing = new Map<string, Edge[]>();
    const currentEdges = Object.values(edges);

    currentEdges.forEach((e) => {
        if (!outgoing.has(e.from)) {
            outgoing.set(e.from, []);
        }
        outgoing.get(e.from)!.push(e);
    });

    const visitedNodes = new Set<string>();
    const stackEdges: Edge[] = [];
    let found: DetectedCycle | null = null;

    function dfs(nodeId: string) {
        if (found) return;
        visitedNodes.add(nodeId);

        const nextEdges = outgoing.get(nodeId) ?? [];

        for (const e of nextEdges) {
            stackEdges.push(e);

            if (e.to === newEdge.from) {
                const fullCycle = [...stackEdges, newEdge];
                found = {
                    edgeIds: fullCycle.map((se) => se.id),
                    loopType: computeLoopPolarity(fullCycle),
                };
                return;
            }

            if (!visitedNodes.has(e.to)) {
                dfs(e.to);
                if (found) return;
            }

            stackEdges.pop();
        }
    }

    dfs(newEdge.to);

    return found;
}

export function computeLoopPolarity(edges: Edge[]): LoopType {
    if (edges.some((e) => e.polarity == null)) return null;

    const negativeCount = edges.filter((e) => e.polarity === "-").length;

    return negativeCount % 2 === 0 ? "R" : "B";
}
