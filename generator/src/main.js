import { convertToExcalidrawElements, exportToSvg } from "@excalidraw/excalidraw";
import { T, ICONS, comp, rect, ell, txt, poly, arr, nid, INK, MUTED, ACCENT, WHITE } from "./core.js";
import { SECTIONS } from "./components.js";
import { diagram } from "./diagram.js";
import { TEMPLATES, PATTERNS } from "./templates.js";
import { AGENTIC, AI_TEMPLATES } from "./agentic.js";
import { UI, FRAMES, SCREENS } from "./ui.js";

const items = []; // {name, section, skel}
export const KIT = "sd", KIT_VERSION = "1.4.0";
const add = (cat, label, skel, section) => items.push({ name: `${KIT}:${cat}/ ${label}`, section: section || cat, skel });
const one = (s) => s.replace(/\n/g, " ");

// ---- section divider tile ----
const SECTION_META = [];
function section(cat, no, title, theme = "ops", hint) {
  const th = T[theme] || T.ops;
  SECTION_META.push({ cat, no, title });
  add(cat, `${no} SECTION - ${title}`, [
    rect(0, 0, Math.max(400, Math.ceil(`SD ${no}  ${title}`.length * 12.5) + 40), 96, { strokeColor: th.stroke, backgroundColor: th.fill, strokeWidth: 3, roundness: null }),
    txt(16, 12, `SD ${no}  ${title.toUpperCase()}`, { fontSize: 20, strokeColor: INK }),
    txt(16, 52, hint || `search "sd:${cat}/" for this section`, { fontSize: 15, strokeColor: th.stroke, fontFamily: 3 }),
  ], cat);
}

// ================= 00 GUIDE =================
section("guide", "00", "How to use this kit", "msg", `v${KIT_VERSION} · search "sd:" for the whole kit`);
add("guide", "Library guide - how to search insert", [rect(0, 0, 460, 330, { strokeColor: "#e67700", backgroundColor: "#fff9db", strokeWidth: 2,
  label: { text: "System Design & AI Architecture Kit v" + KIT_VERSION + "\n\nCmd/Ctrl + /  then type a name  ->  Enter\n   inserts the item (no dragging)\nLibrary search: every name starts \"sd:\"\n   \"sd:\" = whole kit, \"sd:data/\" = one section,\n   or just \"kafka\", \"redis\", \"agent\"...\n\nSections (sd:...): note client edge svc data\n cache msg ai agent rag llmops ops ext\n zone link ui frame screen pattern agentic tpl\n\nDouble-click a box to rename it.", fontSize: 16, textAlign: "left", verticalAlign: "top", strokeColor: INK } })]);
add("guide", "Colour legend - category key", (() => {
  const L = [["client", "Clients"], ["edge", "Edge / network"], ["svc", "Services"], ["data", "Data stores"], ["cache", "Caches"], ["msg", "Messaging"], ["ai", "AI models"], ["agent", "Agents"], ["rag", "RAG / knowledge"], ["llmops", "LLMOps / safety"], ["ops", "Ops / security"], ["ext", "External"]];
  const out = [rect(0, 0, 230, 54 + L.length * 30, { strokeColor: "#adb5bd", backgroundColor: WHITE, strokeWidth: 1.5 }), txt(14, 10, "Legend", { fontSize: 18 })];
  L.forEach(([k, s], i) => out.push(rect(14, 44 + i * 30, 22, 20, { strokeColor: T[k].stroke, backgroundColor: T[k].fill, strokeWidth: 2 }), txt(46, 44 + i * 30, s, { fontSize: 16 })));
  return out;
})());

// ================= 01 NOTES =================
section("note", "01", "Interview notes", "msg");
const card = (w, h0, text, o = {}) => [rect(0, 0, w, Math.max(h0 < 160 ? h0 : 0, 28 + text.split("\n").length * (o.fs || 16) * 1.25), { strokeColor: o.stroke || "#e67700", backgroundColor: o.fill || "#fff9db", strokeWidth: 2, strokeStyle: o.dash ? "dashed" : "solid",
  label: { text, fontSize: o.fs || 16, textAlign: "left", verticalAlign: "top", strokeColor: INK, fontFamily: o.font || 5 } })];
