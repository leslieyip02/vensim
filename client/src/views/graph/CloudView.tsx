import { Circle, Group } from "react-konva";

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
        </Group>
    );
}
