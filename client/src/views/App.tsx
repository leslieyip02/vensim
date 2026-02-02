/// <reference types="vite-plugin-svgr/client" />

import "./App.css";

import { BoardView } from "./BoardView";
import { InspectorPanelView } from "./inspector/InspectorPanelView";
import { RoomModalView } from "./room/RoomModalView";
import { SimulationModalView } from "./simulate/SimulationModalView";
import { ToolbarView } from "./toolbar/ToolbarView";

function App() {
    return (
        <main>
            <InspectorPanelView />
            <ToolbarView />
            <RoomModalView />
            <SimulationModalView />
            <BoardView />
        </main>
    );
}

export default App;