add("note", "Interview Flow - steps checklist 45 min", card(330, 250, "Interview flow (45 min)\n\n1. Requirements ............ 5 min\n2. Estimates ................... 5 min\n3. API design .................. 5 min\n4. Data model .................. 5 min\n5. High-level design ....... 10 min\n6. Deep dives .................. 10 min\n7. Bottlenecks + wrap-up .. 5 min"));
add("note", "Requirements - functional non-functional", card(340, 330, "Requirements\n\nFunctional\n- Users can ...\n- Users can ...\n- Out of scope: ...\n\nNon-functional\n- Scale: DAU ..., QPS ...\n- Latency: p99 < ... ms\n- Availability: 99.9x %\n- Consistency: strong / eventual\n- Durability, security, cost"));
add("note", "Capacity Estimates - back of envelope qps storage", card(360, 300, "Back-of-envelope\n\nDAU: ...\nRead QPS = DAU x reads / 86,400 = ...\nWrite QPS = ...   Peak = 2-3 x avg\nStorage / day = writes x size = ...\n5 years = per day x 1,825 = ...\nBandwidth = QPS x payload = ...\nCache (80/20): 20% of daily reads\nServers = peak QPS / per-server QPS", { fs: 15 }));
add("note", "API Design - rest endpoints contract", card(400, 230, "API design\n\nPOST   /v1/items           -> 201 {id}\nGET    /v1/items/{id}      -> 200\nGET    /v1/items?cursor=&limit=20\nDELETE /v1/items/{id}      -> 204\n\nAuth: Bearer JWT · Idempotency-Key\nRate limited · cursor pagination", { fs: 14, font: 3, stroke: ACCENT, fill: "#edf2ff" }));
const table = (x, y, name, fields, th = T.data) => [rect(x, y, 260, 38, { strokeColor: th.stroke, backgroundColor: th.fill, strokeWidth: 2, roundness: null, label: { text: name, fontSize: 17, strokeColor: INK, fontFamily: 3 } }),
  rect(x, y + 38, 260, 14 + fields.length * 22, { strokeColor: th.stroke, backgroundColor: WHITE, strokeWidth: 2, roundness: null, label: { text: fields.join("\n"), fontSize: 14, textAlign: "left", verticalAlign: "top", strokeColor: INK, fontFamily: 3 } })];
add("note", "Data Model - table entity schema", table(0, 0, "users", ["id          PK  bigint", "name            varchar", "email     UQ   varchar", "created_at  timestamp"]));
add("note", "Data Model - one to many relation erd", [...table(0, 0, "users", ["id          PK  bigint", "name            varchar"]), ...table(380, 0, "posts", ["id          PK  bigint", "user_id     FK  bigint", "body            text", "created_at  timestamp"]),
  arr(266, 60, 374, 60, { strokeColor: INK, strokeWidth: 2, label: { text: "1 : N", fontSize: 14 } })]);
