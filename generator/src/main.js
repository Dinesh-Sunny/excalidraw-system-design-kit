import { convertToExcalidrawElements, exportToSvg } from "@excalidraw/excalidraw";
import { T, ICONS, comp, rect, ell, txt, poly, arr, nid, INK, MUTED, ACCENT, WHITE } from "./core.js";
import { SECTIONS } from "./components.js";
import { diagram } from "./diagram.js";
import { TEMPLATES, PATTERNS } from "./templates.js";
import { AGENTIC, AI_TEMPLATES } from "./agentic.js";
import { AEO_TEMPLATES } from "./aeo.js";
import { RESEARCH_TEMPLATES } from "./research.js";
import { UI, FRAMES, SCREENS } from "./ui.js";
import { FE_SECTIONS, FE_PATTERNS, FE_TEMPLATES, FE_NOTES } from "./frontend.js";

const items = []; // {name, section, skel}
export const KIT = "sd", KIT_VERSION = "1.9.1";
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
add("guide", "Library guide - how to search insert", [rect(0, 0, 460, 350, { strokeColor: "#e67700", backgroundColor: "#fff9db", strokeWidth: 2,
  label: { text: "System Design & AI Architecture Kit v" + KIT_VERSION + "\n\nCmd/Ctrl + /  then type a name  ->  Enter\n   inserts the item (no dragging)\nLibrary search: every name starts \"sd:\"\n   \"sd:\" = whole kit, \"sd:data/\" = one section,\n   or just \"kafka\", \"redis\", \"agent\"...\n\nSections (sd:...): note client edge svc data\n cache msg ai agent rag llmops ops ext\n fe fep zone link ui frame screen pattern\n agentic tpl\n\nDouble-click a box to rename it.", fontSize: 16, textAlign: "left", verticalAlign: "top", strokeColor: INK } })]);
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
add("note", "Interview Flow - steps checklist 45 min", card(330, 250, "Interview flow (45 min)\n\n1. Requirements ............ 5 min\n2. Core entities ............. 2 min\n3. Estimates ................... 3 min\n4. API design .................. 5 min\n5. Data model .................. 5 min\n6. High-level design ....... 10 min\n7. Deep dives .................. 10 min\n8. Bottlenecks + wrap-up .. 5 min"));
add("note", "Requirements - functional non-functional", card(340, 330, "Requirements\n\nFunctional\n- Users can ...\n- Users can ...\n- Out of scope: ...\n\nNon-functional\n- Scale: DAU ..., QPS ...\n- Latency: p99 < ... ms\n- Availability: 99.9x %\n- Consistency: strong / eventual\n- Durability, security, cost"));
add("note", "Capacity Estimates - back of envelope qps storage", card(360, 300, "Back-of-envelope\n\nDAU: ...\nRead QPS = DAU x reads / 86,400 = ...\nWrite QPS = ...   Peak = 2-3 x avg\nStorage / day = writes x size = ...\n5 years = per day x 1,825 = ...\nBandwidth = QPS x payload = ...\nCache (80/20): 20% of daily reads\nServers = peak QPS / per-server QPS", { fs: 15 }));
add("note", "Core Entities - main objects nouns domain model checklist", card(340, 300, "Core entities (2 min)\n\nThe main things the system stores\nand moves. Nouns only, no columns yet.\n\n- User\n- ...\n- ...\n- ...\n\nHow they relate\n  User 1 : N ...\n  ... N : M ...\n\nAdd fields later in the data model", { stroke: "#2f9e44", fill: "#ebfbee" }));
add("note", "Core Entities Map - entity boxes relations 1 to n", (() => {
  const E = (x, y, name, f) => [rect(x, y, 170, 40, { strokeColor: "#2f9e44", backgroundColor: "#b2f2bb", strokeWidth: 2, roundness: null, label: { text: name, fontSize: 18, strokeColor: INK } }),
    rect(x, y + 40, 170, 16 + f.length * 20, { strokeColor: "#2f9e44", backgroundColor: WHITE, strokeWidth: 2, roundness: null, label: { text: f.join("\n"), fontSize: 14, textAlign: "left", verticalAlign: "top", strokeColor: INK, fontFamily: 3 } })];
  return [txt(0, 0, "Core entities", { fontSize: 20 }), ...E(0, 40, "User", ["id", "name"]), ...E(280, 40, "Post", ["id", "user_id", "text"]), ...E(140, 240, "Like", ["user_id", "post_id"]),
    arr(176, 80, 274, 80, { strokeColor: INK, strokeWidth: 2, label: { text: "1 : N", fontSize: 14 } }), arr(85, 146, 160, 234, { strokeColor: INK, strokeWidth: 2, label: { text: "1 : N", fontSize: 14 } }),
    arr(365, 166, 290, 234, { strokeColor: INK, strokeWidth: 2, label: { text: "1 : N", fontSize: 14 } })];
})());
add("note", "API Design - rest endpoints contract", card(400, 230, "API design\n\nPOST   /v1/items           -> 201 {id}\nGET    /v1/items/{id}      -> 200\nGET    /v1/items?cursor=&limit=20\nDELETE /v1/items/{id}      -> 204\n\nAuth: Bearer JWT · Idempotency-Key\nRate limited · cursor pagination", { fs: 14, font: 3, stroke: ACCENT, fill: "#edf2ff" }));
// ---------- data model: ERD boxes (Dinesh's template) ----------
// header = table name; rows = column | keys (PK FK UQ IX NN) | type | -> reference; footer = DB, index, shard and the "because"
// rows are one monospace text so a new row is one new line; relation lines are bound so they follow the boxes
const COL = (n, k = "", t = "", r = "") => (n.padEnd(13) + k.padEnd(9) + t.padEnd(10) + (r ? (r.startsWith("--") ? r : "→ " + r) : "")).trimEnd();
const snap = (v) => Math.ceil(v / 20) * 20;
function erd(x, y, name, rows, foot = [], o = {}) {
  const th = o.th || T.data, fs = 15, ffs = 13;
  const lines = rows.map((r) => (Array.isArray(r) ? COL(...r) : r));
  const longest = Math.max(...lines.map((l) => l.length), ...foot.map((f) => f.length * (ffs / fs)), name.length + 4);
  const w = o.w || Math.max(320, snap(longest * fs * 0.6 + 40));
  const head = nid("tbl"), body = nid("tbl"), bh = snap(22 + lines.length * fs * 1.25);
  const els = [
    rect(x, y, w, 40, { id: head, strokeColor: th.stroke, backgroundColor: th.fill, strokeWidth: 2, roundness: null, label: { text: name, fontSize: 18, strokeColor: INK, fontFamily: 3 } }),
    rect(x, y + 40, w, bh, { id: body, strokeColor: th.stroke, backgroundColor: WHITE, strokeWidth: 2, roundness: null, label: { text: lines.join("\n"), fontSize: fs, textAlign: "left", verticalAlign: "top", strokeColor: INK, fontFamily: 3 } }),
  ];
  let h = 40 + bh;
  if (foot.length) {
    const fh = snap(18 + foot.length * ffs * 1.25);
    els.push(rect(x, y + h, w, fh, { strokeColor: th.stroke, backgroundColor: "#f8f9fa", strokeWidth: 1, strokeStyle: "dashed", roundness: null, label: { text: foot.join("\n"), fontSize: ffs, textAlign: "left", verticalAlign: "top", strokeColor: MUTED, fontFamily: 3 } }));
    h += fh;
  }
  return { els, w, h, head, body, x, y };
}
// one-to-many: crow's foot "one" at the parent, "many" at the child
const rel = (a, b, x1, y1, x2, y2, label, kind = "1n") => arr(x1, y1, x2, y2, {
  start: { id: a }, end: { id: b }, strokeColor: INK, strokeWidth: 2,
  startArrowhead: kind === "11" || kind === "1n" ? "crowfoot_one" : "crowfoot_many", endArrowhead: kind === "11" ? "crowfoot_one" : "crowfoot_many",
  ...(label ? { label: { text: label, fontSize: 14, strokeColor: INK } } : {}) });
