/* ---- Estimator: rough numbers in, non-functional requirements out ---- */
const REPO = "https://github.com/Dinesh-Sunny/excalidraw-system-design-kit";
const MAC = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
const RM = matchMedia("(prefers-reduced-motion: reduce)");
const store = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
const ev = p => { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: p, title: p, event: true }); } catch (e) {} };
const GC = SP.goatcounter; if (GC) { const s = document.createElement("script"); s.async = true; s.src = "https://gc.zgo.at/count.js"; s.dataset.goatcounter = `https://${GC}.goatcounter.com/count`; document.head.append(s); }
const toast = $("#toast");
function say(t, act, fn) { toast.textContent = t; toast.classList.toggle("act", !!act); if (act) { const b = document.createElement("button"); b.type = "button"; b.textContent = act; b.onclick = () => { fn(); toast.classList.remove("on"); }; toast.append(b); } toast.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(() => toast.classList.remove("on"), act ? 5000 : 2400); }

/* ---------- numbers: friendly rounding, decimal units like an interview whiteboard ---------- */
const trim = x => { const a = Math.abs(x); if (a >= 10) return Math.round(x).toLocaleString("en"); if (a >= 1) return String(Math.round(x * 10) / 10); if (a === 0) return "0"; return String(+x.toPrecision(2)); };
const N = n => { const a = Math.abs(n); for (const [v, s] of [[1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "K"]]) if (a >= v * 0.9995) return trim(n / v) + s; return trim(n); };
const B = b => { const a = Math.abs(b); for (const [v, s] of [[1e18, "EB"], [1e15, "PB"], [1e12, "TB"], [1e9, "GB"], [1e6, "MB"], [1e3, "KB"]]) if (a >= v * 0.9995) return trim(b / v) + " " + s; return trim(b) + " B"; };
const BIT = bps => { const g = bps * 8; for (const [v, s] of [[1e12, "Tbps"], [1e9, "Gbps"], [1e6, "Mbps"], [1e3, "Kbps"]]) if (g >= v * 0.9995) return trim(g / v) + " " + s; return trim(g) + " bps"; };
const MS = ms => ms >= 1000 ? trim(ms / 1000) + " s" : ms >= 1 ? trim(ms) + " ms" : trim(ms * 1000) + " µs";
const DUR = s => s >= 86400 * 2 ? trim(s / 86400) + " days" : s >= 3600 ? trim(s / 3600) + " h" : s >= 60 ? trim(s / 60) + " min" : s >= 1 ? trim(s) + " s" : trim(s * 1000) + " ms";
const PCT = p => (p >= 99.99995 ? p.toFixed(7) : p >= 99.9995 ? p.toFixed(5) : p >= 99.995 ? p.toFixed(4) : p >= 99.95 ? p.toFixed(3) : p.toFixed(2)).replace(/0+$/, "").replace(/\.$/, "") + "%";
const exact = v => { for (const [m, s] of [[1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "K"]]) if (v >= m && Math.abs(Math.round(v / m * 1000) - v / m * 1000) < 1e-6) return +(v / m).toFixed(3) + s; return String(+(+v).toPrecision(6)); };
const UNIT = { "": 1, k: 1e3, thousand: 1e3, m: 1e6, mn: 1e6, million: 1e6, b: 1e9, bn: 1e9, billion: 1e9, t: 1e12, trillion: 1e12 };
const BUNIT = { b: 1, byte: 1, bytes: 1, kb: 1e3, k: 1e3, mb: 1e6, m: 1e6, gb: 1e9, g: 1e9, tb: 1e12, t: 1e12, pb: 1e15, p: 1e15, kib: 1024, mib: 1048576, gib: 1073741824, tib: 1099511627776 };
function parse(str, kind) {
  const m = String(str).trim().toLowerCase().replace(/,/g, "").replace(/^~|^≈/, "").match(/^(\d*\.?\d+(?:e[+-]?\d+)?)\s*([a-z]*)\s*(?:\/s)?$/);
  if (!m) return null; const x = parseFloat(m[1]), u = m[2];
  if (kind === "b") { const f = u === "" ? 1 : BUNIT[u]; return f ? x * f : null; }
  if (kind === "p" || kind === "ms") return u === "" || u === "%" || u === "ms" ? x : u === "s" ? x * 1000 : null;
  const f = UNIT[u]; return f === undefined ? null : x * f;
}