add("note", "Trade-offs - pros cons decision", card(340, 200, "Trade-off\n\nChose: ...\n+ gains ...\n- costs ...\nAlternative: ... (why not)", { stroke: "#1971c2", fill: "#e7f5ff" }));
add("note", "Bottleneck - spof risk callout", card(300, 150, "! Bottleneck / SPOF\n\nRisk: ...\nFix: replicate / shard / cache / queue", { stroke: "#e03131", fill: "#fff5f5", dash: true }));
add("note", "Deep Dive - focus area", card(300, 170, "Deep dive: ...\n\n- How it works\n- Failure modes\n- Scaling it 10x", { stroke: "#6741d9", fill: "#f3f0ff" }));
add("note", "Latency Numbers - cheat sheet every engineer", card(380, 290, "Latency numbers (approx.)\n\nL1 cache ref ................... 0.5 ns\nMain memory ref .............. 100 ns\nSSD random read ............. ~100 us\nRead 1 MB from memory ...... ~250 us\nSame-DC round trip .......... 0.5 ms\nRead 1 MB from SSD .......... ~1 ms\nDisk seek ...................... 10 ms\nCross-continent round trip .. ~150 ms", { fs: 14, font: 3, stroke: "#495057", fill: "#f8f9fa" }));
add("note", "Capacity Cheat Sheet - powers of two availability nines", card(380, 280, "Quick maths\n\n2^10 ~ 1 thousand (KB)\n2^20 ~ 1 million   (MB)\n2^30 ~ 1 billion   (GB)\n2^40 ~ 1 trillion  (TB)\n1 day = 86,400 s ~ 10^5 s\n1M req/day ~ 12 req/s\n99.9%  = 8.8 h down / year\n99.99% = 53 min down / year", { fs: 14, font: 3, stroke: "#495057", fill: "#f8f9fa" }));
add("note", "Title - diagram heading", [txt(0, 0, "System Design: <name>", { fontSize: 36 }), txt(0, 52, "scale · latency · key constraint", { fontSize: 18, strokeColor: MUTED })]);
add("note", "Sticky Note - yellow", card(200, 140, "Note", { stroke: "#f08c00", fill: "#ffec99", fs: 18 }));
add("note", "Sticky Note - blue question", card(200, 140, "Question for interviewer", { stroke: "#1971c2", fill: "#a5d8ff", fs: 18 }));
add("note", "Sticky Note - pink assumption", card(200, 140, "Assumption", { stroke: "#c2255c", fill: "#fcc2d7", fs: 18 }));
for (let i = 1; i <= 9; i++) add("note", `Step ${i} - numbered flow marker`, [ell(0, 0, 36, 36, { strokeColor: ACCENT, backgroundColor: ACCENT, strokeWidth: 1 }), txt(i === 1 ? 14 : 12.5, 7, String(i), { fontSize: 18, strokeColor: WHITE })]);

// ---- client starters: the first thing you drop in every design ----
function clientGroup(label, cards, theme, out) {
  const W = 128, G = 16, els = [];
  const w = cards.length * W + (cards.length + 1) * G, h = 96 + 58;
  els.push(rect(0, 0, w, h, { strokeColor: T[theme].stroke, backgroundColor: "transparent", strokeWidth: 2, strokeStyle: "dashed" }), txt(14, 10, label, { fontSize: 20, strokeColor: T[theme].stroke }));
  cards.forEach(([t, i, th], k) => els.push(...comp(G + k * (W + G), 44, { title: t, icon: i, theme: th || theme, w: W }).els));
  els.push(arr(w + 8, h / 2, w + 200, h / 2, { strokeColor: "#495057", strokeWidth: 2, label: { text: out, fontSize: 14 } }));
  return els;
}
function clientStarters() {
  add("client", "Clients Group - all devices mobile tablet laptop web client clients starter", clientGroup("Clients", [["Mobile", "mobile"], ["Tablet", "tablet"], ["Laptop", "laptop"], ["Web", "browser"]], "client", "HTTPS"));
  add("client", "AI Clients Group - chat app agent mcp voice ai client clients starter", clientGroup("AI Clients", [["AI Chat App", "aichat"], ["AI Agent", "robot"], ["MCP Client", "plug"], ["Voice AI", "waveform"]], "ai", "API key / OAuth"));
  add("client", "First Request - classic dns cdn lb gateway client clients starter", diagram({ nodes: [["c", "Clients\n(web, mobile)", "users", "client", 0, 1], ["dns", "DNS", "dns", "edge", 1.4, 0], ["cdn", "CDN\n(static files)", "globe", "edge", 1.4, 2],
    ["lb", "Load Balancer", "lb", "edge", 2.8, 1], ["gw", "API Gateway", "gateway", "edge", 4.1, 1], ["s", "Services", "service", "svc", 5.4, 1]],
    edges: [["c", "dns", "1. resolve"], ["c", "cdn", "2. assets"], ["c", "lb", "3. HTTPS API"], ["lb", "gw", "4."], ["gw", "s", "5. route"]] }));
  add("client", "First Request - AI llm gateway streaming ai client clients starter", diagram({ nodes: [["a", "AI Clients\n(app, agent, MCP)", "robot", "ai", 0, 1, 160], ["gw", "API Gateway\n(auth, token limits)", "gateway", "edge", 1.4, 1, 160],
    ["s", "AI Service\n(orchestrator)", "service", "svc", 2.8, 1, 160], ["llm", "LLM", "sparkle", "ai", 4.2, 0.2], ["t", "Tools / MCP", "wrench", "ai", 4.2, 1.8]],
    edges: [["a", "gw", "1. request"], ["gw", "s", "2."], ["s", "llm", "3. prompt"], ["s", "t", "4. tool calls"], ["s", "a", "5. stream tokens (SSE)", { dash: true, via: [[2.8 + 80 / 240, 2.6], [80 / 240, 2.6]] }]] }));
}

