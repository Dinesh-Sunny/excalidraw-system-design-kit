/* System Design Kit - one search for every page (Cmd/Ctrl + K).
   Blocks, designs, practice questions, starter packs and sections in one place.
   Smart matching (short forms, small typos), filters (in:cache level:hard company:meta is:saved),
   full keyboard: up/down, Enter opens, Cmd/Ctrl+Enter copies to Excalidraw, Shift+Enter saves, Tab switches scope. */
(() => {
  const ME = document.currentScript, BASE = new URL(".", ME.src).href;
  const $ = s => document.querySelector(s);
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const LS = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "[]"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return []; } };
  const MAC = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent), MOD = MAC ? "⌘" : "Ctrl";
  const gc = p => { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: p, title: p, event: true }); } catch (e) {} };
  const SYN = { lb: "load balancer", db: "database", dbs: "database", k8s: "kubernetes", kube: "kubernetes", mq: "message queue", queue: "kafka sqs rabbitmq message queue", cache: "redis memcached cache", s3: "object storage", blob: "object storage", kv: "key value dynamodb", nosql: "dynamodb cassandra mongodb", sql: "postgresql mysql sql", pg: "postgresql", postgres: "postgresql", gw: "gateway", ws: "websocket", socket: "websocket", llm: "llm model", gpt: "llm", vector: "vector embedding", embeddings: "embedding", auth: "auth login identity", login: "auth login", cdn: "cdn edge", es: "elasticsearch search", search: "search elasticsearch", pubsub: "pub sub", cron: "scheduler cron", ml: "model", rag: "rag retrieval", mcp: "mcp model context protocol", agents: "agent", mobile: "phone mobile", ui: "ui screen", api: "api gateway", microservice: "service", ratelimit: "rate limiter", throttle: "rate limiter", stream: "kafka stream flink", etl: "batch etl spark", dw: "data warehouse", lake: "data lake", region: "region zone", vpc: "vpc subnet zone", obs: "monitoring tracing logging", metrics: "monitoring", logs: "logging" };
  const SCOPES = [["all", "All"], ["block", "Blocks"], ["design", "Designs"], ["practice", "Practice"], ["pack", "Packs"], ["section", "Sections"]];
  const POPULAR = ["kafka", "redis", "load balancer", "rag", "ai agent", "rate limiter", "chat system", "level:hard"];
  let IX = null, ixP = null, scope = "all", sel = 0, flat = [], dlg = null;

  function load() { return ixP || (ixP = fetch(BASE + "search-index.json").then(r => r.json()).then(j => { IX = prep(j); return IX; })); }
  const norm = s => String(s).toLowerCase().replace(/[^a-z0-9+#./ ]+/g, " ").replace(/\s+/g, " ").trim();
  function prep(j) {
    const all = [];
    j.b.forEach(b => all.push({ kind: b.c === "tpl" ? "design" : "block", id: b.id, slug: b.id.replace(/^sdk-/, ""), t: b.t, c: b.c, cl: j.cats[b.c] || b.c, img: BASE + "t/" + b.id + ".webp", hay: norm(b.t + " " + b.k + " " + b.c + " " + (j.cats[b.c] || "")), tw: norm(b.t).split(" "), q: b.q || "" }));
    j.p.forEach(p => all.push({ kind: "practice", slug: p.s, t: p.t, lv: p.l, co: p.co, kit: p.kit, img: BASE + "t/sdk-" + p.kit + ".webp", hay: norm(p.t + " " + p.co.join(" ") + " " + p.tr + " " + p.l + " " + p.n), tw: norm(p.t).split(" ") }));
    j.k.forEach(k => all.push({ kind: "pack", slug: k.id, t: k.t, d: k.d, n: k.n, img: k.img ? BASE + "t/" + k.img + ".webp" : "", hay: norm(k.t + " " + k.d), tw: norm(k.t).split(" ") }));
    Object.entries(j.cats).forEach(([c, l]) => { if (c !== "all") all.push({ kind: "section", slug: c, t: l, n: j.count[c] || 0, hay: norm(l + " " + c), tw: norm(l).split(" ") }); });
    return { all, cats: j.cats };
  }
  function lev(a, b) { // edit distance capped at 2, counting a swap of two neighbours as one edit
  if (Math.abs(a.length - b.length) > 1) return 2; const m = a.length, n = b.length, D = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]); for (let k = 0; k <= n; k++) D[0][k] = k;
  for (let i = 1; i <= m; i++) for (let k = 1; k <= n; k++) { const c = a[i - 1] === b[k - 1] ? 0 : 1; D[i][k] = Math.min(D[i - 1][k] + 1, D[i][k - 1] + 1, D[i - 1][k - 1] + c); if (i > 1 && k > 1 && a[i - 1] === b[k - 2] && a[i - 2] === b[k - 1]) D[i][k] = Math.min(D[i][k], D[i - 2][k - 2] + 1); }
  return D[m][n]; }
  function parse(q) { // filters: in:cache level:hard company:meta type:practice is:saved
    const f = {}, words = [];
    String(q).toLowerCase().split(/\s+/).filter(Boolean).forEach(w => { const m = w.match(/^(in|level|company|type|is):(.+)$/); if (m) f[m[1]] = norm(m[2]).replace(/ /g, ""); else norm(w).split(" ").filter(Boolean).forEach(x => words.push(x)); });
    return { f, words };
  }
  function tokScore(it, w) { // the best way this word matches: title beats tags, whole words beat parts, typos count least
    const tl = " " + it.tw.join(" ") + " ", hay = " " + it.hay + " ", flatT = it.tw.join(""); let s = 0;
    if (it.tw.includes(w)) s = 10; else if (it.tw.some(x => x.startsWith(w))) s = 7;
    if (w.length >= 5 && flatT.startsWith(w)) s = Math.max(s, 9); // "loadbalancer"
    const syn = SYN[w]; if (syn) { if (tl.includes(" " + syn + " ")) s = Math.max(s, 10); else if (syn.split(" ").some(x => tl.includes(" " + x + " "))) s = Math.max(s, 6); else if (syn.split(" ").some(x => hay.includes(" " + x + " "))) s = Math.max(s, 3); }
    if (!s && hay.includes(" " + w)) s = 3;
    if (!s && w.length > 2 && it.hay.includes(w)) s = 2;
    if (!s && w.length >= 4) { if (it.tw.some(x => x.length >= 4 && lev(w, x.slice(0, w.length)) <= 1)) s = 2; else if (it.hay.split(" ").some(x => x.length >= 4 && lev(w, x.slice(0, w.length)) <= 1)) s = 1; }
    return s;
  }
  function search(q) {
    const { f, words } = parse(q), board = LS("sdk-board"), full = norm(q);
    const out = [];
    for (const it of IX.all) {
      if (f.in && !(it.c && (it.c === f.in || norm(it.cl).startsWith(f.in)))) continue;
      if (f.level && !(it.lv && it.lv.toLowerCase().startsWith(f.level))) continue;
      if (f.company && !(it.co && it.co.some(c => c.toLowerCase().startsWith(f.company)))) continue;
      if (f.type && !it.kind.startsWith(f.type.replace(/s$/, ""))) continue;
      if (f.is === "saved" && !board.includes(it.slug)) continue;
      let s = 0, ok = true;
      for (const w of words) { const x = tokScore(it, w); if (!x) { ok = false; break; } s += x; }
      if (!ok) continue;
      const tl = norm(it.t); if (words.length && tl === words.join(" ")) s += 20; else if (words.length && tl.startsWith(words.join(" "))) s += 10;
      if (it.kind === "section") s += 2;
      out.push([it, s]);
    }
    const strong = out.filter(x => x[1] >= 3 * Math.max(1, words.length)); // typo matches only fill in when nothing better is found
    return (strong.length ? strong : out).sort((a, b) => b[1] - a[1]).map(x => x[0]);
  }
  function hl(t, words) { let h = esc(t); words.filter(w => w.length > 1).forEach(w => { h = h.replace(new RegExp("(^|[\\s(/-])(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "$1<mark>$2</mark>"); }); return h; }

  function build() {
    dlg = document.createElement("dialog"); dlg.className = "cmdk"; dlg.setAttribute("aria-label", "Search the kit");
    dlg.innerHTML = `<div class="ck-in"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><path d="m16.5 16.5-3.5-3.5"/></svg><input id="ckq" type="search" placeholder="Search blocks, designs, questions, packs" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="ckl" aria-autocomplete="list"><button type="button" class="ck-x" data-ckclose aria-label="Close search">Esc</button></div>
      <div class="ck-sc" role="tablist" aria-label="Search in">${SCOPES.map(([k, l]) => `<button type="button" role="tab" data-sc="${k}" aria-selected="${k === "all"}">${l}<i></i></button>`).join("")}</div>
      <div class="ck-f" id="ckf" hidden></div>
      <div class="ck-l" id="ckl" role="listbox"></div>
      <div class="ck-ft"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>${MOD}</kbd><kbd>↵</kbd> copy to Excalidraw</span><span><kbd>⇧</kbd><kbd>↵</kbd> save</span><span><kbd>Tab</kbd> scope</span><span class="ck-tip">Try <code>in:cache</code> <code>level:hard</code> <code>company:meta</code> <code>is:saved</code></span></div>`;
    document.body.append(dlg);
    const inp = dlg.querySelector("#ckq");
    inp.addEventListener("input", () => { sel = 0; render(); });
    dlg.addEventListener("click", e => {
      if (e.target === dlg || e.target.closest("[data-ckclose]")) return close();
      const s = e.target.closest("[data-sc]"); if (s) { setScope(s.dataset.sc); inp.focus(); return; }
      const fx = e.target.closest("[data-fx]"); if (fx) { inp.value = inp.value.replace(new RegExp("\\b" + fx.dataset.fx + ":\\S+\\s*", "i"), "").trim(); sel = 0; render(); inp.focus(); return; }
      const ch = e.target.closest("[data-try]"); if (ch) { inp.value = ch.dataset.try; sel = 0; render(); inp.focus(); return; }
      const act = e.target.closest("[data-act]"); if (act) { const r = flat[+act.closest("[data-i]").dataset.i]; act.dataset.act === "copy" ? copy(r) : save(r, act); return; }
      const row = e.target.closest("[data-i]"); if (row) go(flat[+row.dataset.i]);
    });
    dlg.addEventListener("mousemove", e => { const row = e.target.closest("[data-i]"); if (row && +row.dataset.i !== sel) { sel = +row.dataset.i; mark(false); } });
    inp.addEventListener("keydown", e => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!flat.length) return; sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + flat.length) % flat.length; mark(true); }
      else if (e.key === "Enter") { e.preventDefault(); const r = flat[sel]; if (!r) return; if (e.metaKey || e.ctrlKey) copy(r); else if (e.shiftKey) save(r); else go(r); }
      else if (e.key === "Tab") { e.preventDefault(); const i = SCOPES.findIndex(x => x[0] === scope); setScope(SCOPES[(i + (e.shiftKey ? -1 : 1) + SCOPES.length) % SCOPES.length][0]); }
    });
  }
  function setScope(k) { scope = k; sel = 0; dlg.querySelectorAll(".ck-sc [data-sc]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.sc === k))); render(); }
  const G = { block: "Blocks", design: "Designs", practice: "Practice questions", pack: "Starter packs", section: "Sections" };
  function rowHTML(r, i, words) {
    const thumb = r.img ? `<img alt="" loading="lazy" src="${r.img}">` : `<span class="ck-ic">${r.kind === "section" ? "#" : "·"}</span>`;
    const sub = r.kind === "block" || r.kind === "design" ? `sd:${r.c}/ · ${esc(r.cl)}` : r.kind === "practice" ? `<b class="lvd ${r.lv}"></b>${r.lv}${r.co.length ? " · " + esc(r.co.slice(0, 3).join(", ")) : ""}` : r.kind === "pack" ? `${r.n} blocks · ${esc(r.d)}` : `${r.n} blocks`;
    const acts = r.kind === "block" || r.kind === "design" ? `<span class="ck-a"><button type="button" data-act="copy" title="Copy to Excalidraw (${MOD} Enter)">Copy</button><button type="button" data-act="save" class="${LS("sdk-board").includes(r.slug) ? "on" : ""}" title="Save to your board (Shift Enter)">${LS("sdk-board").includes(r.slug) ? "Saved" : "Save"}</button></span>` : `<span class="ck-go">${r.kind === "practice" ? "Practise" : "Open"} ↵</span>`;
    return `<div class="ck-r" role="option" data-i="${i}" id="ck-${i}">${thumb}<span class="ck-t"><b>${hl(r.t, words)}</b><small>${sub}</small></span>${acts}</div>`;
  }
  function render() {
    const inp = dlg.querySelector("#ckq"), q = inp.value, L = dlg.querySelector("#ckl"), F = dlg.querySelector("#ckf");
    if (!IX) { L.innerHTML = `<p class="ck-e">Loading…</p>`; load().then(render); return; }
    const { f, words } = parse(q);
    F.hidden = !Object.keys(f).length; F.innerHTML = Object.entries(f).map(([k, v]) => `<button type="button" class="chip" data-fx="${k}">${k}: ${esc(v)} <span aria-hidden="true">×</span></button>`).join("");
    flat = [];
    if (!q.trim()) {
      const rq = LS("sdk-search-recent").slice(0, 6), rv = LS("sdk-recent").slice(0, 6).map(s => IX.all.find(x => x.slug === s && (x.kind === "block" || x.kind === "design"))).filter(Boolean);
      let h = "";
      if (rq.length) h += `<div class="ck-g"><span>Recent searches</span><div class="chips">${rq.map(x => `<button type="button" class="chip" data-try="${esc(x)}">${esc(x)}</button>`).join("")}</div></div>`;
      if (rv.length) { h += `<div class="ck-g"><span>Recently viewed</span></div>` + rv.map(r => { flat.push(r); return rowHTML(r, flat.length - 1, []); }).join(""); }
      h += `<div class="ck-g"><span>Popular</span><div class="chips">${POPULAR.map(x => `<button type="button" class="chip" data-try="${x}">${x}</button>`).join("")}</div></div>`;
      const secs = IX.all.filter(x => x.kind === "section"); h += `<div class="ck-g"><span>Jump to a section</span></div>` + secs.slice(0, 8).map(r => { flat.push(r); return rowHTML(r, flat.length - 1, []); }).join("");
      L.innerHTML = h; dlg.querySelectorAll(".ck-sc [data-sc] i").forEach(i => { i.textContent = ""; }); mark(false); return;
    }
    const res = search(q), by = {}; res.forEach(r => (by[r.kind] = by[r.kind] || []).push(r));
    dlg.querySelectorAll(".ck-sc [data-sc]").forEach(b => { const k = b.dataset.sc; b.querySelector("i").textContent = k === "all" ? res.length : (by[k] || []).length || ""; });
    const order = scope === "all" ? Object.keys(G).sort((a, b) => ((by[b] || [])[0] ? 1 : 0) - ((by[a] || [])[0] ? 1 : 0) || res.indexOf((by[a] || [])[0]) - res.indexOf((by[b] || [])[0])) : [scope];
    const cap = { block: 6, design: 4, practice: 4, pack: 3, section: 3 };
    let h = "";
    for (const k of order) { const list = by[k] || []; if (!list.length) continue; const show = scope === "all" ? list.slice(0, cap[k]) : list.slice(0, 60);
      h += `<div class="ck-g"><span>${G[k]} <i>${list.length}</i></span>${scope === "all" && list.length > show.length ? `<button type="button" class="ck-more" data-sc="${k}">Show all ${list.length}</button>` : ""}</div>` + show.map(r => { flat.push(r); return rowHTML(r, flat.length - 1, words); }).join(""); }
    L.innerHTML = h || `<div class="ck-e"><b>Nothing yet</b>Try a shorter word, a short form like <code>lb</code> or <code>k8s</code>, or <button type="button" class="chip" data-try="${esc(words[0] || "")}">search ${esc(words[0] || "")} everywhere</button></div>`;
    if (!h && scope !== "all") { setScope("all"); return; }
    mark(false);
  }
  function mark(scroll) { dlg.querySelectorAll(".ck-r").forEach(r => r.classList.toggle("on", +r.dataset.i === sel)); const on = dlg.querySelector(".ck-r.on"); dlg.querySelector("#ckq").setAttribute("aria-activedescendant", on ? on.id : ""); if (on && scroll) on.scrollIntoView({ block: "nearest" }); }
  function remember() { const q = dlg.querySelector("#ckq").value.trim(); if (q.length > 1) LS("sdk-search-recent", [q, ...LS("sdk-search-recent").filter(x => x !== q)].slice(0, 8)); }
  function go(r) {
    if (!r) return; remember(); gc("search-open/" + r.kind + "/" + r.slug);
    const url = r.kind === "practice" ? BASE + "practice/#q=" + r.slug : r.kind === "pack" ? BASE + "#pack=" + r.slug : r.kind === "section" ? BASE + "#" + r.slug : BASE + "#i=" + r.slug;
    close(); const u = new URL(url); if (u.pathname === location.pathname) { location.hash = u.hash.slice(1); } else location.href = url;
  }
  function toast(t) { let el = $("#cktoast"); if (!el) { el = document.createElement("div"); el.id = "cktoast"; el.className = "toast"; document.body.append(el); } (dlg.open ? dlg : document.body).append(el); el.textContent = t; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("on"), 2400); }
  async function copy(r) {
    if (!r || !(r.kind === "block" || r.kind === "design")) return go(r);
    try { const p = fetch(BASE + "e/" + r.id + ".json").then(x => x.json()).then(els => new Blob([JSON.stringify({ type: "excalidraw/clipboard", elements: els, files: {} })], { type: "text/plain" }));
      if (window.ClipboardItem && navigator.clipboard.write) await navigator.clipboard.write([new ClipboardItem({ "text/plain": p })]); else await navigator.clipboard.writeText(await (await p).text());
      toast(`Copied ${r.t}. Paste in Excalidraw with ${MOD} V`); remember(); gc("copy-excalidraw/" + r.slug); } catch (e) { toast("Copy didn't go through. Open it and use Copy"); }
  }
  function save(r, btn) { if (!r || !(r.kind === "block" || r.kind === "design")) return; const b = LS("sdk-board"), on = b.includes(r.slug); LS("sdk-board", on ? b.filter(x => x !== r.slug) : [...b, r.slug]); toast(on ? "Removed from your board" : `Saved ${r.t} to your board`); gc((on ? "unsave/" : "save/") + r.slug); render(); }
  function open(q) {
    if (!dlg) build(); load();
    const inp = dlg.querySelector("#ckq"); if (typeof q === "string") inp.value = q;
    setScope("all"); if (!dlg.open) dlg.showModal(); inp.focus(); inp.select(); gc("search-palette");
  }
  function close() { if (dlg && dlg.open) dlg.close(); }
  window.sdkSearch = open;
  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") { e.preventDefault(); dlg && dlg.open ? close() : open(); return; }
    if (e.key === "/" && !e.metaKey && !e.ctrlKey && document.body.classList.contains("hs-on") && !e.target.closest("input, textarea, select") && !document.querySelector("dialog[open]")) { e.preventDefault(); e.stopImmediatePropagation(); open(); }
  }, true);
  document.addEventListener("click", e => { if (e.target.closest("[data-cmdk]")) { e.preventDefault(); open(); } });
  if ("requestIdleCallback" in window) requestIdleCallback(() => load()); else setTimeout(load, 1500);
})();
