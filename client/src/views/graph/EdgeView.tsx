import type { Context } from "konva/lib/Context";
import { Group, Shape, Text } from "react-konva";
import { useShallow } from 'zustand/react/shallow';

import { useGraphStore } from "../../stores/graph";
import { computeLineGeometry } from "@/models/geometry";
import { useEdgeInteractions } from "@/controllers/interaction";

export function EdgeView({ edgeId }: { edgeId: string }) {
    const edge = useGraphStore((s) => s.edges[edgeId]);
    const from = useGraphStore((s) => {
        if (!edge?.from) return null;
        
        if (edge.from.startsWith("node-")) {
            return s.nodes[edge.from];
        }

        if (edge.from.startsWith("stock-")) {
            return s.stocks[edge.from];
        }

        return null;
    });
    const to = useGraphStore(useShallow((s) => {
        if (!edge?.to) return null;

        if (edge.to.startsWith("node-")) {
            return s.nodes[edge.to];
        }

        if (edge.to.startsWith("flow-")) {
            const flow = s.flows[edge.to];
            if (!flow) return null;

            const flowFrom = flow.type === 'inflow' 
                 ? s.clouds[flow.cloudId] 
                 : s.stocks[flow.stockId];
                 
            const flowTo = flow.type === 'inflow'
                 ? s.stocks[flow.stockId]
                 : s.clouds[flow.cloudId];

            if (!flowFrom || !flowTo) return null;
            const flowGeo = computeLineGeometry(flowFrom, flowTo, flow.curvature);
            
            return {
                x: flowGeo.mid.x,
                y: flowGeo.mid.y,
                radius: 12
            };
        }

        return null;
    }));

    if (!edge || !from || !to) {
        return null;
    }

    const { start, end, controlPoint, arrow, label } = computeLineGeometry(from, to, edge.curvature);
    const { stroke, opacity, onClick } = useEdgeInteractions(edge.id);

    function draw(ctx: Context) {
        ctx.strokeStyle = stroke;
        ctx.fillStyle = ctx.strokeStyle;

        // tail
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, end.x, end.y);
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
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, end.x, end.y);
        ctx.strokeShape(shape);
    }

    return (
        <Group opacity={opacity}>
            <Shape sceneFunc={draw} hitFunc={hit} onClick={onClick} stroke={stroke} strokeWidth={8}/>
            <Text x={label.x} y={label.y} text={edge.polarity} />
        </Group>
    );
}
