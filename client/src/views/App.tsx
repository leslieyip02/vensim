/// <reference types="vite-plugin-svgr/client" />

import "./App.css";

import { ErrorBoundary } from "react-error-boundary";

import { BoardView } from "./BoardView";
import { ErrorModalView } from "./error/ErrorModalView";
import { InspectorPanelView } from "./inspector/InspectorPanelView";
import { RoomModalView } from "./room/RoomModalView";
import { ToolbarView } from "./toolbar/ToolbarView";

function App() {
    return (
        <main>
            <InspectorPanelView />
            <ToolbarView />
            <ErrorBoundary FallbackComponent={ErrorModalView}>
                <RoomModalView />
            </ErrorBoundary>
            <BoardView />
        </main>
    );
}

export default App;
