import { Arrow, Group, Text } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { UNSELECTED_STROKE_COLOR } from "@/configs/color";
import { computeLineGeometry, generateLoopPoints } from "@/models/geometry";
import { isNodeId, type Loop } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";

export function LoopView({ loop }: { loop: Loop }) {
    const loopGeometry = useGraphStore(
        useShallow((s) => {
            let totalX = 0;
            let totalY = 0;
            let sum = 0;
            const pathPoints: { x: number; y: number }[] = [];

            for (const edgeId of loop.edgeIds) {
                const edge = s.edges[edgeId];
                if (!edge) continue;

                const fromNode = isNodeId(edge.from) ? s.nodes[edge.from] : s.stocks[edge.from];
                const toNode = isNodeId(edge.to) ? s.nodes[edge.to] : s.stocks[edge.to];

                if (fromNode && toNode) {
                    const geo = computeLineGeometry(fromNode, toNode, edge.curvature);
                    totalX += geo.mid.x;
                    totalY += geo.mid.y;
                    pathPoints.push({ x: fromNode.x, y: fromNode.y });
                    pathPoints.push({ x: geo.mid.x, y: geo.mid.y });
                }
            }

            if (pathPoints.length === 0) return null;

            for (let i = 0; i < pathPoints.length; i++) {
                const current = pathPoints[i];
                const next = pathPoints[(i + 1) % pathPoints.length];
                sum += (next.x - current.x) * (next.y + current.y);
            }

            return {
                x: totalX / (pathPoints.length / 2),
                y: totalY / (pathPoints.length / 2),
                direction: sum > 0 ? "ccw" : "cw",
            };
        }),
    );

    if (!loopGeometry) return null;

    const loopPoints = generateLoopPoints(24, 14, 16);

    return (
        <Group x={loopGeometry.x} y={loopGeometry.y}>
            <Arrow
                points={loopPoints}
                stroke={UNSELECTED_STROKE_COLOR}
                fill={UNSELECTED_STROKE_COLOR}
                tension={0.5}
                pointerAtBeginning={loopGeometry.direction === "ccw"}
                pointerAtEnding={loopGeometry.direction === "cw"}
            />
            <Text
                text={"hi"}
                width={30}
                height={30}
                offsetX={15}
                offsetY={15}
                align="center"
                verticalAlign="middle"
                fontSize={12}
                fontStyle="bold"
            />
        </Group>
    );
}
