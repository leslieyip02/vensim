import type { Camera } from "@/controllers/camera";
import { GRID_SIZE } from "@/views/GridView";

import { isCloud, isNode, isStock, type Cloud, type Node, type Stock } from "./graph";

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

export interface ValveGeometry {
    id: string;
    x: number;
    y: number;
    radius: number;
}

export interface LineGeometry {
    start: Vector;
    end: Vector;
    controlPoint: Vector; // for bezier curves
    mid: Vector; // actual midpoint of curve (e.g. for valve placement)
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

function getElementBoundary(element: Node | Stock | Cloud | ValveGeometry, target: Vector): Vector {
    const dx = target.x - element.x;
    const dy = target.y - element.y;

    if (isStock(element)) {
        const halfWidth = element.width / 2;
        const halfHeight = element.height / 2;

        const tx = dx !== 0 ? halfWidth / Math.abs(dx) : Infinity;
        const ty = dy !== 0 ? halfHeight / Math.abs(dy) : Infinity;

        const t = Math.min(tx, ty);

        return {
            x: element.x + dx * t,
            y: element.y + dy * t,
        };
    }

    if (isNode(element)) {
        return insetPoint(element, { x: dx, y: dy }, element.radius);
    }

    if (isCloud(element)) {
        const len = Math.hypot(dx, dy);
        if (len === 0) {
            return { x: element.x, y: element.y };
        }

        const theta = Math.atan2(dy, dx);
        const rotation = Math.PI / 4;

        const r =
            element.radius *
            (1 + 0.25 * Math.cos(4 * (theta + rotation)));

        const scale = r / len;

        return {
            x: element.x + dx * scale,
            y: element.y + dy * scale,
        };
    }

    // ValveGeometry
    return insetPoint(element, { x: dx, y: dy }, 12);
}

function computeArrowGeometry(
    tip: Vector,
    direction: Vector,
    size = 15,
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

function computeLabelGeometry(direction: Vector, tip: Vector, offset: number = 20): Vector {
    const perpendicular = normalize({ x: -direction.y, y: direction.x });
    return {
        x: tip.x - direction.x * 0.1 + perpendicular.x * offset,
        y: tip.y - direction.y * 0.1 + perpendicular.y * offset,
    };
}

export function computeLineGeometry(
    from: Node | Stock | Cloud,
    to: Node | Stock | Cloud | ValveGeometry,
    curvature: number,
): LineGeometry {
    const controlPoint = interpolateQuadraticBezier(from, to, curvature);
    const start = getElementBoundary(from, controlPoint);
    const tempEnd = getElementBoundary(to, controlPoint);

    const dx = to.x - controlPoint.x;
    const dy = to.y - controlPoint.y;
    const direction = normalize({ x: dx, y: dy });

    const arrow = computeArrowGeometry(tempEnd, direction);
    const end = {
        x: (arrow.left.x + arrow.right.x) / 2,
        y: (arrow.left.y + arrow.right.y) / 2,
    };
    const label = computeLabelGeometry(direction, end);

    const mid = {
        x: 0.25 * start.x + 0.5 * controlPoint.x + 0.25 * end.x,
        y: 0.25 * start.y + 0.5 * controlPoint.y + 0.25 * end.y,
    };

    return {
        start,
        end,
        controlPoint,
        mid,
        arrow,
        label,
    };
}
