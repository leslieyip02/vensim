import { Group, Rect, Text } from "react-konva";

import { useStockInteractions } from "@/controllers/interaction";
import type { Stock } from "@/models/graph";

export function StockView({ stock }: { stock: Stock }) {
    const { stroke, opacity, onClick, onDragEnd } = useStockInteractions(stock.id);

    return (
        <Group
            x={stock.x}
            y={stock.y}
            draggable
            dragBoundFunc={(position) => position}
            onClick={onClick}
            onDragEnd={onDragEnd}
            opacity={opacity}
        >
            <Rect
                width={stock.width}
                height={stock.height}
                x={-stock.width / 2}
                y={-stock.height / 2}
                fill="#ffffff"
                stroke={stroke}
            />
            <Text
                text={stock.label}
                width={stock.width}
                height={stock.height}
                align="center"
                verticalAlign="middle"
                x={-stock.width / 2}
                y={-stock.height / 2}
                fontSize={12}
                wrap="word"
            />
        </Group>
    );
}
