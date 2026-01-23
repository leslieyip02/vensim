import type { Camera } from "@/controllers/camera";
import { GRID_SIZE } from "@/views/GridView";
import type { Node, Stock, Cloud } from "./graph";

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

export interface FlowGeometry {
    start: Vector;
    end: Vector;
    midpoint: Vector;
    valvepoint: Vector;
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

function getElementBoundary(
    element: Node | Stock | Cloud,
    target: Vector
): Vector {
    const dx = target.x - element.x;
    const dy = target.y - element.y;

    if ("width" in element) {
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

    if ("radius" in element) {
        return insetPoint(element, { x: dx, y: dy }, element.radius);
    }

    return insetPoint(element, { x: dx, y: dy }, 32);
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
    const start = getElementBoundary(from, midpoint);
    const end = getElementBoundary(to, midpoint);

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

export function computeFlowGeometry(
    from: Stock | Cloud,
    to: Stock | Cloud,
    curvature: number,
): FlowGeometry {
    
    const midpoint = interpolateQuadraticBezier(from, to, curvature);
    const start = getElementBoundary(from, midpoint);
    const tempEnd = getElementBoundary(to, midpoint);

    const dx = to.x - midpoint.x;
    const dy = to.y - midpoint.y;
    const direction = normalize({ x: dx, y: dy });

    const arrow = computeArrowGeometry(tempEnd, direction, 15);
    const label = computeLabelGeometry(direction, midpoint, 15);

    const end = {
        x: (arrow.left.x + arrow.right.x) / 2,
        y: (arrow.left.y + arrow.right.y) / 2,
    }

    const valvepoint = {
        x: 0.25 * start.x + 0.5 * midpoint.x + 0.25 * end.x,
        y: 0.25 * start.y + 0.5 * midpoint.y + 0.25 * end.y,
    }

    return {
        start,
        end,
        midpoint,
        valvepoint,
        arrow,
        label,
    };
}
