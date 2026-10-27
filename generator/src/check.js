import { loadLibraryFromBlob, exportToSvg } from "@excalidraw/excalidraw";
window.CHECK = async (txt) => { const items = await loadLibraryFromBlob(new Blob([txt], { type: "application/vnd.excalidrawlib+json" }), "unpublished");
  const bad = items.filter((i) => !i.name || !i.elements.length).length; return { n: items.length, bad, first: items[0].name, last: items[items.length - 1].name }; };
window.__fontsReady = true; window.BUILD = 1;
