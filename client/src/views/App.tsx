/// <reference types="vite-plugin-svgr/client" />

import "./App.css";

import { ErrorBoundary } from "react-error-boundary";

import { BoardView } from "./BoardView";
import { ErrorModalView } from "./error/ErrorModalView";
import { HelpModalView } from "./help/HelpModalView";
import { InspectorPanelView } from "./inspector/InspectorPanelView";
import { RoomModalView } from "./room/RoomModalView";
import { SimulationModalView } from "./simulate/SimulationModalView";
import { ToolbarView } from "./toolbar/ToolbarView";

function App() {
    return (
        <main>
            <InspectorPanelView />
            <ToolbarView />
            <HelpModalView />
            <ErrorBoundary FallbackComponent={ErrorModalView}>
                <RoomModalView />
            </ErrorBoundary>
            <BoardView />
        </main>
    );
}

export default App;
