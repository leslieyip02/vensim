import { Circle, Group, Text } from "react-konva";

import { useGraphStore } from "../../stores/graph";
import { useInteractionStore } from "../../stores/interaction";
import { snapToGrid } from "@/models/geometry";

export const NODE_RADIUS = 32;
export const NODE_DIAMETER = NODE_RADIUS * 2;

export function NodeView({ nodeId }: { nodeId: string }) {
    const node = useGraphStore((s) => s.nodes[nodeId]);
    if (!node) {
        return;
    }

    const { addEdge, updateNode } = useGraphStore((s) => s);

    const { selectedIds, selectId, clearSelectedIds, interactionMode } = useInteractionStore((s) => s);
    const isSelected = selectedIds.includes(nodeId);

    return (
        <Group
            x={node.x}
            y={node.y}
            draggable
            dragBoundFunc={(pos) => pos}
            onClick={() => {
                selectId(node.id);

                if (interactionMode !== "add-edge") {
                    return;
                }

                if (selectedIds.length !== 1 || !selectedIds.every((id) => id.startsWith("node"))) {
                    return;
                }

                const from = selectedIds[0];
                addEdge(from, node.id);
                clearSelectedIds();
            }}
            onDragEnd={(e) => {
                const position = snapToGrid({ x: e.target.x(), y: e.target.y() });
                e.target.position(position);

                updateNode(nodeId, {
                    ...position,
                    fixed: true,
                });
            }}
        >
            <Circle
                radius={NODE_RADIUS}
                fill="#ffffff"
                stroke={isSelected ? "#ff0000" : "#111111"}
            />

            <Text
                text={node.label}
                width={NODE_DIAMETER}
                height={NODE_DIAMETER}
                align="center"
                verticalAlign="middle"
                x={-NODE_RADIUS}
                y={-NODE_RADIUS}
                fontSize={12}
                wrap="word"
            />
        </Group>
    );
}
