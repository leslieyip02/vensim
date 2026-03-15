import { useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { LuChartNoAxesCombined } from "react-icons/lu";

import { runSimulation } from "@/actions/simulation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { SimulationResult, SimulationSettings } from "@/models/simulation";
import { haveNonEmptyEquations, haveAllInitialValues, haveUniqueLabels, haveStock, haveNonEmptyLabels } from "@/utils/sim";

import { chartHeight, SimulationChartView } from "./SimulationChartView";
import { useGraphStore } from "@/stores/graph";
import { useShallow } from "zustand/react/shallow";

export function SimulationModalView() {
    const [isOpen, setIsOpen] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [delta, setDelta] = useState("");
    const [simulationData, setSimulationData] = useState<SimulationResult | null>(null);
    const [isChartLoading, setIsChartLoading] = useState(false);

    const { showBoundary } = useErrorBoundary();

    const isSettingsValid =
        !isNaN(parseFloat(startTime)) &&
        !isNaN(parseFloat(endTime)) &&
        !isNaN(parseFloat(delta)) &&
        parseFloat(startTime) < parseFloat(endTime) &&
        parseFloat(delta) > 0;

    const nodes = useGraphStore(useShallow((state) => Object.values(state.nodes)));
    const stocks = useGraphStore(useShallow((state) => Object.values(state.stocks)));
    const flows = useGraphStore(useShallow((state) => Object.values(state.flows)));

    const hasStock = haveStock(stocks);
    const hasLabels = haveNonEmptyLabels([...nodes, ...stocks, ...flows]);
    const hasUniqueLabels = haveUniqueLabels([...nodes, ...stocks, ...flows]);
    const hasEquations = haveNonEmptyEquations([...nodes, ...flows]);
    const hasInitialValues = haveAllInitialValues(stocks);

    const isGraphValid = hasEquations && hasInitialValues && hasUniqueLabels && hasStock && hasLabels;

    const getStatusMessage = () => {
        if (!isSettingsValid) return "Check simulation settings";
        if (!hasStock) return "Simulation requires at least one Stock.";
        if (!hasLabels) return "All entities must have a label.";
        if (!hasUniqueLabels) return "All entity labels must be unique.";
        if (!hasEquations) return "All Nodes and Flows must have equations.";
        if (!hasInitialValues) return "All Stocks must have initial values.";
        return null;
    };

    const statusMessage = getStatusMessage();

    const handleSimulate = async () => {
        try {
            setIsChartLoading(true);
            const settings: SimulationSettings = {
                startTime: parseFloat(startTime),
                endTime: parseFloat(endTime),
                delta: parseFloat(delta),
            };

            const data: SimulationResult = await runSimulation(settings);
            setSimulationData(data);
        } catch (error) {
            showBoundary(error);
        } finally {
            setIsChartLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={`absolute bottom-20 right-8 ${isOpen ? "z-100" : "z-10"}`}
                >
                    <LuChartNoAxesCombined />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Simulate</DialogTitle>
                    <DialogDescription>Run a time-series simulation</DialogDescription>
                </DialogHeader>

                <FieldSet>
                    <div className="flex flex-row gap-2">
                        <Field>
                            <FieldLabel>Start Time</FieldLabel>
                            <Input
                                type="number"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                placeholder="0"
                            />
                        </Field>
                        <Field>
                            <FieldLabel>End Time</FieldLabel>
                            <Input
                                type="number"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                placeholder="10"
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Delta</FieldLabel>
                            <Input
                                type="number"
                                value={delta}
                                onChange={(e) => setDelta(e.target.value)}
                                placeholder="1"
                            />
                        </Field>
                    </div>
                </FieldSet>

                <div className={`py-4 border rounded-md bg-slate-50 min-h-[${chartHeight}] flex items-center justify-center`}>
                    {simulationData ? (
                        <SimulationChartView data={simulationData} />
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            {isChartLoading
                                ? "Running simulation..."
                                : "No data to display. Click 'Run' to start."}
                        </p>
                    )}
                </div>

                <DialogFooter className="flex items-center gap-4">
                    {statusMessage && (
                        <span className="text-sm text-destructive flex-1">
                            {statusMessage}
                        </span>
                    )}
                    
                    <div className="flex gap-2 ml-auto">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                            onClick={handleSimulate} 
                            disabled={!isSettingsValid || !isGraphValid || isChartLoading}
                        >
                            {isChartLoading ? "Simulating..." : "Run Simulation"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