/* ---------- inputs ---------- */
const F = {
  u: { l: "Daily active users", k: "n", min: 1e3, max: 1e10, d: 1e7, em: "users" },
  w: { l: "Writes per user a day", sub: "posts, messages, uploads", k: "n", min: 0.01, max: 1e5, d: 2, em: "each" },
  r: { l: "Reads per write", sub: "how often each new thing is read", k: "n", min: 0.1, max: 1e4, d: 10, em: "×" },
  p: { l: "Peak vs average", sub: "busiest minute against a usual one", k: "n", min: 1, max: 1000, d: 3, em: "×" },
  s: { l: "Size per write", k: "b", min: 10, max: 1e10, d: 1000 },
  y: { l: "Keep data for", k: "n", min: 0.1, max: 30, d: 5, em: "years" },
  c: { l: "Copies of each write", sub: "replication", seg: [1, 2, 3, 5], d: 3, fmt: v => v + "×" },
  l: { l: "Latency target, p99", sub: "99 of 100 requests finish within", k: "ms", min: 1, max: 60000, d: 200, em: "ms", chips: [50, 100, 200, 500, 1000] },
  a: { l: "Availability target", seg: [99, 99.9, 99.95, 99.99, 99.999], d: 99.9, fmt: v => v + "%" },
  rs: { l: "Size per read", sub: "what one read sends back", k: "b", min: 10, max: 1e10, d: 1000 },
  g: { l: "Plan for growth", sub: "traffic you expect in a year or two", seg: [1, 2, 5, 10], d: 1, fmt: v => v + "×" },
  sv: { l: "One server handles", sub: "requests a second, a common starting guess", k: "n", min: 10, max: 1e6, d: 2000, em: "req/s" },
  dk: { l: "Disk per storage node", k: "b", min: 1e11, max: 1e15, d: 1e13 },
  h: { l: "Hot share kept in cache", sub: "of a day's reads (the 80/20 rule)", k: "p", min: 1, max: 100, d: 20, em: "%", lin: true },
  m: { l: "Memory per cache node", k: "b", min: 1e9, max: 2e12, d: 64e9 }
};
const GROUPS = [["Traffic", ["u", "w", "r", "p"]], ["Data", ["s", "y", "c"]], ["Targets", ["l", "a"]]];
const FINE = ["rs", "g", "sv", "dk", "h", "m"];
const DEF = Object.fromEntries(Object.entries(F).map(([k, f]) => [k, f.d]));

/* latency steps, from the classic "Latency numbers every programmer should know" list */
const HOPS = [
  { id: "dc", t: "Hop in one data center", f: "Round trip inside one data center", ms: 0.5, g: "Network" },
  { id: "sea", t: "Hop across an ocean", f: "Round trip across an ocean", ms: 150, g: "Network" },
  { id: "mem", t: "Memory, 1 MB read", f: "Read 1 MB from memory", ms: 0.25, g: "Storage" },
  { id: "ssd4", t: "SSD, small random read", f: "Read 4 KB at random from SSD", ms: 0.15, g: "Storage" },
  { id: "ssd", t: "SSD, 1 MB read", f: "Read 1 MB from SSD", ms: 1, g: "Storage" },
  { id: "seek", t: "Disk seek", f: "Disk seek", ms: 10, g: "Storage" },
  { id: "hdd", t: "Disk, 1 MB read", f: "Read 1 MB from disk", ms: 20, g: "Storage" },
  { id: "tok", t: "LLM, one output token", f: "Frontier LLM, one output token", ms: 20, g: "AI models" },
  { id: "ltt", t: "Local LLM, first token", f: "Local LLM, first token", ms: 75, g: "AI models" },
  { id: "ftt", t: "Fast LLM, first token", f: "Fast LLM, first token", ms: 250, g: "AI models" },
  { id: "llm", t: "LLM, first token", f: "Frontier LLM, first token", ms: 1000, g: "AI models" },
  { id: "llms", t: "LLM, short answer", f: "Frontier LLM, short answer (~100 tokens)", ms: 3000, g: "AI models" }
];
const HOP = Object.fromEntries(HOPS.map(h => [h.id, h]));
const HCOL = { Network: "var(--atmo-sky-mid)", Storage: "var(--sketch)", "AI models": "var(--atmo-dusk-1)" };
const DEFHOPS = ["dc", "dc", "ssd4", "dc"];

/* starting points: the same numbers as the practice questions */
const PRE = [
  { q: "url-shortener", t: "URL Shortener", s: "100M new links a day, 100 reads each", v: { u: 1e8, w: 1, r: 100, p: 4, s: 500, rs: 500, y: 5, l: 50, a: 99.99 }, hops: ["dc", "dc", "dc"] },
  { q: "chat-system", t: "Chat System", s: "500M users, 40 messages each", v: { u: 5e8, w: 40, r: 1, p: 3, s: 100, rs: 100, y: 5, l: 200, a: 99.99 }, hops: ["dc", "dc", "ssd4", "dc"] },
  { q: "news-feed", t: "News Feed", s: "300M users, 10 feed loads a day", v: { u: 3e8, w: 0.5, r: 20, p: 3, s: 1000, rs: 1e4, y: 5, l: 200, a: 99.95 }, hops: ["dc", "dc", "dc", "mem"] },
  { q: "proximity-service", t: "Proximity Service", s: "100M users, 5 searches each", v: { u: 1e8, w: 0.05, r: 100, p: 5, s: 1000, rs: 5000, y: 5, l: 100, a: 99.95 }, hops: ["dc", "dc", "ssd4"] },
  { q: "search-autocomplete", t: "Search Autocomplete", s: "10B searches, 5 keystrokes each", v: { u: 1e9, w: 10, r: 5, p: 2, s: 100, rs: 200, y: 1, l: 100, a: 99.95 }, hops: ["dc", "dc", "mem"] },
  { q: "ride-sharing", t: "Ride Sharing", s: "1M drivers sharing location every 4 s", v: { u: 1e6, w: 21600, r: 0.2, p: 2, s: 100, rs: 100, y: 0.1, l: 500, a: 99.99 }, hops: ["dc", "dc", "mem", "dc"] },
  { q: "notification-system", t: "Notification System", s: "10M notifications a day, big bursts", v: { u: 1e7, w: 1, r: 1, p: 80, s: 1000, rs: 1000, y: 1, l: 1000, a: 99.9 }, hops: ["dc", "dc", "ssd4", "sea"] },
  { q: "payment-system", t: "Payment System", s: "1M payments a day, 100× on sale days", v: { u: 1e6, w: 1, r: 2, p: 100, s: 2000, rs: 2000, y: 7, l: 500, a: 99.99 }, hops: ["dc", "dc", "ssd4", "dc", "sea"] },
  { q: "llm-chat-app", t: "LLM Chat App", s: "1M users, 20 messages each", v: { u: 1e6, w: 20, r: 1, p: 3, s: 4000, rs: 4000, y: 2, l: 1000, a: 99.9 }, hops: ["dc", "dc", "llm"] }
];
const PQ = Object.fromEntries(PRE.map(p => [p.q, p]));