const SQL = { fill: "#b2f2bb", stroke: "#2f9e44" }, WIDE = { fill: "#ffd8a8", stroke: "#e8590c" };
const USERS = [["id", "PK", "bigint"], ["email", "UQ NN", "varchar"], ["name", "", "varchar"], ["created_at", "NN", "timestamp"]];

add("note", "Data Model - table entity schema", (() => { const t = erd(0, 0, "users", [...USERS, ["...", "", ""]], ["DB: Postgres · because: small, relational", "Index: email (UQ) → log in by email"]); return t.els; })());
add("note", "Data Model - one to many relation erd", (() => {
  const u = erd(0, 0, "users", USERS.slice(0, 3), ["DB: Postgres"]);
  const d = erd(0, u.h + 120, "documents", [["id", "PK", "uuid"], ["owner_id", "FK IX NN", "bigint", "users.id"], ["title", "", "varchar"], ["updated_at", "IX", "timestamp"], ["deleted_at", "", "timestamp", "-- null = live"]],
    ["Index: (owner_id, updated_at) → my docs, newest first", "Soft delete: deleted_at lets users undo"]);
  return [...u.els, ...d.els, rel(u.body, d.head, 120, u.h, 120, u.h + 120, "1 : N  owns")];
})());
add("note", "Join Table - many to many n:m erd composite key data model", (() => {
  const u = erd(0, 0, "users", USERS.slice(0, 2)), d = erd(560, 0, "documents", [["id", "PK", "uuid"], ["title", "", "varchar"]]);
  const p = erd(240, 260, "permissions", [["doc_id", "PK FK", "uuid", "documents.id"], ["user_id", "PK FK IX", "bigint", "users.id"], ["role", "NN", "varchar", "-- viewer|editor"], ["granted_at", "", "timestamp"]],
    ["PK (doc_id, user_id): one role per user per doc", "Index: user_id → docs shared with me", "DB: Postgres · strong consistency"]);
  return [...u.els, ...d.els, ...p.els, rel(u.body, p.head, 120, u.h, 300, 260, "1 : N"), rel(d.body, p.head, 680, d.h, 600, 260, "1 : N"),
    txt(0, p.y + p.h + 30, "users N : M documents = a join table holding the pairs", { fontSize: 16, strokeColor: MUTED })];
})());
add("note", "Wide-Column Table - partition key clustering key cassandra data model", (() => {
  const t = erd(0, 0, "edits", [["doc_id", "PK·part", "uuid"], ["version", "PK·clust", "bigint"], ["op_id", "UQ", "uuid", "-- dedupe retries"], ["user_id", "FK", "bigint"], ["type", "NN", "varchar"], ["payload", "", "text"], ["created_at", "", "timestamp"]],
    ["DB: Cassandra / Bigtable · append-only, huge writes", "Query: edits of one doc after version N", "Shard key: doc_id"], { th: WIDE });
  return [...t.els, txt(0, t.h + 30, "Partition key = which machine holds it.\nClustering key = sort order inside it.", { fontSize: 16, strokeColor: MUTED })];
})());
add("note", "Keys and Types - pk fk uq ix nn bigint uuid legend data model", card(460, 400,
  "Keys and types\n\nPK  primary key, unique row id\nFK  points to another table's PK\nUQ  no two rows share it\nIX  indexed, a query is fast\nNN  never empty\n\nbigint     counting id, one DB hands it out\nuuid       any device makes it, works offline\nvarchar    short text\ntext       long text\ntimestamp  store in UTC\njsonb      flexible extra fields\nenum       a fixed set of values",
  { fs: 15, font: 3, stroke: "#2f9e44", fill: "#ebfbee" }));
