import { Circle, Group, Text } from "react-konva";

import { useGraphStore } from "../../stores/graph";
import { useNodeInteractions } from "@/controllers/interaction";

export const NODE_RADIUS = 32;
export const NODE_DIAMETER = NODE_RADIUS * 2;

export function NodeView({ nodeId }: { nodeId: string }) {
    const node = useGraphStore((s) => s.nodes[nodeId]);
    if (!node) {
        return null;
    }

    const { isSelected, onClick, onDragEnd } = useNodeInteractions(node.id);

    return (
        <Group
            x={node.x}
            y={node.y}
            draggable
            dragBoundFunc={(pos) => pos}
            onClick={onClick}
            onDragEnd={onDragEnd}
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
