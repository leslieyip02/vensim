import { Circle, Group, Text } from "react-konva";

import { useGraphStore } from "../../stores/graph";
import { useNodeInteractions } from "@/controllers/interaction";

export function NodeView({ nodeId }: { nodeId: string }) {
    const node = useGraphStore((s) => s.nodes[nodeId]);
    if (!node) {
        return null;
    }

    const { isSelected, opacity, onClick, onDragEnd } = useNodeInteractions(node.id);

    return (
        <Group
            x={node.x}
            y={node.y}
            draggable
            dragBoundFunc={(position) => position}
            onClick={onClick}
            onDragEnd={onDragEnd}
            opacity={opacity}
        >
            <Circle
                radius={node.radius}
                fill="#ffffff"
                stroke={isSelected ? "#ff0000" : "#111111"}
            />
            <Text
                text={node.label}
                width={node.radius * 2}
                height={node.radius * 2}
                align="center"
                verticalAlign="middle"
                x={-node.radius}
                y={-node.radius}
                fontSize={12}
                wrap="word"
            />
        </Group>
    );
}