add("note", "Query Check - api call to index fast path data model", card(460, 340,
  "Every API call has a fast path\n\nGET /items/{id}\n  one row by id  →  PK\nGET /items?cursor=\n  mine, newest first  →  IX (owner_id, created_at)\nshared with me\n  rows by user  →  IX (user_id)\nappend event\n  by parent, in order  →  partition + cluster key",
  { fs: 14, font: 3, stroke: "#1971c2", fill: "#e7f5ff" }));
add("note", "Data Model Card - db choice index shard storage template", card(400, 380,
  "Data model\n\n<table>   DB: ... because ...\n  id PK, ...FK, fields\n  Index: (...) → for which query\n  Shard key: ...\n\nSQL: related data that must be right\nWide-column: huge append-only writes\nBig files → object storage\nHot data → cache\nTemporary → Redis with expiry",
  { fs: 15 }));
add("note", "Data Model Example - google docs collaborative editor erd", (() => {
  const u = erd(0, 0, "users", USERS.slice(0, 3), ["DB: Postgres"]);
  const p = erd(440, 0, "permissions", [["doc_id", "PK FK", "uuid"], ["user_id", "PK FK IX", "bigint"], ["role", "NN", "varchar"]], ["DB: Postgres · strong"]);
  const d = erd(880, 0, "documents", [["id", "PK", "uuid"], ["owner_id", "FK IX", "bigint"], ["title", "", "varchar"], ["version", "", "bigint"]], ["Index: (owner_id, updated_at)"]);
  const yb = Math.max(u.h, p.h, d.h) + 140;
  const e = erd(520, yb, "edits", [["doc_id", "PK·part", "uuid"], ["version", "PK·clust", "bigint"], ["op_id", "UQ", "uuid"], ["user_id", "FK", "bigint"], ["op", "", "text"]], ["DB: Cassandra · shard: doc_id"], { th: WIDE });
  const s2 = erd(940, yb, "snapshots", [["doc_id", "PK FK", "uuid"], ["version", "PK", "bigint"], ["storage_key", "", "varchar"]], ["Content in object storage"]);
  const dx = d.x + d.w / 2, yc = yb + Math.max(e.h, s2.h) + 50;
  return [...u.els, ...p.els, ...d.els, ...e.els, ...s2.els,
    rel(u.body, p.body, u.w, 80, 440, 80, "1 : N"), rel(d.body, p.body, 880, 80, 440 + p.w, 80, "1 : N"),
    rel(d.body, e.head, dx - 60, d.h, e.x + e.w / 2, yb, "1 : N"), rel(d.body, s2.head, dx + 60, d.h, s2.x + s2.w / 2, yb, "1 : N"),
    ...card(440, 160, "Not tables\n\nPresence (cursors) → Redis, 30 s expiry\nHot snapshots → Redis cache\nSnapshot files → object storage", { fs: 15, stroke: "#868e96", fill: "#f8f9fa", dash: true }).map((r) => ({ ...r, x: 0, y: yb })),
    txt(0, yc, "Say: users, documents and permissions need joins and must be right, so Postgres.\nEdits are append-only and huge, so a wide-column store split by doc_id.", { fontSize: 16, strokeColor: MUTED })];
})());
add("note", "Trade-offs - pros cons decision", card(340, 200, "Trade-off\n\nChose: ...\n+ gains ...\n- costs ...\nAlternative: ... (why not)", { stroke: "#1971c2", fill: "#e7f5ff" }));
add("note", "Bottleneck - spof risk callout", card(300, 150, "! Bottleneck / SPOF\n\nRisk: ...\nFix: replicate / shard / cache / queue", { stroke: "#e03131", fill: "#fff5f5", dash: true }));
add("note", "Deep Dive - focus area", card(300, 170, "Deep dive: ...\n\n- How it works\n- Failure modes\n- Scaling it 10x", { stroke: "#6741d9", fill: "#f3f0ff" }));
add("note", "Latency Numbers - cheat sheet every engineer", card(380, 290, "Latency numbers (approx.)\n\nL1 cache ref ................... 0.5 ns\nMain memory ref .............. 100 ns\nSSD random read ............. ~100 us\nRead 1 MB from memory ...... ~250 us\nSame-DC round trip .......... 0.5 ms\nRead 1 MB from SSD .......... ~1 ms\nDisk seek ...................... 10 ms\nCross-continent round trip .. ~150 ms", { fs: 14, font: 3, stroke: "#495057", fill: "#f8f9fa" }));
add("note", "Capacity Cheat Sheet - powers of two availability nines", card(380, 280, "Quick maths\n\n2^10 ~ 1 thousand (KB)\n2^20 ~ 1 million   (MB)\n2^30 ~ 1 billion   (GB)\n2^40 ~ 1 trillion  (TB)\n1 day = 86,400 s ~ 10^5 s\n1M req/day ~ 12 req/s\n99.9%  = 8.8 h down / year\n99.99% = 53 min down / year", { fs: 14, font: 3, stroke: "#495057", fill: "#f8f9fa" }));
add("note", "Title - diagram heading", [txt(0, 0, "System Design: <name>", { fontSize: 36 }), txt(0, 52, "scale · latency · key constraint", { fontSize: 20, strokeColor: MUTED })]);
add("note", "Sticky Note - yellow", card(200, 140, "Note", { stroke: "#f08c00", fill: "#ffec99", fs: 18 }));
add("note", "Sticky Note - blue question", card(200, 140, "Question for interviewer", { stroke: "#1971c2", fill: "#a5d8ff", fs: 18 }));
add("note", "Sticky Note - pink assumption", card(200, 140, "Assumption", { stroke: "#c2255c", fill: "#fcc2d7", fs: 18 }));
for (let i = 1; i <= 9; i++) add("note", `Step ${i} - numbered flow marker`, [ell(0, 0, 36, 36, { strokeColor: ACCENT, backgroundColor: ACCENT, strokeWidth: 1 }), txt(i === 1 ? 14 : 12.5, 7, String(i), { fontSize: 18, strokeColor: WHITE })]);
for (const [n, t, o] of FE_NOTES) add("note", n, card(o.font ? 380 : 360, 200, t, o));

