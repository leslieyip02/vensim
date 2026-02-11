import { LineChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { useMemo } from "react";

import type { SimulationResult } from "@/models/simulation";
import { useGraphStore } from "@/stores/graph";

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export const chartHeight = "400px";

export function SimulationChartView({ data }: { data: SimulationResult }) {
    const getOption = useMemo(() => {
        const results = data.results;
        if (!results || results.length === 0) return {};

        const allKeys = Object.keys(results[0].values);
        const state = useGraphStore.getState();

        const idToLabel: Record<string, string> = {};
        const selectedMap: Record<string, boolean> = {};

        Object.values(state.nodes).forEach((n) => {
            idToLabel[n.id] = n.label;
            selectedMap[n.label] = false;
        });
        Object.values(state.flows).forEach((f) => {
            idToLabel[f.id] = f.label;
            selectedMap[f.label] = false;
        });
        Object.values(state.stocks).forEach((s) => {
            idToLabel[s.id] = s.label;
            selectedMap[s.label] = true;
        });

        const series = allKeys.map((id) => ({
            name: idToLabel[id] || id,
            type: "line",
            data: results.map((item) => [item.timestamp, item.values[id]]),
            smooth: true,
            showSymbol: false,
        }));

        const legendData = allKeys.map((id) => idToLabel[id] || id);

        return {
            tooltip: { trigger: "axis" },
            legend: {
                data: legendData,
                selected: selectedMap,
                bottom: 0,
            },
            grid: {
                bottom: 80,
                containLabel: true,
            },
            xAxis: {
                name: "Time",
                type: "value",
                splitLine: { show: true },
            },
            yAxis: {
                name: "Value",
                type: "value",
                splitLine: { show: true },
            },
            series: series,
        };
    }, [data]);

    return (
        <ReactEChartsCore
            echarts={echarts}
            option={getOption}
            notMerge={true}
            style={{ height: chartHeight, width: "100%" }}
        />
    );
}
