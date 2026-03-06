import { type Edge, type LoopType } from "@/models/graph";

type DetectedLoop = {
    edgeIds: string[];
};

export function getLoopsFromEdges(edges: Edge[]): DetectedLoop[] {
    const outgoing = new Map<string, Edge[]>();
    edges.forEach((e) => {
        if (!outgoing.has(e.from)) outgoing.set(e.from, []);
        outgoing.get(e.from)!.push(e);
    });

    const loops: DetectedLoop[] = [];
    const visited = new Set<string>();

    function findLoops(nodeId: string, path: Edge[], nodesOnPath: Set<string>) {
        visited.add(nodeId);
        nodesOnPath.add(nodeId);

        const neighbors = outgoing.get(nodeId) ?? [];
        for (const edge of neighbors) {
            if (nodesOnPath.has(edge.to)) {
                const loopStartIndex = path.findIndex((e) => e.from === edge.to);
                const loopEdges = [...path.slice(loopStartIndex), edge];

                loops.push({
                    edgeIds: loopEdges.map((e) => e.id),
                });
            } else if (!visited.has(edge.to)) {
                findLoops(edge.to, [...path, edge], nodesOnPath);
            }
        }
        nodesOnPath.delete(nodeId);
    }

    const allNodeIds = new Set(edges.flatMap((e) => [e.from, e.to]));
    allNodeIds.forEach((nodeId) => {
        if (!visited.has(nodeId)) {
            findLoops(nodeId, [], new Set());
        }
    });

    return loops;
}

export function detectLoop(
    existingEdges: Record<string, Edge>,
    newPartialEdge: Partial<Edge>,
    newEdgeId: string,
): DetectedLoop | null {
    const tempNewEdge: Edge = {
        id: newEdgeId,
        from: newPartialEdge.from!,
        to: newPartialEdge.to!,
        polarity: newPartialEdge.polarity ?? null,
        curvature: newPartialEdge.curvature ?? 0,
    };

    const tempAllEdges = [...Object.values(existingEdges), tempNewEdge];

    const loops = getLoopsFromEdges(tempAllEdges);
    return loops.find((l) => l.edgeIds.includes(newEdgeId)) ?? null;
}

export function computeLoopPolarity(edges: Edge[]): LoopType {
    if (edges.some((e) => e.polarity == null)) return null;

    const negativeCount = edges.filter((e) => e.polarity === "-").length;

    return negativeCount % 2 === 0 ? "R" : "B";
}