let S = { ...DEF }, Q = "", H = [...DEFHOPS];

/* ---------- state <-> link ---------- */
function toHash() {
  const p = [];
  if (Q) p.push("q=" + Q);
  const base = Q ? { ...DEF, ...PQ[Q].v } : DEF;
  for (const k in F) if (S[k] !== base[k]) p.push(k + "=" + exact(S[k]));
  const bh = Q ? (PQ[Q].hops || DEFHOPS) : DEFHOPS;
  if (H.join(".") !== bh.join(".")) p.push("hp=" + (H.join(".") || "-"));
  return p.join("&");
}
function fromHash(h) {
  const o = new URLSearchParams(h.replace(/^#/, "")); if (![...o.keys()].length) return false;
  const q = o.get("q"); Q = PQ[q] ? q : "";
  S = { ...DEF, ...(Q ? PQ[Q].v : {}) }; H = [...(Q ? (PQ[Q].hops || DEFHOPS) : DEFHOPS)];
  for (const k in F) if (o.has(k)) { const v = F[k].seg ? parseFloat(o.get(k)) : parse(o.get(k), F[k].k === "ms" || F[k].k === "p" ? F[k].k : F[k].k === "b" ? "b" : "n"); if (v != null && isFinite(v) && v >= 0) S[k] = v; }
  if (o.has("hp")) H = o.get("hp").split(".").filter(x => HOP[x]);
  return true;
}
let _lt = 0;
function persist() { store("sdk-estimate", { S, Q, H }); clearTimeout(_lt); _lt = setTimeout(() => { const h = toHash(); history.replaceState(null, "", h ? "#" + h : location.pathname + location.search); }, 250); }

/* ---------- the maths (every number shown comes from here) ---------- */
function calc() {
  const g = S.g, wDay = S.u * S.w * g, w = wDay / 86400, r = w * S.r, pk = S.p;
  const wp = w * pk, rp = r * pk, tp = wp + rp;
  const day = wDay * S.s, raw = day * 365 * S.y, store_ = raw * S.c, nodes = Math.max(1, Math.ceil(store_ / S.dk));
  const inB = w * S.s, outB = r * S.rs, outP = rp * S.rs, inP = wp * S.s;
  const cache = r * 86400 * S.rs * S.h / 100, cnodes = Math.max(1, Math.ceil(cache / S.m));
  const srv = Math.max(1, Math.ceil(tp / S.sv));
  const down = 1 - S.a / 100;
  return { g, wDay, w, r, wp, rp, tp, day, raw, store: store_, nodes, inB, outB, outP, inP, cache, cnodes, srv, down };
}
function nfrLines(c) {
  const ratio = S.r >= 3 ? "read heavy" : S.r <= 0.5 ? "write heavy" : "balanced";
  return [
    ["Scale", `${N(S.u)} users a day${c.g > 1 ? `, planned for ${c.g}× growth` : ""}`],
    ["Traffic", `${N(c.w)} writes/s and ${N(c.r)} reads/s, peak ≈ ${N(c.tp)}/s`],
    ["Read : write", `${trim(S.r)} : 1, ${ratio}`],
    ["Latency", `p99 under ${MS(S.l)}`],
    ["Availability", `${PCT(S.a)}, about ${DUR(c.down * 365.25 * 86400)} down a year`],
    ["Storage", `${B(c.raw)} over ${trim(S.y)} ${S.y === 1 ? "year" : "years"}, ${B(c.store)} with ${S.c} ${S.c === 1 ? "copy" : "copies"}`],
    ["Bandwidth", `${B(c.outB)}/s out, ${B(c.outP)}/s at peak`],
    ["Memory", `≈ ${B(c.cache)} of cache for hot reads`]
  ];
}

/* ---------- render ---------- */
const pos = (f, v) => f.lin ? (v - f.min) / (f.max - f.min) : Math.log(Math.max(v, f.min) / f.min) / Math.log(f.max / f.min);
const fromPos = (f, t) => { const v = f.lin ? f.min + t * (f.max - f.min) : f.min * Math.pow(f.max / f.min, t); return f.lin ? Math.round(v) : +v.toPrecision(v >= 1 ? 2 : 1); };
const show = (k, v) => F[k].k === "b" ? B(v) : F[k].k === "ms" || F[k].k === "p" ? trim(v) : N(v);

function fieldHTML(k) {
  const f = F[k], lab = `<label for="i_${k}">${f.l}${f.sub ? `<small>${f.sub}</small>` : ""}</label>`;
  if (f.seg) return `<div class="fld"><div class="fr">${lab.replace(` for="i_${k}"`, ` id="l_${k}"`)}</div><div class="eseg" role="group" aria-labelledby="l_${k}" data-seg="${k}">${f.seg.map(v => `<button type="button" data-v="${v}">${f.fmt(v)}</button>`).join("")}</div></div>`;
  const t = Math.round(pos(f, S[k]) * 1000);
  return `<div class="fld"><div class="fr">${lab}<span class="vb"><input id="i_${k}" data-k="${k}" inputmode="${f.k === "n" ? "text" : "decimal"}" autocomplete="off" spellcheck="false" value="${show(k, S[k])}">${f.em ? `<em>${f.em}</em>` : ""}</span></div><input class="erng" type="range" min="0" max="1000" step="1" value="${t}" data-r="${k}" aria-label="${f.l}" tabindex="-1">${f.chips ? `<div class="eseg" data-chip="${k}">${f.chips.map(v => `<button type="button" data-v="${v}">${MS(v)}</button>`).join("")}</div>` : ""}</div>`;
}
function drawInputs() {
  $("#ein").innerHTML = GROUPS.map(([t, ks]) => `<fieldset class="grp"><legend>${t}</legend>${ks.map(fieldHTML).join("")}</fieldset>`).join("") +
    `<details id="fine"${store("sdk-estimate-fine") ? " open" : ""}><summary class="gt">Fine-tune the assumptions</summary><fieldset class="grp">${FINE.map(fieldHTML).join("")}<p class="fine">Starting guesses you can change. Decimal units, like a whiteboard: 1 KB = 1,000 bytes.</p></fieldset></details>`;
  syncInputs();
}
function syncInputs(skip) {
  for (const k in F) {
    const f = F[k];
    if (f.seg) { document.querySelectorAll(`[data-seg="${k}"] button`).forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.v === S[k]))); continue; }
    const i = $("#i_" + k); if (i && i !== skip && document.activeElement !== i) i.value = show(k, S[k]);
    const r = document.querySelector(`[data-r="${k}"]`); if (r) { const t = Math.max(0, Math.min(1, pos(f, S[k]))); r.value = Math.round(t * 1000); r.style.setProperty("--p", (t * 100).toFixed(1) + "%"); }
    if (f.chips) document.querySelectorAll(`[data-chip="${k}"] button`).forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.v === S[k])));
  }
}

