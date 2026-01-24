import type { Context } from "konva/lib/Context";
import type { Shape, ShapeConfig } from "konva/lib/Shape";
import { Group, Shape as ShapeDiv } from "react-konva";

import { useFlowInteractions } from "@/controllers/interaction";
import { computeLineGeometry } from "@/models/geometry";
import type { Flow } from "@/models/graph";

import { useGraphStore } from "../../stores/graph";

export function FlowView({ flow }: { flow: Flow }) {
    const { stroke, opacity, onClick } = useFlowInteractions(flow.id);

    const stock = useGraphStore((s) => s.stocks[flow?.stockId ?? ""]);
    const cloud = useGraphStore((s) => s.clouds[flow?.cloudId ?? ""]);
    if (!stock || !cloud) {
        return null;
    }

    const from = flow.type === "inflow" ? cloud : stock;
    const to = flow.type === "inflow" ? stock : cloud;

    const { start, end, controlPoint, mid, arrow } = computeLineGeometry(from, to, flow.curvature);

    function draw(ctx: Context) {
        ctx.strokeStyle = stroke;
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = 8;

        // tail
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, end.x, end.y);
        ctx.stroke();

        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.lineWidth = 6;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, end.x, end.y);
        ctx.stroke();

        // head
        ctx.strokeStyle = stroke;
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(arrow.tip.x, arrow.tip.y);
        ctx.lineTo(arrow.left.x, arrow.left.y);
        ctx.lineTo(arrow.right.x, arrow.right.y);
        ctx.closePath();
        ctx.fill();

        // valve
        ctx.fillStyle = "white";
        const dx = 10;
        const dy = 12;

        ctx.beginPath();
        ctx.moveTo(mid.x, mid.y);
        ctx.lineTo(mid.x - dx, mid.y - dy);
        ctx.lineTo(mid.x + dx, mid.y - dy);
        ctx.lineTo(mid.x, mid.y);
        ctx.lineTo(mid.x - dx, mid.y + dy);
        ctx.lineTo(mid.x + dx, mid.y + dy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fill();
        ctx.stroke();
    }

    function hit(ctx: Context, shape: Shape<ShapeConfig>) {
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, end.x, end.y);
        ctx.strokeShape(shape);
    }

    return (
        <Group opacity={opacity}>
            <ShapeDiv
                sceneFunc={draw}
                hitFunc={hit}
                onClick={onClick}
                stroke={stroke}
                strokeWidth={8}
            />
        </Group>
    );
}