// ---- client starters: the first thing you drop in every design ----
function clientGroup(label, cards, theme, out) {
  // 2 x 2 grid: compact footprint that sits next to a gateway without stretching the canvas
  const W = 160, H = 100, G = 20, COLS = 2, els = [];
  const rows = Math.ceil(cards.length / COLS), w = COLS * W + (COLS + 1) * G, h = 60 + rows * H + (rows - 1) * G + G;
  els.push(rect(0, 0, w, h, { strokeColor: T[theme].stroke, backgroundColor: "transparent", strokeWidth: 2, strokeStyle: "dashed" }),
    txt(20, 14, label, { fontSize: 20, strokeColor: T[theme].stroke }), txt(w - 20 - out.length * 7.6, 18, out, { fontSize: 14, strokeColor: MUTED }));
  cards.forEach(([t, i, th], k) => els.push(...comp(G + (k % COLS) * (W + G), 60 + Math.floor(k / COLS) * (H + G), { title: t, icon: i, theme: th || theme, w: W, h: H }).els));
  return els;
}
function clientStarters() {
  add("client", "Clients Group - all devices mobile tablet laptop web client clients starter", clientGroup("Clients", [["Mobile", "mobile"], ["Tablet", "tablet"], ["Laptop", "laptop"], ["Web", "browser"]], "client", "HTTPS"));
  add("client", "AI Clients Group - chat app agent mcp voice ai client clients starter", clientGroup("AI Clients", [["AI Chat App", "aichat"], ["AI Agent", "robot"], ["MCP Client", "plug"], ["Voice AI", "waveform"]], "ai", "API key / OAuth"));
  add("client", "First Request - classic dns cdn lb gateway client clients starter", diagram({ nodes: [["c", "Clients\n(web, mobile)", "users", "client", 0, 1], ["dns", "DNS", "dns", "edge", 1.4, 0], ["cdn", "CDN\n(static files)", "globe", "edge", 1.4, 2],
    ["lb", "Load Balancer", "lb", "edge", 1.4, 1], ["gw", "API Gateway", "gateway", "edge", 2.8, 1], ["s", "Services", "service", "svc", 2.8, 2]],
    edges: [["c", "dns", "1. resolve"], ["c", "cdn", "2. assets"], ["c", "lb", "3. HTTPS API"], ["lb", "gw", "4."], ["gw", "s", "5. route"]] }));
  add("client", "First Request - AI llm gateway streaming ai client clients starter", diagram({ nodes: [["a", "AI Clients\n(app, agent, MCP)", "robot", "ai", 0, 0, 160], ["gw", "API Gateway\n(auth, token limits)", "gateway", "edge", 1.4, 0, 160],
    ["s", "AI Service\n(orchestrator)", "service", "svc", 2.8, 0, 160], ["llm", "LLM", "sparkle", "ai", 2.1, 1.3], ["t", "Tools / MCP", "wrench", "ai", 3.5, 1.3]],
    edges: [["a", "gw", "1. request"], ["gw", "s", "2."], ["s", "llm", "3. prompt"], ["s", "t", "4. tool calls"], ["s", "a", "5. stream tokens (SSE)", { dash: true, via: [[2.8 + 80 / 240, -0.55], [80 / 240, -0.55]] }]] }));
}