let last = {};
function draw(pulse) {
  const c = calc();
  $("#nfr").innerHTML = nfrLines(c).map(([a, b]) => `<li><b>${a}</b><span>${esc(b)}</span></li>`).join("");
  const M = [
    ["w", "Writes / s", N(c.w), `peak ≈ ${N(c.wp)}/s`, `${N(S.u)} × ${trim(S.w)}${c.g > 1 ? ` × ${c.g}` : ""} ÷ 86,400 s`],
    ["r", "Reads / s", N(c.r), `peak ≈ ${N(c.rp)}/s`, `${N(c.w)}/s × ${trim(S.r)} reads each`],
    ["st", "Storage", B(c.store), `${B(c.day)} a day, ≈ ${N(c.nodes)} ${c.nodes === 1 ? "node" : "nodes"} at ${B(S.dk)}`, `${B(c.day)} × 365 × ${trim(S.y)} yr × ${S.c} ${S.c === 1 ? "copy" : "copies"}`],
    ["bw", "Bandwidth out", B(c.outB) + "<u>/s</u>", `peak ≈ ${BIT(c.outP)}, in ${B(c.inB)}/s`, `${N(c.r)} reads/s × ${B(S.rs)}`],
    ["ca", "Cache memory", B(c.cache), `≈ ${N(c.cnodes)} cache ${c.cnodes === 1 ? "node" : "nodes"} at ${B(S.m)}`, `${N(c.r)}/s × 86,400 × ${B(S.rs)} × ${trim(S.h)}%`],
    ["sv", "Servers at peak", N(c.srv), `plus a spare in each zone`, `${N(c.tp)}/s ÷ ${N(S.sv)} per server`]
  ];
  const mets = $("#mets");
  if (!mets.children.length) mets.innerHTML = M.map(m => `<div class="met" data-m="${m[0]}"><span>${m[1]}</span><b></b><small></small><code></code></div>`).join("");
  M.forEach(m => { const el = mets.querySelector(`[data-m="${m[0]}"]`); el.querySelector("b").innerHTML = m[2]; el.querySelector("small").textContent = m[3]; el.querySelector("code").textContent = m[4];
    if (pulse && !RM.matches && last[m[0]] !== m[2]) { el.classList.remove("pulse"); void el.offsetWidth; el.classList.add("pulse"); } last[m[0]] = m[2]; });
  drawLatency(); drawUptime(c); drawMeans(c); drawLive(c);
  persist();
}

