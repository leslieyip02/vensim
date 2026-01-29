/// <reference types="vite-plugin-svgr/client" />

import "./App.css";

import { BoardView } from "./BoardView";
import { InspectorPanelView } from "./inspector/InspectorPanelView";
import { ToolbarView } from "./toolbar/ToolbarView";

function App() {
    return (
        <main>
            <InspectorPanelView />
            <ToolbarView />
            <BoardView />
        </main>
    );
}

export default App;
