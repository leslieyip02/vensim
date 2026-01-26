import type { Context } from "konva/lib/Context";
import type { Shape, ShapeConfig } from "konva/lib/Shape";
import { Group, Shape as ShapeDiv } from "react-konva";

import { useCloudInteractions } from "@/controllers/interaction";
import type { Cloud } from "@/models/graph";

export function CloudView({ cloud }: { cloud: Cloud }) {
    const { stroke, opacity, onClick, onDragEnd } = useCloudInteractions(cloud.id);
    const { radius } = cloud;

    function buildCloudPath(ctx: Context) {
        const steps = 64;
        const rotation = Math.PI / 4;

        ctx.beginPath();

        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * Math.PI * 2;

            const r = radius * (1 + 0.25 * Math.cos(4 * (t + rotation)));

            const x = r * Math.cos(t);
            const y = r * Math.sin(t);

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.closePath();
    }

    function draw(ctx: Context) {
        ctx.strokeStyle = stroke;
        ctx.fillStyle = "white";
        ctx.lineWidth = 2;

        buildCloudPath(ctx);
        ctx.stroke();
    }

    function hit(ctx: Context, shape: Shape<ShapeConfig>) {
        ctx.lineWidth = 8;

        buildCloudPath(ctx);
        ctx.strokeShape(shape);
        ctx.fillShape(shape);
    }

    return (
        <Group
            x={cloud.x}
            y={cloud.y}
            draggable
            dragBoundFunc={(pos) => pos}
            onClick={onClick}
            onDragEnd={onDragEnd}
            opacity={opacity}
        >
            <ShapeDiv
                sceneFunc={draw}
                hitFunc={hit}
                stroke={stroke}
            />
        </Group>
    );
}