function drawLatency() {
  const tot = H.reduce((a, id) => a + HOP[id].ms, 0), scale = Math.max(S.l, tot) * 1.08, spare = S.l - tot;
  const cnt = {}; H.forEach(id => cnt[id] = (cnt[id] || 0) + 1); const ids = Object.keys(cnt);
  const msg = !H.length ? `Add the steps one request takes. <span>Each step uses part of the ${MS(S.l)} budget.</span>` : spare >= 0 ? `Fits, with ${MS(spare)} to spare. <span>That room covers retries, busy disks and the slow tail.</span>` : `Needs ${MS(-spare)} more room. <span>Serve it from a cache, run steps side by side, or stream the answer.</span>`;
  const groups = [...new Set(HOPS.map(h => h.g))];
  $("#lat").innerHTML = `<div class="ch"><h2>Latency budget</h2><p>p99 target ${MS(S.l)}, so ${MS(tot)} used</p></div>
  <div class="ebar" role="img" aria-label="Latency budget: ${MS(tot)} of ${MS(S.l)}">${H.map(id => `<i style="flex:0 0 ${(HOP[id].ms / scale * 100).toFixed(3)}%;background:${HCOL[HOP[id].g]}" title="${esc(HOP[id].t)}: ${MS(HOP[id].ms)}"></i>`).join("")}<span class="tgt" style="left:${(S.l / scale * 100).toFixed(2)}%" title="Target ${MS(S.l)}"></span></div>
  <div class="bscale"><span>0</span><span>target ${MS(S.l)}</span></div>
  <p class="bmsg">${msg}</p>
  <div class="hops">${ids.map(id => `<span class="hop"><i class="hsw" style="background:${HCOL[HOP[id].g]}"></i><span class="ht">${esc(HOP[id].t)}</span><em>${cnt[id] > 1 ? `${cnt[id]} × ` : ""}${MS(HOP[id].ms)}</em><button type="button" data-hdel="${id}" aria-label="One less: ${esc(HOP[id].t)}">−</button><button type="button" data-hadd="${id}" aria-label="One more: ${esc(HOP[id].t)}">+</button></span>`).join("")}
  <details class="addhop menu"><summary>+ Add a step</summary><div class="mlist">${groups.map(g => `<div class="gl">${g}</div>${HOPS.filter(h => h.g === g).map(h => `<button type="button" data-hadd="${h.id}"><span>${h.f}</span><em>${MS(h.ms)}</em></button>`).join("")}`).join("")}</div></details></div>`;
}

let chain = store("sdk-estimate-chain") || { n: 3, e: 99.9 };
function drawUptime(c) {
  const yr = 365.25 * 86400, d = c.down;
  const n = Math.max(1, Math.min(20, Math.round(chain.n) || 1)), e = Math.min(99.99999, Math.max(50, +chain.e || 99.9)) / 100;
  const ser = Math.pow(e, n) * 100, par = Math.pow(1 - Math.pow(1 - e, 2), n) * 100;
  const el = $("#upt"), fresh = !el.querySelector("#cn");
  const top = `<div class="ch"><h2>Uptime budget</h2><p>${PCT(S.a)} leaves room for</p></div><div class="ups">${[["A year", yr], ["A month", yr / 12], ["A week", 7 * 86400], ["A day", 86400]].map(([l, s]) => `<div class="up1"><span>${l}</span><b>${DUR(d * s)}</b></div>`).join("")}</div>`;
  const ch = `<p><b>Parts in a row</b> multiply. <input id="cn" inputmode="numeric" aria-label="Parts in a row" value="${n}"> parts, each up <input id="ce" inputmode="decimal" aria-label="Each part's availability" value="${trim(e * 100) === "100" ? "99.9" : String(+(e * 100).toFixed(5))}">% of the time.</p>`;
  const pic = two => `<div class="dots" aria-hidden="true">${Array.from({ length: Math.min(n, 6) }, (_, i) => (i ? "<s></s>" : "") + (two ? "<span><i></i><i></i></span>" : "<span><i></i></span>")).join("")}${n > 6 ? "<s></s><em>+" + (n - 6) + "</em>" : ""}</div>`;
  const res = `<div class="crow">${pic(false)}<p>All together: <b>${PCT(ser)}</b>, about ${DUR((1 - ser / 100) * yr)} down a year${ser >= S.a ? ", within your target" : ""}.</p></div><div class="crow">${pic(true)}<p>With a standby copy of each part: <b>${PCT(par)}</b>, about ${DUR((1 - par / 100) * yr)} a year${par >= S.a ? ", within your target" : ""}.</p></div>`;
  if (fresh) el.innerHTML = `<div id="utop"></div><div class="chain">${ch}<div id="cres"></div></div>`;
  $("#utop").innerHTML = top; $("#cres").innerHTML = res;
}