// ================= 02-10 BUILDING BLOCKS =================
for (const S of SECTIONS) {
  if (!S.noSection) section(S.cat, S.no, S.label, S.theme, S.cat === "client" ? 'search "sd:client/" or "ai client"' : undefined);
  if (S.cat === "client" && !S.noSection) clientStarters();
  for (const [title, icon, kw] of S.items) add(S.cat, `${one(title)} - ${kw}${S.tags ? " " + S.tags : ""}`, comp(0, 0, { title, icon, theme: S.theme }).els);
}

// ================= 22 FRONTEND BLOCKS =================
for (const S of FE_SECTIONS) {
  if (!S.noSection) section(S.cat, S.no, S.label, S.theme, 'search "sd:fe/" or "frontend"');
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

// loop links (v1.7.1): curved arrows for agent / tool-call loops
const ARC = (cx, cy, r, a0, a1, n = 7) => Array.from({ length: n }, (_, k) => { const t = (a0 + (a1 - a0) * k / (n - 1)) * Math.PI / 180; return [Math.round(cx + r * Math.cos(t)), Math.round(cy + r * Math.sin(t))]; });
const curve = (pts, o = {}) => ({ type: "arrow", x: pts[0][0], y: pts[0][1], points: pts.map(([a, b]) => [a - pts[0][0], b - pts[0][1]]), roundness: { type: 2 }, strokeWidth: 2, strokeColor: o.c || "#495057", strokeStyle: o.s || "solid", endArrowhead: "arrow", startArrowhead: null, ...(o.label ? { label: { text: o.label, fontSize: 14 } } : {}) });
add("link", "Loop Arrow - circular cycle repeat loop agent loop tool loop", [curve(ARC(70, 70, 60, -60, 250, 9), { c: "#9c36b5" }), txt(46, 60, "loop", { fontSize: 16, strokeColor: "#9c36b5" })]);
add("link", "Tool Call Loop - llm calls tool result back two way loop agent", [curve(ARC(110, 70, 100, 200, 340), { c: "#9c36b5", label: "tool call" }), curve(ARC(110, 30, 100, 20, 160), { c: "#2f9e44", label: "result" })]);
add("link", "Self Loop - repeat until done retry same box loop", [{ type: "arrow", x: 0, y: 0, points: [[0, 0], [60, 0], [60, -80], [-80, -80], [-80, -26]], strokeColor: "#9c36b5", strokeWidth: 2, roundness: null, endArrowhead: "arrow", startArrowhead: null },
  txt(-40, -112, "repeat until done", { fontSize: 14, strokeColor: "#9c36b5" })]);
add("link", "Agent Loop Ring - think act observe reason tool loop react", [curve(ARC(100, 100, 80, -80, 30, 5), { c: "#9c36b5" }), curve(ARC(100, 100, 80, 40, 150, 5), { c: "#9c36b5" }), curve(ARC(100, 100, 80, 160, 270, 5), { c: "#9c36b5" }),
  txt(150, 20, "think", { fontSize: 16, strokeColor: "#9c36b5" }), txt(132, 176, "act", { fontSize: 16, strokeColor: "#9c36b5" }), txt(-62, 92, "observe", { fontSize: 16, strokeColor: "#9c36b5" })]);
add("link", "Retry Loop - backoff retry dashed loop", [curve(ARC(70, 70, 60, -60, 250, 9), { c: "#e67700", s: "dashed" }), txt(40, 52, "retry", { fontSize: 16, strokeColor: "#e67700" }), txt(30, 72, "+ backoff", { fontSize: 13, strokeColor: "#e67700" })]);

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
section("fep", "23", "Frontend patterns", "client", "rendering, data, realtime, performance");
for (const p of FE_PATTERNS) add("fep", p.name, diagram(p.spec));
section("tpl", "21", "Full interview designs", "ai", "classic questions, ready to adapt");
for (const p of [...TEMPLATES, ...AI_TEMPLATES, ...AEO_TEMPLATES, ...RESEARCH_TEMPLATES, ...FE_TEMPLATES]) add("tpl", p.name, diagram(p.spec));

// ================= 24 EMOJI =================
// every Unicode emoji and skin tone, named for library search (data: emoji-data.py from emojibase-data)
import EMOJI from "../emoji.data.json";
section("emoji", "24", "Emoji", "msg", 'search "sd:emoji/" or a word like "rocket"');
for (const [name, ch] of EMOJI) add("emoji", name.replace(/^sd:emoji\/ /, ""), [txt(0, 0, ch, { fontSize: 56 })]);

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
      // emoji: sequences the build machine's font can't join measure as several glyphs; current systems draw one
      if (it.section === "emoji" && elements.length === 1 && elements[0].type === "text" && elements[0].width > 72) elements[0].width = 70;
      libraryItems.push({ id: "sdk-" + slug(it.name.replace(/^sd:/, "")), status: "unpublished", created, name: it.name, elements });
      report.push({ name: it.name, section: it.section, n: elements.length });
    } catch (e) { report.push({ name: it.name, error: String(e && e.stack || e) }); }
  }
  return { lib: { type: "excalidrawlib", version: 2, source: "https://excalidraw.com", libraryItems }, report, sections: SECTION_META };
};

