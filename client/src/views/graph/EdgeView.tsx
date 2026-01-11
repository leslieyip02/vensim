import type { Context } from "konva/lib/Context";
import { Group, Shape, Text } from "react-konva";

import { useGraphStore } from "../../stores/graph";
import { computeEdgeGeometry } from "@/models/geometry";
import { useEdgeInteractions } from "@/controllers/interaction";

export function EdgeView({ edgeId }: { edgeId: string }) {
    const edge = useGraphStore((s) => s.edges[edgeId]);
    const from = useGraphStore((s) => s.nodes[edge?.from ?? ""]);
    const to = useGraphStore((s) => s.nodes[edge?.to ?? ""]);
    if (!edge || !from || !to) {
        return null;
    }

    const { start, end, midpoint, arrow, label } = computeEdgeGeometry(from, to, edge.curvature);
    const { isSelected, opacity, onClick } = useEdgeInteractions(edge.id);

    function draw(ctx: Context) {
        ctx.strokeStyle = isSelected ? "#ff0000" : "#000000";
        ctx.fillStyle = ctx.strokeStyle;

        // tail
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(midpoint.x, midpoint.y, end.x, end.y);
        ctx.stroke();

        // head
        ctx.beginPath();
        ctx.moveTo(arrow.tip.x, arrow.tip.y);
        ctx.lineTo(arrow.left.x, arrow.left.y);
        ctx.lineTo(arrow.right.x, arrow.right.y);
        ctx.closePath();
        ctx.fill();
    }

    function hit(ctx: Context, shape: any) {
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(midpoint.x, midpoint.y, end.x, end.y);
        ctx.fillStrokeShape(shape);
    }

    return (
        <Group opacity={opacity}>
            <Shape sceneFunc={draw} hitFunc={hit} onClick={onClick} />
            <Text x={label.x} y={label.y} text={edge.polarity} />
        </Group>
    );
}