const T = id => `../t/sdk-${id}.webp`;
function drawMeans(c) {
  const L = [], add = (id, t, why) => { if (!L.some(x => x[0] === id)) L.push([id, t, why]); };
  if (S.r >= 5) { add("pattern-cache-aside-lazy-loading-read-path", "Cache-aside", `${trim(S.r)} reads per write: most reads can come from memory.`); add("data-read-replica-follower-slave-reader-replication", "Read replicas", `Spread ${N(c.rp)} reads/s at peak over followers.`); }
  if (S.l <= 100) add("cache-redis-cache-in-memory-kv-sorted-set-pubsub", "Redis", `A ${MS(S.l)} p99 fits best with hot data in memory.`);
  if (c.wp >= 5000) { add("data-shard-partition-horizontal-scaling", "Shards", `${N(c.wp)} writes/s at peak, split by key across machines.`); add("msg-kafka-event-log-stream-topic-partitions", "Kafka", "A log soaks up write bursts and feeds the readers."); }
  if (S.p >= 10) { add("msg-message-queue-mq-async-buffer-decouple", "Message queue", `Peaks ${trim(S.p)}× the usual: a queue smooths them out.`); add("svc-autoscaler-hpa-kubernetes-karpenter-scale-out-elastic", "Autoscaler", "Add servers for the rush, remove them after."); }
  if (S.s >= 1e5 || S.rs >= 1e5) add("data-object-storage-s3-s3-blob-gcs-files-images-video", "Object storage", `${B(Math.max(S.s, S.rs))} items sit best in blob storage.`);
  if (c.outP >= 1e9 / 8 * 10 || S.rs >= 1e5) add("edge-cdn-cloudfront-akamai-edge-cache-static-assets", "CDN", `${BIT(c.outP)} at peak: serve it from the edge.`);
  if (c.store >= 5e13 && S.s < 1e5) add("data-wide-column-cassandra-cassandra-scylla-hbase-nosql", "Wide-column store", `${B(c.store)} grows best on a store built to scale out.`);
  if (S.a >= 99.99) add("pattern-multi-region-active-active-geo-dns-failover", "Multi-region", `${PCT(S.a)} means surviving a whole region going away.`);
  if (S.r <= 0.5) add("msg-kafka-event-log-stream-topic-partitions", "Kafka", "Write heavy: an append-only log keeps writes fast.");
  if (c.srv > 1 || !L.length) add("edge-load-balancer-lb-elb-alb-nlb-l4-l7-round-robin", "Load balancer", c.srv > 1 ? `Shares ${N(c.tp)}/s across ${N(c.srv)} servers.` : "One address in front, room to add servers later.");
  if (H.some(id => HOP[id].g === "AI models")) add("ai-ai-gateway-model-router-litellm-openrouter-routing-fallback-multi-provider-ai", "AI gateway", "Route, cache and fall back between models.");
  $("#means").innerHTML = L.slice(0, 6).map(([id, t, why]) => `<a class="mean" href="../#i=${id}"><img src="${T(id)}" alt="" loading="lazy" width="64" height="48"><span><b>${t}</b><small>${esc(why)}</small></span></a>`).join("");
}

function drawLive(c) { $("#live").innerHTML = [["Peak", N(c.tp) + "/s"], ["Storage", B(c.store)], ["Servers", N(c.srv)]].map(([a, b]) => `<a href="#nfrc"><span>${a}</span><b>${b}</b></a>`).join(""); }

/* ---------- presets ---------- */
function drawPresets() {
  $("#plist").innerHTML = `<button type="button" data-q=""${!Q ? ' aria-current="true"' : ""}><span>Your own numbers</span><small>Start from round defaults</small></button><hr>` + PRE.map(p => `<button type="button" data-q="${p.q}"${Q === p.q ? ' aria-current="true"' : ""}><span>${p.t}</span><small>${p.s}</small></button>`).join("");
  $("#pname").textContent = Q ? PQ[Q].t : "Your own numbers";
  const a = $("#ppr"); a.hidden = !Q; if (Q) { a.href = "../practice/#q=" + Q; a.textContent = "Practise " + PQ[Q].t + " step by step"; }
}
function usePreset(q) {
  Q = PQ[q] ? q : ""; S = { ...DEF, ...(Q ? PQ[Q].v : {}) }; H = [...(Q ? (PQ[Q].hops || DEFHOPS) : DEFHOPS)];
  drawPresets(); syncInputs(); draw(true); if (Q) ev("estimate/preset/" + Q);
}

