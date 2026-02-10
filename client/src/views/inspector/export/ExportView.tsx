import { useRef, useState } from "react";

import { exportState, importState } from "@/actions/export";
import { Button } from "@/components/ui/button";

import { InspectorSectionWrapper } from "../InspectorSectionWrapper";

export function ExportView() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isImporting, setIsImporting] = useState(false);

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            setIsImporting(true);
            await importState(file);
        } finally {
            setIsImporting(false);
            e.target.value = "";
        }
    };

    const handleExport = () => {
        exportState();
    };

    return (
        <InspectorSectionWrapper label="Import/Export">
            <div className="flex gap-2">
                <Button
                    className="flex-1"
                    variant="outline"
                    onClick={openFilePicker}
                    disabled={isImporting}
                >
                    {isImporting ? "Importing…" : "Import"}
                </Button>

                <Button
                    className="flex-1"
                    variant="outline"
                    onClick={handleExport}
                    disabled={isImporting}
                >
                    Export
                </Button>

                {/* hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileSelected}
                />
            </div>
        </InspectorSectionWrapper>
    );
}
