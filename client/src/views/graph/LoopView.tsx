import { Arrow, Circle, Group, Text } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { useLoopInteractions } from "@/controllers/interaction";
import { computeLineGeometry, generateLoopPoints } from "@/models/geometry";
import { isNodeId, type Loop } from "@/models/graph";
import { useGraphStore } from "@/stores/graph";

export function LoopView({ loop }: { loop: Loop }) {
    const { isSelectedByOther, stroke, opacity, onClick, onDragEnd } = useLoopInteractions(loop.id);

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

            const centerX = totalX / (pathPoints.length / 2);
            const centerY = totalY / (pathPoints.length / 2);
            const avgRadius =
                pathPoints.reduce(
                    (acc, p) => acc + Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2),
                    0,
                ) / pathPoints.length;

            for (let i = 0; i < pathPoints.length; i++) {
                const current = pathPoints[i];
                const next = pathPoints[(i + 1) % pathPoints.length];
                sum += (next.x - current.x) * (next.y + current.y);
            }

            return {
                centerX,
                centerY,
                direction: sum > 0 ? "ccw" : "cw",
                avgRadius,
            };
        }),
    );

    if (!loopGeometry) return null;

    const radius = 24;
    const loopPoints = generateLoopPoints(radius, 14, 16);

    const actualX = loopGeometry.centerX + loop.relX * loopGeometry.avgRadius;
    const actualY = loopGeometry.centerY + loop.relY * loopGeometry.avgRadius;

    return (
        <Group
            x={actualX}
            y={actualY}
            draggable={!isSelectedByOther}
            dragBoundFunc={(position) => position}
            onClick={onClick}
            onDragEnd={(e) => {
                onDragEnd(e, loopGeometry.centerX, loopGeometry.centerY, loopGeometry.avgRadius);
            }}
            opacity={opacity}
        >
            <Circle radius={radius} />
            <Arrow
                points={loopPoints}
                stroke={stroke}
                fill={stroke}
                tension={0.5}
                pointerAtBeginning={loopGeometry.direction === "ccw"}
                pointerAtEnding={loopGeometry.direction === "cw"}
            />
            {loop.loopType ? (
                <>
                    <Text
                        text={loop.loopType ?? ""}
                        width={20}
                        height={20}
                        offsetX={10}
                        offsetY={10}
                        align="center"
                        verticalAlign="middle"
                        fontSize={16}
                        fontStyle="bold"
                    />
                    <Text
                        text={loop.label}
                        width={14}
                        height={14}
                        align="right"
                        verticalAlign="bottom"
                        fontStyle="bold"
                    />
                </>
            ) : (
                <Text
                    text={loop.label}
                    width={20}
                    height={20}
                    offsetX={10}
                    offsetY={10}
                    align="center"
                    verticalAlign="middle"
                    fontSize={16}
                />
            )}
        </Group>
    );
}