/* ---------- sharing ---------- */
function asText(md) { return (md ? "" : "Non-functional requirements\n") + nfrLines(calc()).map(([a, b]) => md ? `- **${a}:** ${b}` : `${a}: ${b}`).join("\n"); }
async function copyText(t, what) { try { await navigator.clipboard.writeText(t); say(what); return true; } catch (e) { say("Select and copy it from the page instead"); return false; } }
let _ctx;
function measure(t, px) { _ctx = _ctx || document.createElement("canvas").getContext("2d"); _ctx.font = `${px}px Excalifont, "Comic Sans MS", cursive`; return Math.max(...t.split("\n").map(l => _ctx.measureText(l).width)); }
async function copyExcalidraw() {
  try { await document.fonts.load("20px Excalifont"); } catch (e) {}
  const rid = () => Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12), seed = () => Math.floor(Math.random() * 2 ** 31), now = Date.now();
  const body = nfrLines(calc()).map(([a, b]) => `${a}: ${b}`).join("\n"), title = "Non-functional requirements";
  const tw = Math.ceil(measure(title, 28)), bw = Math.ceil(measure(body, 20)), lines = body.split("\n").length;
  const W = Math.max(tw, bw) + 64, Hh = 32 + 35 + 18 + lines * 25 + 32, g = "nfr" + rid().slice(0, 6);
  const base = (o, i) => ({ angle: 0, strokeColor: "#1e1e1e", backgroundColor: "transparent", fillStyle: "solid", strokeWidth: 2, strokeStyle: "solid", roughness: 1, opacity: 100, groupIds: [g], frameId: null, index: "a" + i, roundness: null, seed: seed(), version: 1, versionNonce: seed(), isDeleted: false, boundElements: null, updated: now, link: null, locked: false, ...o });
  const txt = (t, x, y, fs, w, i, col) => base({ id: rid(), type: "text", x, y, width: w, height: t.split("\n").length * fs * 1.25, strokeColor: col, text: t, fontSize: fs, fontFamily: 5, textAlign: "left", verticalAlign: "top", containerId: null, originalText: t, autoResize: true, lineHeight: 1.25 }, i);
  const els = [base({ id: rid(), type: "rectangle", x: 0, y: 0, width: W, height: Hh, strokeColor: "#f08c00", backgroundColor: "#ffec99", roundness: { type: 3 } }, 0), txt(title, 32, 32, 28, tw, 1, "#1e1e1e"), txt(body, 32, 32 + 35 + 18, 20, bw, 2, "#343a40")];
  const ok = await copyText(JSON.stringify({ type: "excalidraw/clipboard", elements: els, files: {} }), `Copied. Paste in Excalidraw with ${MAC ? "⌘" : "Ctrl"} V`);
  if (ok) ev("estimate/copy-excalidraw");
}

/* ---------- events ---------- */
function setVal(k, v, from) { const f = F[k]; if (v == null || !isFinite(v) || v < 0) return false; if (!f.seg) v = Math.min(v, f.max * 100); S[k] = v; syncInputs(from); draw(); return true; }
$("#ein").addEventListener("input", e => {
  const t = e.target;
  if (t.dataset.r) { const k = t.dataset.r, f = F[k]; S[k] = fromPos(f, t.value / 1000); syncInputs(); draw(); return; }
  if (t.dataset.k) { const k = t.dataset.k, f = F[k], v = parse(t.value, f.k === "b" ? "b" : f.k === "n" ? "n" : f.k); if (v != null && isFinite(v)) { S[k] = Math.min(v, (f.max || v) * 100); syncInputs(t); draw(); } }
});
$("#ein").addEventListener("change", e => { const t = e.target; if (t.dataset.k) { const k = t.dataset.k; t.value = show(k, S[k]); } if (t.dataset.r) draw(true); });
$("#ein").addEventListener("keydown", e => {
  const t = e.target; if (!t.dataset.k) return;
  if (e.key === "Enter") { t.blur(); return; }
  if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); const k = t.dataset.k, f = F[k], step = (e.shiftKey ? 50 : 10) * (e.key === "ArrowUp" ? 1 : -1); S[k] = fromPos(f, Math.max(0, Math.min(1, pos(f, S[k]) + step / 1000))); t.value = show(k, S[k]); syncInputs(t); draw(); }
});
$("#ein").addEventListener("click", e => {
  const b = e.target.closest("[data-seg] button, [data-chip] button"); if (!b) return;
  const k = (b.parentElement.dataset.seg || b.parentElement.dataset.chip); S[k] = +b.dataset.v; syncInputs(); draw(true);
});
$("#ein").addEventListener("toggle", e => { if (e.target.id === "fine") store("sdk-estimate-fine", e.target.open); }, true);
$("#plist").addEventListener("click", e => { const b = e.target.closest("[data-q]"); if (!b) return; $("#preset").open = false; usePreset(b.dataset.q); });
$("#lat").addEventListener("click", e => {
  const a = e.target.closest("[data-hadd]"); if (a) { const dd = a.closest("details"); if (dd) dd.open = false; H.push(a.dataset.hadd); draw(); return; }
  const d = e.target.closest("[data-hdel]"); if (d) { const id = d.dataset.hdel, was = [...H]; H.splice(H.lastIndexOf(id), 1); draw(); if (!H.includes(id)) say(`Took out ${HOP[id].t.toLowerCase()}`, "Undo", () => { H = was; draw(); }); }
});
$("#upt").addEventListener("input", e => { const t = e.target; if (t.id === "cn") chain.n = parseInt(t.value) || 1; else if (t.id === "ce") chain.e = parseFloat(t.value) || 99.9; else return; store("sdk-estimate-chain", chain); drawUptime(calc()); });
$("#upt").addEventListener("change", e => { const t = e.target; if (t.id === "cn") t.value = Math.max(1, Math.min(20, Math.round(chain.n) || 1)); });
$("#cpx").addEventListener("click", copyExcalidraw);
$("#more").addEventListener("click", async e => {
  const b = e.target.closest("[data-x]"); if (!b) return; $("#more").open = false; const x = b.dataset.x;
  if (x === "text") { if (await copyText(asText(), "Copied as text")) ev("estimate/copy-text"); }
  if (x === "md") { if (await copyText(asText(true), "Copied as a Markdown list")) ev("estimate/copy-md"); }
  if (x === "link") { const h = toHash(); history.replaceState(null, "", h ? "#" + h : location.pathname); if (await copyText(location.href, "Link copied")) ev("estimate/copy-link"); }
  if (x === "fresh") { const was = { S: { ...S }, Q, H: [...H] }; usePreset(""); say("Back to the defaults", "Undo", () => { S = was.S; Q = was.Q; H = was.H; drawPresets(); syncInputs(); draw(true); }); }
});
document.addEventListener("click", e => { document.querySelectorAll("details.menu[open]").forEach(d => { if (!d.contains(e.target)) d.open = false; }); });
document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll("details.menu[open]").forEach(d => { d.open = false; d.querySelector("summary").focus(); }); });
$("#fby").addEventListener("click", e => { ev("fb-love/estimator"); e.target.disabled = true; e.target.textContent = "Thank you"; });
$("#fbs").href = `${REPO}/issues/new?template=3-polish.yml&title=${encodeURIComponent("[Estimator] ")}`;
addEventListener("hashchange", () => { if (fromHash(location.hash)) { drawPresets(); syncInputs(); draw(true); } });

