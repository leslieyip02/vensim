import type { Camera } from "@/controllers/camera";
import { GRID_SIZE } from "@/views/GridView";
import type { Node } from "./graph";

interface Vector {
    x: number;
    y: number;
}

export function snapToGrid(point: Vector): Vector {
    return {
        x: Math.round(point.x / GRID_SIZE) * GRID_SIZE,
        y: Math.round(point.y / GRID_SIZE) * GRID_SIZE,
    };
}

export function mouseToWorldSpace(point: Vector, camera: Camera): Vector {
    return {
        x: (point.x - camera.x) / camera.zoom,
        y: (point.y - camera.y) / camera.zoom,
    };
}

interface ArrowGeometry {
    tip: Vector;
    left: Vector;
    right: Vector;
}

export interface EdgeGeometry {
    start: Vector;
    end: Vector;
    midpoint: Vector;
    arrow: ArrowGeometry;
    label: Vector;
}

function interpolateQuadraticBezier(from: Vector, to: Vector, curvature: number): Vector {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    return {
        x: mx - dy * curvature,
        y: my + dx * curvature,
    };
}

function normalize(direction: Vector): Vector {
    const length = Math.hypot(direction.x, direction.y);
    return {
        x: direction.x / length,
        y: direction.y / length,
    };
}

function insetPoint(point: Vector, direction: Vector, inset: number): Vector {
    const len = Math.hypot(direction.x, direction.y);
    return {
        x: point.x + (direction.x / len) * inset,
        y: point.y + (direction.y / len) * inset,
    };
}

function insetEndpoints(
    from: Vector,
    to: Vector,
    midpoint: Vector,
    startInset: number,
    endInset: number,
): [Vector, Vector] {
    const t0x = midpoint.x - from.x;
    const t0y = midpoint.y - from.y;

    const t1x = to.x - midpoint.x;
    const t1y = to.y - midpoint.y;

    const start = insetPoint(from, { x: t0x, y: t0y }, startInset);
    const end = insetPoint(to, { x: -t1x, y: -t1y }, endInset);
    return [start, end];
}

function computeArrowGeometry(
    tip: Vector,
    direction: Vector,
    size = 10,
    angle = Math.PI / 6,
): ArrowGeometry {
    direction = normalize(direction);

    const left = {
        x: tip.x - size * (direction.x * Math.cos(angle) - direction.y * Math.sin(angle)),
        y: tip.y - size * (direction.y * Math.cos(angle) + direction.x * Math.sin(angle)),
    };

    const right = {
        x: tip.x - size * (direction.x * Math.cos(angle) + direction.y * Math.sin(angle)),
        y: tip.y - size * (direction.y * Math.cos(angle) - direction.x * Math.sin(angle)),
    };

    return {
        tip,
        left,
        right,
    };
}

function computeLabelGeometry(direction: Vector, tip: Vector, offset: number = 12): Vector {
    const perpendicular = normalize({ x: -direction.y, y: direction.x });
    return {
        x: tip.x - direction.x * 0.1 + perpendicular.x * offset,
        y: tip.y - direction.y * 0.1 + perpendicular.y * offset,
    };
}

export function computeEdgeGeometry(from: Node, to: Node, curvature: number): EdgeGeometry {
    const midpoint = interpolateQuadraticBezier(from, to, curvature);
    const [start, end] = insetEndpoints(from, to, midpoint, from.radius, to.radius);

    const dx = to.x - midpoint.x;
    const dy = to.y - midpoint.y;
    const direction = normalize({ x: dx, y: dy });

    const tip = {
        x: to.x - direction.x * to.radius,
        y: to.y - direction.y * to.radius,
    };
    const arrow = computeArrowGeometry(tip, direction);
    const label = computeLabelGeometry(direction, tip);

    return {
        start,
        end,
        midpoint,
        arrow,
        label,
    };
}
