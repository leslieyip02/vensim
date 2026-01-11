import { GRID_STROKE_COLOR } from "@/configs/color";
import { Line } from "react-konva";

export const GRID_SIZE = 64;

export function GridView() {
    const lines = [];
    const extent = 3200;

    for (let i = -extent; i <= extent; i += GRID_SIZE) {
        lines.push(
            <Line
                listening={false}
                key={`v${i}`}
                points={[i, -extent, i, extent]}
                stroke={GRID_STROKE_COLOR}
            />,
            <Line
                listening={false}
                key={`h${i}`}
                points={[-extent, i, extent, i]}
                stroke={GRID_STROKE_COLOR}
            />,
        );
    }

    return <>{lines}</>;
}
