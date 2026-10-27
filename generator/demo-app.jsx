import React from "react";
import { createRoot } from "react-dom/client";
import { Excalidraw, CommandPalette } from "@excalidraw/excalidraw";

const lib = window.__LIB;
function App() {
  return <div style={{ height: "100vh" }}>
    <Excalidraw initialData={{ libraryItems: lib.libraryItems, appState: { viewBackgroundColor: "#ffffff", theme: window.__THEME || "light" } }}
      excalidrawAPI={(api) => { window.__api = api; }} onExcalidrawAPI={(api) => { window.__api = api; }}><CommandPalette /></Excalidraw>
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
