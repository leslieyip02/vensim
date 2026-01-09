import type { Context } from "konva/lib/Context";
import { Shape, Text } from "react-konva";

import { useGraphStore } from "../../stores/graph";
import { useInteractionStore } from "@/stores/interaction";
import {
    arrowHeadLeftRight,
    insetEndpoints,
    interpolateQuadraticBezier,
    normalize,
} from "@/models/geometry";

export function EdgeView({ edgeId }: { edgeId: string }) {
    const edge = useGraphStore((s) => s.edges[edgeId]);
    if (!edge) {
        return;
    }

    const { selectedIds, selectId } = useInteractionStore((s) => s);
    const isSelected = selectedIds.includes(edge.id);

    const a = useGraphStore((s) => s.nodes[edge.from]);
    const b = useGraphStore((s) => s.nodes[edge.to]);
    if (!a || !b) {
        return;
    }
    const [ax, ay, cx, cy, bx, by] = interpolateQuadraticBezier(a, b);

    const startInset = 32; // source node radius
    const endInset = 32; // target node radius
    const [start, end] = insetEndpoints(a, b, { x: cx, y: cy }, startInset, endInset);

    const dx = bx - cx;
    const dy = by - cy;
    const arrowInset = 32; // node radius
    const nx = normalize({ x: dx, y: dy });

    const arrowX = bx - nx.x * arrowInset;
    const arrowY = by - nx.y * arrowInset;

    const perp = normalize({ x: -dy, y: dx });
    const offset = 12;
    const labelX = arrowX - dx * 0.1 + perp.x * offset;
    const labelY = arrowY - dy * 0.1 + perp.y * offset;

    function drawArrowTail(ctx: Context) {
        ctx.fillStyle = isSelected ? "#ff0000" : "#000000";
        ctx.strokeStyle = isSelected ? "#ff0000" : "#000000";

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(cx, cy, end.x, end.y);
        ctx.stroke();
    }

    function drawArrowHead(ctx: Context) {
        ctx.fillStyle = isSelected ? "#ff0000" : "#000000";

        const [left, right] = arrowHeadLeftRight({ x: arrowX, y: arrowY }, nx);
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.closePath();
        ctx.fill();
    }

    return (
        <>
            <Shape
                sceneFunc={(ctx) => {
                    drawArrowTail(ctx);
                    drawArrowHead(ctx);
                }}
                hitFunc={(ctx, shape) => {
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.quadraticCurveTo(cx, cy, end.x, end.y);
                    ctx.fillStrokeShape(shape);
                }}
                onClick={() => {
                    selectId(edge.id);
                }}
            />
            <Text x={labelX} y={labelY} text={edge.polarity} />
        </>
    );
}
