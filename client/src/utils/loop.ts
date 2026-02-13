import { type Edge, type LoopPolarity } from "@/models/graph";

type DetectedCycle = {
    edgeIds: string[];
    polarity: LoopPolarity;
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
                    polarity: computeLoopPolarity(fullCycle),
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

function computeLoopPolarity(edges: Edge[]): LoopPolarity {
    if (edges.some((e) => e.polarity == null)) return "";

    const negativeCount = edges.filter((e) => e.polarity === "-").length;

    return negativeCount % 2 === 0 ? "R" : "B";
}
