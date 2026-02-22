import { Arrow, Group, Rect, Text } from "react-konva";

import { getPaletteColor } from "@/configs/color";
import { useCursorStore } from "@/stores/cursor";
import { useInteractionStore } from "@/stores/interaction";
import { getClientId } from "@/sync/id";

function getColor(name: string) {
    // HACK: pick a color based on the name
    let index = 0;
    for (let i = 0; i < name.length; i++) {
        index += name.charCodeAt(i);
    }
    return getPaletteColor(index);
}

export function CursorView() {
    const cursors = useCursorStore((s) => s.cursors);
    const interactionmode = useInteractionStore((s) => s.interactionMode);

    return (
        <>
            {Object.entries(cursors).map(([id, cursor]) => {
                const color = getColor(cursor.username);

                return (
                    <Group key={id} x={cursor.x} y={cursor.y} listening={false}>
                        {id === getClientId() && interactionmode !== "select" ? (
                            <>
                                <Rect x={-6} y={-2} width={12} height={4} fill={color} />
                                <Rect x={-2} y={-6} width={4} height={12} fill={color} />
                            </>
                        ) : (
                            <Arrow
                                x={0}
                                y={0}
                                points={[4, 13, 0, 0]}
                                pointerLength={8}
                                pointerWidth={8}
                                fill={color}
                                stroke={color}
                                strokeWidth={2}
                            />
                        )}
                        <Text x={16} text={cursor.username} fill={color} />
                    </Group>
                );
            })}
        </>
    );
}
