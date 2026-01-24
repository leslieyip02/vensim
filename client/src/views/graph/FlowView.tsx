import type { Context } from "konva/lib/Context";
import { Group, Shape } from "react-konva";

import { useGraphStore } from "../../stores/graph";
import { computeLineGeometry} from "@/models/geometry";
import { useFlowInteractions } from "@/controllers/interaction";

export function FlowView({ flowId }: { flowId: string }) {
    const flow = useGraphStore((s) => s.flows[flowId]);
    const stock = useGraphStore((s) => s.stocks[flow?.stockId ?? ""]);
    const cloud = useGraphStore((s) => s.clouds[flow?.cloudId ?? ""]);

    if (!flow || !stock || !cloud) {
        return null;
    }

    const from = flow.type === "inflow" ? cloud : stock;
    const to = flow.type === "inflow" ? stock : cloud;

    const { start, end, controlPoint, mid, arrow } = computeLineGeometry(from, to, flow.curvature);
    const { stroke, opacity, onClick } = useFlowInteractions(flow.id);

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

    function hit(ctx: Context, shape: any) {
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, end.x, end.y);
        ctx.strokeShape(shape);
    }

    return (
        <Group opacity={opacity}>
            <Shape sceneFunc={draw} hitFunc={hit} onClick={onClick} stroke={stroke} strokeWidth={8} />
        </Group>
    );
}