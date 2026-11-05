/* Emoji on the Blocks page: every Unicode emoji and skin tone, named like the library (sd:emoji/ Name).
   Loads emoji.json on first use. One tap copies the emoji to Excalidraw exactly as the library item. */
(() => {
  const BASE = new URL(".", document.currentScript.src).href;
  const MAC = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
  const RM = matchMedia("(prefers-reduced-motion: reduce)");
  const st = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
  const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ev = p => { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: p, title: p, event: true }); } catch (e) {} };
  const toast = (t, a, f) => { if (typeof say === "function") say(t, a, f); };
  let D = null, P = null, tone = st("sdk-emoji-tone") || "", sel = null;
  const load = () => P || (P = fetch(BASE + "emoji.json").then(r => r.json()).then(j => {
    D = j; D.total = j.items.length + j.items.reduce((a, it) => a + (it[4] ? it[4].length : 0), 0);
    D.items.forEach((it, i) => { it.i = i; it.hay = (it[1] + " " + it[3] + " " + j.subs[it[2]][0]).toLowerCase(); }); return D; }));
  const TONES = [["", "#ffcc4d", "Default"], ["1", "#f7dece", "Light"], ["2", "#f3d2a2", "Medium-light"], ["3", "#d5ab88", "Medium"], ["4", "#af7e57", "Medium-dark"], ["5", "#7c533e", "Dark"]];
  // the version of an emoji for the chosen tone (two-person emoji use the same tone twice)
  const pick = it => { if (tone && it[4]) { const v = it[4].find(s => s[0] === tone || s[0] === tone + tone); if (v) return { ch: v[1], name: v[2], it }; } return { ch: it[0], name: it[1], it }; };
  const libName = n => "sd:emoji/ " + n;
  const match = (term) => { const w = term.toLowerCase().split(/\s+/).filter(Boolean); return D.items.filter(it => w.every(x => it.hay.includes(x))).sort((a, b) => (b[1].toLowerCase() === term) - (a[1].toLowerCase() === term) || (a[1].toLowerCase().startsWith(w[0]) ? 0 : 1) - (b[1].toLowerCase().startsWith(w[0]) ? 0 : 1)); };

  const css = `
.emo { display: grid; gap: 14px; grid-template-columns: minmax(0, 1fr) } .emo > * { min-width: 0 }
.emh { display: grid; gap: 6px } .emh h2 { margin: 0 } .emh p { margin: 0; color: var(--ink-muted); font: 400 15px/22px var(--font-sans); max-width: 680px }
.emh code { font: 500 13px/1 var(--font-mono); padding: 2px 6px; border-radius: 6px; background: var(--surface-sunk); color: var(--ink) }
.emctl { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center }
.emq { flex: 1 1 260px; display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 14px; border-radius: 9999px; border: 1px solid var(--hairline); background: var(--surface); box-shadow: var(--shadow-float) }
.emq svg { width: 16px; height: 16px; color: var(--ink-muted); flex: none } .emq input { flex: 1; min-width: 0; border: 0; background: none; outline: 0; font: 400 15px/1 var(--font-sans); color: var(--ink) }
.emq button { border: 0; background: none; color: var(--ink-muted); cursor: pointer; font: 500 13px/1 var(--font-sans) }
.tones { display: inline-flex; align-items: center; gap: 4px; padding: 4px; border-radius: 9999px; border: 1px solid var(--hairline); background: var(--surface) }
.tones span { font: 500 12px/1 var(--font-sans); color: var(--ink-muted); padding: 0 6px 0 8px }
.tones button { width: 28px; height: 28px; border-radius: 50%; border: 2px solid transparent; background: none; cursor: pointer; display: grid; place-items: center; padding: 0 }
.tones button i { width: 18px; height: 18px; border-radius: 50%; display: block; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12) }
.tones button[aria-checked="true"] { border-color: var(--ink) }
.emtabs { position: sticky; top: var(--emtop, 64px); z-index: 6; display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; padding: 8px 16px; margin: 0 -16px; background: var(--glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--hairline) }
.emtabs::-webkit-scrollbar { display: none }
.emtabs a { flex: none; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 12px; border-radius: 9999px; text-decoration: none; color: var(--ink-muted); font: 500 13px/1 var(--font-sans); white-space: nowrap }
.emtabs a b { font: 400 18px/1 sans-serif } .emtabs a:hover { color: var(--ink) } .emtabs a[aria-current="true"] { background: var(--pill); color: var(--on-ink) }
@media (max-width: 640px) { .emtabs a span { display: none } .emtabs a { padding: 0 10px } }
.emg { display: grid; gap: 4px; grid-template-columns: minmax(0, 1fr); scroll-margin-top: calc(var(--emtop, 64px) + 64px) }
.emg h3 { margin: 18px 0 2px; font: 400 26px/1.15 var(--font-serif) } .emg h3 small { font: 400 13px/1 var(--font-mono); color: var(--ink-muted); margin-left: 8px }
.emg h4 { margin: 10px 0 2px; font: 500 11px/14px var(--font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--ink-muted) }
.eg { display: grid; grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); gap: 2px }
.ej { aspect-ratio: 1; border: 0; border-radius: 12px; background: none; cursor: pointer; font: 400 30px/1 "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif; display: grid; place-items: center; transition: background .12s, transform .12s; padding: 0 }
.ej:hover { background: var(--surface-sunk); transform: scale(1.12) } .ej:active { transform: scale(.95) }
.ej[aria-pressed="true"] { background: var(--sketch-soft); box-shadow: inset 0 0 0 2px var(--sketch) }
@media (max-width: 520px) { .eg { grid-template-columns: repeat(auto-fill, minmax(42px, 1fr)) } .ej { font-size: 27px } }
.emnone { padding: 28px; text-align: center; color: var(--ink-muted); font: 400 15px/22px var(--font-sans) }
.emtray { position: sticky; bottom: calc(12px + env(safe-area-inset-bottom, 0px)); z-index: 7; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 14px; align-items: center; padding: 12px 14px; border-radius: var(--r-lg); border: 1px solid var(--hairline); background: var(--surface); box-shadow: var(--shadow-float); animation: rise .2s ease-out }
.emtray[hidden] { display: none }
.emtray .big { font: 400 46px/1 "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif }
.emtray b { display: block; font: 500 15px/20px var(--font-sans) } .emtray code { display: block; margin-top: 3px; font: 400 12px/16px var(--font-mono); color: var(--ink-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
.emtray .ea { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end }
.emtray .ea button { height: 34px; padding: 0 12px; border-radius: 9999px; border: 1px solid var(--hairline); background: var(--surface); color: var(--ink); font: 500 13px/1 var(--font-sans); cursor: pointer; white-space: nowrap }
.emtray .ea button.p { background: var(--pill); color: var(--on-ink); border-color: var(--pill) }
@media (max-width: 640px) { .emtray { grid-template-columns: auto minmax(0, 1fr) } .emtray .ea { grid-column: 1 / -1; justify-content: flex-start } }
.emhit .eg { grid-template-columns: repeat(auto-fill, minmax(52px, 1fr)) }
.emhit .more2 { justify-self: start; height: 34px; padding: 0 14px; border-radius: 9999px; border: 1px solid var(--hairline); background: var(--surface); color: var(--ink); font: 500 13px/1 var(--font-sans); cursor: pointer }
@media (prefers-reduced-motion: reduce) { .ej, .emtray { transition: none; animation: none } .ej:hover { transform: none } }`;
  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

  const SRCH = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="9" cy="9" r="5.5"/><path d="m16.5 16.5-3.5-3.5"/></svg>';
  const btn = it => { const g = pick(it); return `<button type="button" class="ej" data-e="${it.i}" title="${esc(g.name)}" aria-label="${esc(g.name)}"${sel === it.i ? ' aria-pressed="true"' : ""}>${g.ch}</button>`; };
  const sticky = () => [...document.querySelectorAll(".nav, .rail")].filter(e => /sticky|fixed/.test(getComputedStyle(e).position)).reduce((a, e) => a + e.offsetHeight, 0);

  function body(term) {
    if (term) { const L = match(term); return L.length ? `<div class="emg"><h4>${L.length} ${L.length === 1 ? "match" : "matches"}</h4><div class="eg">${L.map(btn).join("")}</div></div>` : `<div class="emnone">No emoji by that name yet. Try a simpler word, like "heart" or "rocket".</div>`; }
    const rec = (st("sdk-emoji-recent") || []).map(i => D.items[i]).filter(Boolean);
    let h = rec.length ? `<div class="emg" id="eg-r"><h3>Recently used</h3><div class="eg">${rec.map(btn).join("")}</div></div>` : "";
    D.groups.forEach((g, gi) => {
      const its = D.items.filter(it => D.subs[it[2]][1] === gi); let last = -1, inner = "";
      for (const it of its) { if (it[2] !== last) { if (last > -1) inner += "</div>"; inner += `<h4>${esc(D.subs[it[2]][0])}</h4><div class="eg">`; last = it[2]; } inner += btn(it); }
      h += `<div class="emg" id="eg-${gi}"><h3>${esc(g[1])}<small>${its.length}</small></h3>${inner}</div></div>`;
    });
    return h;
  }
  function trayHTML() { if (sel == null) return ""; const g = pick(D.items[sel]); return `<span class="big">${g.ch}</span><span><b>${esc(g.name)}</b><code>${esc(libName(g.name))}</code></span><span class="ea"><button type="button" class="p" data-a="x">Copy to Excalidraw</button><button type="button" data-a="c">Copy emoji</button><button type="button" data-a="n">Copy library name</button></span>`; }

  let root = null, term0 = "", pend = "";
  function view(rows, term) {
    rows.textContent = ""; term0 = term || pend || ""; pend = "";
    const sec = document.createElement("section"); sec.className = "row emo"; root = sec; rows.append(sec);
    sec.innerHTML = `<div class="emh"><h2>Emoji <span class="n">${D ? D.items.length.toLocaleString("en") : ""}</span></h2><p>Every Unicode emoji, with every skin tone. Tap one to copy it into Excalidraw, or find it in the library: <code>sd:emoji/ rocket</code>.</p></div><p class="emnone">Loading the emoji...</p>`;
    load().then(() => { if (root !== sec || !sec.isConnected) return; render(sec); });
  }
  function render(sec) {
    sec.innerHTML = `<div class="emh"><h2>Emoji <span class="n">${D.items.length.toLocaleString("en")}</span></h2><p>Every Unicode emoji, ${D.total.toLocaleString("en")} with skin tones. Tap one to copy it into Excalidraw, or find it in the library: <code>sd:emoji/ rocket</code>.</p></div>
    <div class="emctl"><label class="emq">${SRCH}<input type="search" id="emq" placeholder="Search emoji, e.g. rocket, heart, cloud" autocomplete="off" value="${esc(term0)}" aria-label="Search emoji"></label>
    <div class="tones" role="radiogroup" aria-label="Skin tone"><span>Skin tone</span>${TONES.map(([k, c, n]) => `<button type="button" role="radio" data-t="${k}" aria-checked="${k === tone}" aria-label="${n}" title="${n}"><i style="background:${c}"></i></button>`).join("")}</div></div>
    <nav class="emtabs" id="emtabs" aria-label="Emoji groups"${term0 ? " hidden" : ""}>${(st("sdk-emoji-recent") || []).length ? `<a href="#eg-r" data-g="r"><b>🕘</b><span>Recent</span></a>` : ""}${D.groups.map((g, i) => `<a href="#eg-${i}" data-g="${i}"><b>${g[2]}</b><span>${esc(g[1])}</span></a>`).join("")}</nav>
    <div id="embody">${body(term0)}</div><div class="emtray" id="emtray"${sel == null ? " hidden" : ""} aria-live="polite">${trayHTML()}</div>`;
    sec.style.setProperty("--emtop", sticky() + "px"); watchTabs(sec);
  }
  const redraw = () => { if (!root || !root.isConnected) return; root.querySelector("#embody").innerHTML = body(term0); const tr = root.querySelector("#emtray"); tr.hidden = sel == null; tr.innerHTML = trayHTML(); };

  // tab follows the scroll: the last group whose heading has passed under the tabs
  let ticking = false;
  function litTab() {
    ticking = false; if (!root || !root.isConnected) return; const tabs = root.querySelector("#emtabs"); if (!tabs || tabs.hidden) return;
    const line = sticky() + tabs.offsetHeight + 24; let k = null;
    root.querySelectorAll(".emg[id]").forEach(g => { if (g.getBoundingClientRect().top <= line) k = g.id.slice(3); });
    if (k == null) { const f = root.querySelector(".emg[id]"); k = f ? f.id.slice(3) : null; }
    tabs.querySelectorAll("a").forEach(a => { const c = a.dataset.g === k; if (a.getAttribute("aria-current") !== String(c)) { a.setAttribute("aria-current", String(c)); if (c) tabs.scrollTo({ left: a.offsetLeft - 16, behavior: RM.matches ? "auto" : "smooth" }); } });
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(litTab); } }, { passive: true });
  function watchTabs() { litTab(); }

  function els(ch) {
    const r = () => Math.floor(Math.random() * 2 ** 31), id = () => Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12);
    return [{ id: id(), type: "text", x: 0, y: 0, width: 70, height: 70, angle: 0, strokeColor: "#1e1e1e", backgroundColor: "transparent", fillStyle: "solid", strokeWidth: 2, strokeStyle: "solid", roughness: 0, opacity: 100, groupIds: [], frameId: null, index: "a0", roundness: null, seed: r(), version: 1, versionNonce: r(), isDeleted: false, boundElements: null, updated: Date.now(), link: null, locked: false, text: ch, fontSize: 56, fontFamily: 5, textAlign: "left", verticalAlign: "top", containerId: null, originalText: ch, autoResize: true, lineHeight: 1.25 }];
  }
  async function put(t, msg) { try { await navigator.clipboard.writeText(t); toast(msg); return true; } catch (e) { toast("Copy didn't go through. Long-press to copy instead"); return false; } }
  async function copyX(i) {
    const g = pick(D.items[i]);
    if (await put(JSON.stringify({ type: "excalidraw/clipboard", elements: els(g.ch), files: {} }), `Copied ${g.ch} ${g.name}. Paste in Excalidraw with ${MAC ? "⌘" : "Ctrl"} V`)) {
      const r = [i, ...(st("sdk-emoji-recent") || []).filter(x => x !== i)].slice(0, 32); st("sdk-emoji-recent", r); ev("copy-emoji/" + D.items[i][1].toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    }
  }

  document.addEventListener("click", e => {
    if (!root || !root.contains(e.target)) return;
    const b = e.target.closest(".ej"); if (b) { const i = +b.dataset.e; sel = i; root.querySelectorAll('.ej[aria-pressed="true"]').forEach(x => x.removeAttribute("aria-pressed")); root.querySelectorAll(`.ej[data-e="${i}"]`).forEach(x => x.setAttribute("aria-pressed", "true")); const tr = root.querySelector("#emtray"); tr.hidden = false; tr.innerHTML = trayHTML(); copyX(i); return; }
    const t = e.target.closest("[data-t]"); if (t) { tone = t.dataset.t; st("sdk-emoji-tone", tone); root.querySelectorAll("[data-t]").forEach(x => x.setAttribute("aria-checked", String(x === t))); redraw(); ev("emoji-tone/" + (tone || "default")); return; }
    const a = e.target.closest("[data-a]"); if (a && sel != null) { const g = pick(D.items[sel]); if (a.dataset.a === "x") copyX(sel); if (a.dataset.a === "c") put(g.ch, `Copied ${g.ch}`); if (a.dataset.a === "n") put(libName(g.name), "Library name copied. Paste it in the Excalidraw library search"); return; }
    const tab = e.target.closest("#emtabs a"); if (tab) { e.preventDefault(); const g = root.querySelector(tab.getAttribute("href")); if (g) { let y = 0; for (let n = g; n; n = n.offsetParent) y += n.offsetTop; y -= sticky() + root.querySelector("#emtabs").offsetHeight + 6; scrollTo({ top: y, behavior: RM.matches ? "auto" : "smooth" }); } }
  });
  let qt = 0;
  document.addEventListener("input", e => { if (e.target.id !== "emq" || !root) return; clearTimeout(qt); qt = setTimeout(() => { term0 = e.target.value.trim(); root.querySelector("#emtabs").hidden = !!term0; root.querySelector("#embody").innerHTML = body(term0); if (term0) ev("emoji-search"); }, 120); });
  // arrow keys move between emoji
  document.addEventListener("keydown", e => {
    const b = e.target.closest && e.target.closest(".ej"); if (!b || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault(); const all = [...root.querySelectorAll(".ej")], k = all.indexOf(b), r0 = b.getBoundingClientRect();
    let n = null;
    if (e.key === "ArrowLeft") n = all[k - 1]; else if (e.key === "ArrowRight") n = all[k + 1];
    else { const dir = e.key === "ArrowDown" ? 1 : -1, cands = all.filter(x => { const r = x.getBoundingClientRect(); return dir > 0 ? r.top > r0.top + 4 : r.top < r0.top - 4; }); const rowTop = dir > 0 ? Math.min(...cands.map(x => x.getBoundingClientRect().top)) : Math.max(...cands.map(x => x.getBoundingClientRect().top)); n = cands.filter(x => x.getBoundingClientRect().top === rowTop).sort((a, c) => Math.abs(a.getBoundingClientRect().left - r0.left) - Math.abs(c.getBoundingClientRect().left - r0.left))[0]; }
    if (n) { n.focus(); n.scrollIntoView({ block: "nearest" }); }
  });

  // emoji that match a search on the Blocks page, shown under the block results
  function hits(term, after) {
    load().then(() => {
      if (!after.isConnected) return; const L = match(term); if (!L.length) return;
      const sec = document.createElement("section"); sec.className = "row emo emhit"; root = sec;
      const show = L.slice(0, 40);
      sec.innerHTML = `<h2>Emoji <span class="n">${L.length}</span></h2><div class="eg">${show.map(btn).join("")}</div>${L.length > show.length ? `<button type="button" class="more2" data-go="emoji">See all ${L.length} in Emoji</button>` : ""}<div class="emtray" id="emtray" hidden></div>`;
      if (after.querySelector(".empty")) { after.replaceWith(sec); } else after.after(sec);
      const b = sec.querySelector(".more2"); if (b) b.addEventListener("click", ev2 => { ev2.stopPropagation(); pend = term; window.location.hash = "emoji"; }, true);
    });
  }
  window.EMO = { view: (rows, term) => view(rows, term), hits, load };
  // opened straight on #emoji: the page drew before this file loaded
  if (typeof cat !== "undefined" && cat === "emoji" && typeof draw === "function") draw();
  if ("requestIdleCallback" in window) requestIdleCallback(() => load()); else setTimeout(load, 1500);
})();