// practice mode: each full design built up one block at a time, on a fixed frame (plus scenario variants with extra blocks)
import V2 from "../practice.v2.json";
async function practiceBuild(spec) {
  const minR = Math.min(...spec.nodes.map((n) => n[5]));
  const full = finalize(diagram({ ...spec, notes: undefined }).map(applyDefaults));
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const e of full) { const pts = e.points ? e.points.map((p) => [e.x + p[0], e.y + p[1]]) : [[e.x, e.y], [e.x + e.width, e.y + e.height]]; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } }
  const sk = diagram({ ...spec, notes: undefined }), OX = x0 - 10 - 14, OY = y0 - 10 - 14, boxes = {};
  for (const n of spec.nodes) { const r = sk.find((e) => e.type === "rectangle" && String(e.id || "").startsWith("n" + n[0] + "_")); if (r) boxes[n[0]] = [r.x - OX, r.y - OY, r.width, r.height]; }
  const frame = { type: "rectangle", x: x0 - 10, y: y0 - 10, width: x1 - x0 + 20, height: y1 - y0 + 20, strokeColor: "transparent", backgroundColor: "transparent" };
  const steps = [];
  for (let k = 1; k <= spec.nodes.length; k++) {
    const ids = new Set(spec.nodes.slice(0, k).map((n) => n[0]));
    const sub = { ...spec, notes: undefined, minR, nodes: spec.nodes.slice(0, k), edges: spec.edges.filter((e) => ids.has(e[0]) && ids.has(e[1])) };
    steps.push(await window.SVG(finalize([frame, ...diagram(sub)].map(applyDefaults))));
  }
  return { boxes, size: [x1 - x0 + 20 + 28, y1 - y0 + 20 + 28], nodes: spec.nodes.map((n) => ({ id: n[0], title: n[1].replace(/\n/g, " "), icon: n[2] })), edges: spec.edges.map((e) => [e[0], e[1], e[2] || ""]), steps };
}
const pslug = (name) => name.toLowerCase().split(" - ")[0].replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
window.PRACTICE = async () => {
  const out = [];
  for (const t of [...TEMPLATES, ...AI_TEMPLATES, ...AEO_TEMPLATES, ...RESEARCH_TEMPLATES, ...FE_TEMPLATES]) {
    const spec = t.spec, base = await practiceBuild(spec), variants = {}, v2 = V2[pslug(t.name)] || {};
    for (const sc of v2.scenarios || []) {
      if (!sc.add || !sc.add.nodes || !sc.add.nodes.length) continue;
      // place each new block in a free grid spot next to its anchor, where its arrow won't cross other blocks
      const placed = spec.nodes.map((n) => [n[0], n[4], n[5]]);
      const free = (c, r) => placed.every(([, pc, pr]) => Math.abs(pc - c) > 1.0 || Math.abs(pr - r) > 0.9);
      const clear = (c0, r0, c1, r1, skip) => { for (let t = 0.15; t < 0.9; t += 0.05) { const c = c0 + (c1 - c0) * t, r = r0 + (r1 - r0) * t; if (placed.some(([id, pc, pr]) => !skip.includes(id) && Math.abs(pc - c) < 0.5 && Math.abs(pr - r) < 0.45)) return false; } return true; };
      const OFF = [[1.3, 0], [0, 1.2], [0, -1.2], [-1.3, 0], [1.3, 1.2], [1.3, -1.2], [-1.3, 1.2], [-1.3, -1.2], [2.6, 0], [0, 2.4], [0, -2.4], [2.6, 1.2], [2.6, -1.2], [-2.6, 0]];
      const added = sc.add.nodes.map(([id, title, icon, theme, anchor]) => {
        const e0 = sc.add.edges.find((e) => e[0] === id || e[1] === id), link = e0 ? (e0[0] === id ? e0[1] : e0[0]) : anchor;
        const an = placed.find((n) => n[0] === link) || placed.find((n) => n[0] === anchor) || placed[0];
        let spot = OFF.map(([dc, dr]) => [an[1] + dc, an[2] + dr]).find(([c, r]) => c >= -0.01 && free(c, r) && clear(an[1], an[2], c, r, [an[0]]));
        if (!spot) spot = [an[1], Math.max(...placed.map((n) => n[2])) + 1.3];
        placed.push([id, spot[0], spot[1]]);
        return [id, title, icon, theme, spot[0], spot[1]];
      });
      variants[sc.id] = await practiceBuild({ ...spec, nodes: [...spec.nodes, ...added], edges: [...spec.edges, ...sc.add.edges] });
    }
    out.push({ name: t.name, title: spec.title, notes: spec.notes || "", ...base, variants });
  }
  return out;
};

window.SVG = async (els) => {
  const svg = await exportToSvg({ elements: els, appState: { exportBackground: true, viewBackgroundColor: "#ffffff", exportWithDarkMode: false }, files: {}, exportPadding: 14 });
  return svg.outerHTML;
};
