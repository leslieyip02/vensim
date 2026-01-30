/// <reference types="vite-plugin-svgr/client" />

import "./App.css";

import { BoardView } from "./BoardView";
import { InspectorPanelView } from "./inspector/InspectorPanelView";
import { RoomModalView } from "./room/RoomModalView";
import { ToolbarView } from "./toolbar/ToolbarView";

function App() {
    return (
        <main>
            <InspectorPanelView />
            <ToolbarView />
            <RoomModalView />
            <BoardView />
        </main>
    );
}

export default App;