// ================= 02-10 BUILDING BLOCKS =================
for (const S of SECTIONS) {
  if (!S.noSection) section(S.cat, S.no, S.label, S.theme, S.cat === "client" ? 'search "sd:client/" or "ai client"' : undefined);
  if (S.cat === "client" && !S.noSection) clientStarters();
  for (const [title, icon, kw] of S.items) add(S.cat, `${one(title)} - ${kw}${S.tags ? " " + S.tags : ""}`, comp(0, 0, { title, icon, theme: S.theme }).els);
}

// ================= 11 ZONES =================
section("zone", "14", "Boundaries & zones", "ops");
const zone = (w, h, label, c, o = {}) => [rect(0, 0, w, h, { strokeColor: c, backgroundColor: o.fill || "transparent", strokeWidth: 2, strokeStyle: o.solid ? "solid" : "dashed", roundness: o.round === false ? null : { type: 3 } }),
  txt(14, 10, label, { fontSize: 18, strokeColor: c })];
add("zone", "Region - cloud region us-east eu-west", zone(560, 360, "Region: eu-west-1", "#1971c2"));
add("zone", "Availability Zone - az datacenter", zone(260, 300, "AZ a", "#0c8599"));
add("zone", "VPC - virtual private cloud network", zone(520, 340, "VPC 10.0.0.0/16", "#2f9e44"));
add("zone", "Public Subnet - dmz internet facing", zone(240, 200, "Public subnet", "#2f9e44", { fill: "#ebfbee" }));
add("zone", "Private Subnet - internal", zone(240, 200, "Private subnet", "#495057", { fill: "#f8f9fa" }));
add("zone", "Kubernetes Cluster - k8s namespace", zone(520, 320, "Kubernetes cluster", "#4263eb"));
add("zone", "Trust Boundary - security perimeter", zone(420, 280, "Trust boundary", "#e03131"));
add("zone", "Group Box - logical component group", zone(360, 240, "Group name", "#868e96", { solid: true }));
add("zone", "Client Server Split - frontend backend divider", [poly(0, 0, [[0, 0], [0, 420]], { strokeColor: "#868e96", strokeWidth: 2, strokeStyle: "dashed" }),
  txt(-150, 4, "CLIENT SIDE", { fontSize: 16, strokeColor: "#868e96" }), txt(18, 4, "SERVER SIDE", { fontSize: 16, strokeColor: "#868e96" })]);

