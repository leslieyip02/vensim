import { Circle, Group, Text } from "react-konva";

import { useNodeInteractions } from "@/controllers/interaction";
import type { Node } from "@/models/graph";

export function NodeView({ node }: { node: Node }) {
    const { isSelectedByOther, stroke, opacity, onClick, onDragEnd } = useNodeInteractions(node.id);

    return (
        <Group
            x={node.x}
            y={node.y}
            draggable={!isSelectedByOther}
            dragBoundFunc={(position) => position}
            onClick={(e) => onClick(e.evt)}
            onDragEnd={onDragEnd}
            opacity={opacity}
        >
            <Circle radius={node.radius} fill="#ffffff" stroke={stroke} />
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
