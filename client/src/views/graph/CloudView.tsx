import { Circle, Group, Text } from "react-konva";

import { useGraphStore } from "../../stores/graph";
import { useCloudInteractions } from "@/controllers/interaction";

export function CloudView({ cloudId }: { cloudId: string }) {
    const cloud = useGraphStore((s) => s.clouds[cloudId]);
    if (!cloud) {
        return null;
    }

    const { stroke, opacity, onClick, onDragEnd } = useCloudInteractions(cloud.id);

    return (
        <Group
            x={cloud.x}
            y={cloud.y}
            draggable
            dragBoundFunc={(position) => position}
            onClick={onClick}
            onDragEnd={onDragEnd}
            opacity={opacity}
        >
            <Circle radius={cloud.radius} fill="#add8e6" stroke={stroke} />
            <Text
                text={cloud.label}
                width={cloud.radius * 2}
                height={cloud.radius * 2}
                align="center"
                verticalAlign="middle"
                x={-cloud.radius}
                y={-cloud.radius}
                fontSize={12}
                wrap="word"
            />
        </Group>
    );
}
