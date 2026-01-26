/// <reference types="vite-plugin-svgr/client" />

import "./App.css";

import { BoardView } from "./BoardView";
import { InspectorView } from "./inspector/InspectorView";
import { ToolbarView } from "./toolbar/ToolbarView";

function App() {
    return (
        <>
            <ToolbarView />
            <InspectorView />
            <BoardView />
        </>
    );
}

export default App;
