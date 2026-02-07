import { LineChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { useMemo } from "react";

import type { SimulationResult } from "@/models/simulation";

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export const chartHeight = "400px";

export function SimulationChartView({ data }: { data: SimulationResult }) {
    const getOption = useMemo(() => {
        const results = data.results;
        if (!results || results.length === 0) return {};

        const xAxisData = results.map((item) => item.timestamp);
        const allKeys = Object.keys(results[0].values);

        const series = allKeys.map((id) => ({
            name: id,
            type: "line",
            data: results.map((item) => item.values[id]),
            smooth: true,
            showSymbol: false,
        }));

        return {
            tooltip: { trigger: "axis" },
            legend: { data: allKeys },
            xAxis: {
                name: "timestamp",
                type: "category",
                data: xAxisData,
            },
            yAxis: {
                name: "value",
                type: "value",
            },
            series: series,
        };
    }, [data]);

    return (
        <ReactEChartsCore
            echarts={echarts}
            option={getOption}
            notMerge={true}
            lazyUpdate={true}
            style={{ height: chartHeight, width: "100%" }}
        />
    );
}
