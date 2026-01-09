import { GRID_SIZE } from "@/views/GridView";

export interface Camera {
    x: number;
    y: number;
    zoom: number;
}

interface Vector {
    x: number;
    y: number;
}

export function snapToGrid(point: Vector) {
    return {
        x: Math.round(point.x / GRID_SIZE) * GRID_SIZE,
        y: Math.round(point.y / GRID_SIZE) * GRID_SIZE,
    };
}

export function mouseToWorldSpace(point: Vector, camera: Camera) {
    return {
        x: (point.x - camera.x) / camera.zoom,
        y: (point.y - camera.y) / camera.zoom,
    };
}

export function interpolateQuadraticBezier(a: Vector, b: Vector, curvature: number = 0.25) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;

    const cx = mx - dy * curvature;
    const cy = my + dx * curvature;
    return [a.x, a.y, cx, cy, b.x, b.y];
}

export function normalize(direction: Vector) {
    const length = Math.hypot(direction.x, direction.y);
    return { x: direction.x / length, y: direction.y / length };
}

export function insetEndpoints(
    a: Vector,
    b: Vector,
    c: Vector,
    startInset: number,
    endInset: number,
) {
    const t0x = c.x - a.x;
    const t0y = c.y - a.y;

    const t1x = b.x - c.x;
    const t1y = b.y - c.y;

    const start = insetPoint(a, { x: t0x, y: t0y }, startInset);
    const end = insetPoint(b, { x: -t1x, y: -t1y }, endInset);
    return [start, end];
}

export function insetPoint(point: Vector, direction: Vector, inset: number) {
    const len = Math.hypot(direction.x, direction.y);
    return {
        x: point.x + (direction.x / len) * inset,
        y: point.y + (direction.y / len) * inset,
    };
}

export function arrowHeadLeftRight(
    point: Vector,
    direction: Vector,
    size = 10,
    angle = Math.PI / 6,
) {
    const { x: ux, y: uy } = normalize(direction);

    const left = {
        x: point.x - size * (ux * Math.cos(angle) - uy * Math.sin(angle)),
        y: point.y - size * (uy * Math.cos(angle) + ux * Math.sin(angle)),
    };

    const right = {
        x: point.x - size * (ux * Math.cos(angle) + uy * Math.sin(angle)),
        y: point.y - size * (uy * Math.cos(angle) - ux * Math.sin(angle)),
    };

    return [left, right];
}