/* the slim strip on phones: shows while the inputs fill the screen */
const navEl = document.querySelector(".nav");
const setNav = () => document.documentElement.style.setProperty("--navh", (navEl ? navEl.offsetHeight : 56) + "px");
setNav(); addEventListener("resize", setNav);
const liveTick = () => { const r = $("#nfrc").getBoundingClientRect(), i = $("#ein").getBoundingClientRect(); $("#live").classList.toggle("on", innerWidth < 980 && r.top > innerHeight * 0.85 && i.top < (navEl ? navEl.offsetHeight : 56) + 24); };
addEventListener("scroll", liveTick, { passive: true }); addEventListener("resize", liveTick);
$("#live").addEventListener("click", e => { const a = e.target.closest("a"); if (!a) return; e.preventDefault(); $("#nfrc").scrollIntoView({ behavior: RM.matches ? "auto" : "smooth", block: "start" }); });

/* numbers worth knowing */
$("#refb").innerHTML = `<div><h3>Time</h3><dl>${HOPS.filter(h => ["dc", "mem", "ssd4", "ssd", "seek", "hdd", "sea", "llm"].includes(h.id)).map(h => `<dt>${h.f}</dt><dd>${MS(h.ms)}</dd>`).join("")}</dl></div>
<div><h3>Quick conversions</h3><dl><dt>Seconds in a day</dt><dd>86,400 ≈ 10⁵</dd><dt>1M a day</dt><dd>≈ 12 / s</dd><dt>1B a day</dt><dd>≈ 12K / s</dd><dt>2¹⁰ / 2²⁰ / 2³⁰ / 2⁴⁰</dt><dd>K / M / G / T</dd><dt>99.9% a year</dt><dd>≈ 8.8 h down</dd><dt>99.99% a year</dt><dd>≈ 53 min down</dd><dt>1 Gbps</dt><dd>125 MB / s</dd></dl></div>
<p class="fine">Time figures come from <a href="https://gist.github.com/jboner/2841832" target="_blank" rel="noopener">Latency numbers every programmer should know</a>. Use them for the order of size, then measure on your own hardware.</p>`;

/* ---------- start ---------- */
(() => {
  if (!fromHash(location.hash)) { const s = store("sdk-estimate"); if (s && s.S) { S = { ...DEF, ...s.S }; Q = PQ[s.Q] ? s.Q : ""; H = Array.isArray(s.H) ? s.H.filter(x => HOP[x]) : [...DEFHOPS]; } }
  drawInputs(); drawPresets(); draw(); liveTick();
})();
/* fade the bottom of the input panel while more fields sit below */
const fadeIn = () => { const e = $("#ein"); e.classList.toggle("fadeb", e.scrollHeight - e.scrollTop - e.clientHeight > 8); };
$("#ein").addEventListener("scroll", fadeIn, { passive: true }); addEventListener("resize", fadeIn); $("#ein").addEventListener("toggle", fadeIn, true); fadeIn();
