import { useState } from "react";
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

export function SimulationModalView() {
    const [isOpen, setIsOpen] = useState(false);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [delta, setDelta] = useState("");

    const handleSimulate = async () => {
        try {
            const settings: SimulationSettings = {
                startTime: parseFloat(startTime),
                endTime: parseFloat(endTime),
                delta: parseFloat(delta),
            };

            const data: SimulationResult = await runSimulation(settings);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={`absolute bottom-20 right-8 ${isOpen ? "z-100" : "z-10"}`}
                >
                    <LuChartNoAxesCombined />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[1000px]">
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
                                placeholder="Enter start time"
                            />
                        </Field>
                        <Field>
                            <FieldLabel>End Time</FieldLabel>
                            <Input
                                type="number"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                placeholder="Enter end time"
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Delta</FieldLabel>
                            <Input
                                type="number"
                                value={delta}
                                onChange={(e) => setDelta(e.target.value)}
                                placeholder="Enter delta"
                            />
                        </Field>
                    </div>
                </FieldSet>

                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button onClick={handleSimulate}>Test Run Sample Payload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