// ================= 12 LINKS =================
section("link", "15", "Arrows & connectors", "ops", "drag ends onto boxes to bind");
const L = (label, o = {}) => [arr(0, 0, 220, 0, { strokeColor: o.c || "#495057", strokeWidth: 2, strokeStyle: o.s || "solid", startArrowhead: o.both ? "arrow" : null, ...(label ? { label: { text: label, fontSize: 14 } } : {}) })];
add("link", "HTTP Request - rest sync call", L("HTTPS / REST"));
add("link", "gRPC Call - rpc internal", L("gRPC"));
add("link", "Response - reply return", L("200 OK", { s: "dashed" }));
add("link", "WebSocket - bidirectional realtime", L("WebSocket", { both: true, c: ACCENT }));
add("link", "Async Event - message publish", L("event (async)", { s: "dashed", c: "#e67700" }));
add("link", "Replication - copy sync data", L("replication", { s: "dotted", c: "#2f9e44" }));
add("link", "Read Path - query", L("read", { c: "#1971c2" }));
add("link", "Write Path - mutate", L("write", { c: "#e03131" }));
add("link", "Request and Response - pair", [arr(0, 0, 220, 0, { strokeColor: "#495057", strokeWidth: 2, label: { text: "request", fontSize: 14 } }), arr(220, 44, 0, 44, { strokeColor: "#495057", strokeWidth: 2, strokeStyle: "dashed", label: { text: "response", fontSize: 14 } })]);
add("link", "Fan-out - one to many arrows", [0, 70, 140].map((y) => arr(0, 70, 200, y, { strokeColor: "#495057", strokeWidth: 2 })));
add("link", "Elbow Arrow - orthogonal route", [{ type: "arrow", x: 0, y: 0, points: [[0, 0], [110, 0], [110, 120], [220, 120]], strokeColor: "#495057", strokeWidth: 2, roundness: null, endArrowhead: "arrow" }]);

// ================= 13 UI =================
section("ui", "16", "UI components", "client", "wireframe building blocks");
for (const [n, f] of UI) add("ui", n, f());
section("frame", "17", "Device frames", "client");
for (const [n, f] of FRAMES) add("frame", n, f());
section("screen", "18", "Screen wireframes", "client", "ready UX screens");
for (const [n, f] of SCREENS) add("screen", n, f());

// ================= 16-17 PATTERNS & TEMPLATES =================
section("pattern", "19", "Architecture patterns", "svc");
for (const p of PATTERNS) add("pattern", p.name, diagram(p.spec));
section("agentic", "20", "Agentic patterns", "agent", "Anthropic: building effective agents");
for (const p of AGENTIC) add("agentic", p.name + " ai agent", diagram(p.spec));
section("tpl", "21", "Full interview designs", "ai", "classic questions, ready to adapt");
for (const p of [...TEMPLATES, ...AI_TEMPLATES]) add("tpl", p.name, diagram(p.spec));

// ================= build =================
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function finalize(skel) {
  const els = convertToExcalidrawElements(skel, { regenerateIds: false });
  const byId = new Map(els.map((e) => [e.id, e]));
  for (const e of els) {
    if (e.containerId && byId.get(e.containerId)) e.groupIds = [...byId.get(e.containerId).groupIds];
    if (e.type === "text" && !e.fontFamily) e.fontFamily = 5;
  }
  // one outer group per item when the item is not already one group
  const common = els[0].groupIds.length ? els[0].groupIds[els[0].groupIds.length - 1] : null;
  if (els.length > 1 && !(common && els.every((e) => e.groupIds.includes(common)))) {
    const g = nid("item");
    for (const e of els) e.groupIds = [...e.groupIds, g];
  }
  return els;
}

const applyDefaults = (s) => {
  const d = { roughness: 0, strokeWidth: 2, fillStyle: "solid", strokeColor: INK, ...s };
  if (d.type === "text") d.fontFamily = d.fontFamily || 5;
  if (d.label) d.label = { fontFamily: 5, ...d.label };
  return d;
};

window.BUILD = async () => {
  const created = 1793059200000; // 2026-10-27
  const libraryItems = [];
  const report = [];
  for (const it of items) {
    try {
      const elements = finalize(it.skel.map(applyDefaults));
      libraryItems.push({ id: "sdk-" + slug(it.name.replace(/^sd:/, "")), status: "unpublished", created, name: it.name, elements });
      report.push({ name: it.name, section: it.section, n: elements.length });
    } catch (e) { report.push({ name: it.name, error: String(e && e.stack || e) }); }
  }
  return { lib: { type: "excalidrawlib", version: 2, source: "https://excalidraw.com", libraryItems }, report, sections: SECTION_META };
};

window.SVG = async (els) => {
  const svg = await exportToSvg({ elements: els, appState: { exportBackground: true, viewBackgroundColor: "#ffffff", exportWithDarkMode: false }, files: {}, exportPadding: 14 });
  return svg.outerHTML;
};
