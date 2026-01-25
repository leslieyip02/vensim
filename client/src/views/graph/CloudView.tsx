import { Circle, Group } from "react-konva";

import { useCloudInteractions } from "@/controllers/interaction";
import type { Cloud } from "@/models/graph";

export function CloudView({ cloud }: { cloud: Cloud }) {
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
        </Group>
    );
}
