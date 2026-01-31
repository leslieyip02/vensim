import type { Context } from "konva/lib/Context";
import type { Shape, ShapeConfig } from "konva/lib/Shape";
import { Group, Shape as ShapeDiv, Text } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { useEdgeInteractions } from "@/controllers/interaction";
import { computeLineGeometry } from "@/models/geometry";
import type { Edge } from "@/models/graph";

import { useGraphStore } from "../../stores/graph";

export function EdgeView({ edge }: { edge: Edge }) {
    const { stroke, opacity, onClick } = useEdgeInteractions(edge.id);

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
    const to = useGraphStore(
        useShallow((s) => {
            if (!edge?.to) return null;

            if (edge.to.startsWith("node-")) {
                return s.nodes[edge.to];
            }

            if (edge.to.startsWith("flow-")) {
                const flow = s.flows[edge.to];
                if (!flow) return null;

                const flowFrom = flow.from.startsWith("cloud-")
                    ? s.clouds[flow.from]
                    : s.stocks[flow.from];

                const flowTo = flow.to.startsWith("cloud-") ? s.clouds[flow.to] : s.stocks[flow.to];

                if (!flowFrom || !flowTo) return null;
                const flowGeo = computeLineGeometry(flowFrom, flowTo, flow.curvature);

                return {
                    id: "valve-" + flow.id.slice(5),
                    x: flowGeo.mid.x,
                    y: flowGeo.mid.y,
                    radius: 12,
                };
            }

            return null;
        }),
    );

    if (!edge || !from || !to) {
        return null;
    }

    const { start, end, controlPoint, arrow, label } = computeLineGeometry(
        from,
        to,
        edge.curvature,
    );

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
            {edge.polarity && <Text x={label.x} y={label.y} text={edge.polarity} />}
        </Group>
    );
}
