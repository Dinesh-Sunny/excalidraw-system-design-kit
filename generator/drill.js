/* Drill: walk a tree of ideas the way Finder's column view works.
   Every level you opened stays visible as a column, so you always see where you are and can jump back
   to any level with one click. The last column explains the chosen idea. On phones it becomes one
   column that slides in and out like an app. Keys: up/down move, right/Enter go in, left/Esc come out;
   right-click also comes out. Search finds any idea and jumps there.
   Shared by Explore and the practice canvas. Nodes: {id, t, s?, d?, img?, l?, k?, r?, sl?}. */
function Drill(host, tree, o) {
  o = o || {};
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const E = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const BY = {}; (function idx(n) { if (n.sl && !BY[n.sl]) BY[n.sl] = n; (n.k || []).forEach(idx); })(tree);
  const resolve = n => (n && n.r && !(n.k && n.k.length) && BY[n.r] ? Object.assign({}, BY[n.r], { id: n.id, t: n.t, s: n.s || BY[n.r].s, d: n.d || BY[n.r].d }) : n);
  const kids = n => (n && n.k ? n.k : []).map(resolve);
  let stack = [tree], sel = 0, root = tree;
  host.classList.add("drill");
  host.innerHTML = `<div class="dr-top"><button type="button" class="dr-back" aria-label="Back">←</button><nav class="dr-trail" aria-label="Where you are"></nav>${o.search === false ? "" : `<label class="dr-find"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><path d="m16.5 16.5-3.5-3.5"/></svg><input type="search" placeholder="Find an idea" aria-label="Find an idea"></label>`}</div>
    <div class="dr-cols" role="tree"></div><div class="dr-hits" hidden></div>`;
  const q = s => host.querySelector(s), cols = q(".dr-cols"), trail = q(".dr-trail"), backB = q(".dr-back"), find = q(".dr-find input"), hits = q(".dr-hits");
  const phone = () => host.clientWidth < 720;
  const rowHTML = (n, i, on) => { const k = (n.k || []).length || (n.r && BY[n.r] ? (BY[n.r].k || []).length : 0);
    return `<button type="button" class="dr-row${on ? " on" : ""}${k ? "" : " leaf"}" data-i="${i}" role="treeitem" aria-expanded="${k ? !!on : "false"}" aria-selected="${!!on}">
      <span class="t">${E(n.t)}</span>${n.s && !phone() ? "" : n.s ? `<span class="s">${E(n.s)}</span>` : ""}${k ? `<span class="c">${k}</span><svg class="ch" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg>` : ""}</button>`; };
  function detailHTML(n) {
    const sib = stack.length > 1 ? kids(stack[stack.length - 2]) : [], at = sib.findIndex(x => x.id === n.id);
    const links = (n.l || []).map((x, i) => `<a class="${i ? "" : "primary"}" href="${E(x[1])}"${/^https?:/.test(x[1]) ? ' target="_blank" rel="noopener"' : ""}>${E(x[0])}</a>`).join("");
    return `<div class="dr-det">${n.img ? `<img alt="" loading="lazy" src="${E((o.base || "") + n.img)}">` : ""}<h3>${E(n.t)}</h3>${n.d ? `<p>${E(n.d)}</p>` : ""}${n.s && n.s !== n.d && !(n.d || "").startsWith(n.s) ? `<p class="m">${E(n.s)}</p>` : ""}
      ${links ? `<div class="dr-links">${links}</div>` : ""}
      ${sib.length > 1 ? `<div class="dr-sibs">${at > 0 ? `<button type="button" data-sib="${at - 1}">← ${E(sib[at - 1].t)}</button>` : "<span></span>"}${at < sib.length - 1 ? `<button type="button" data-sib="${at + 1}">${E(sib[at + 1].t)} →</button>` : ""}</div>` : ""}</div>`;
  }
  /* columns: one per open level; on a phone only the deepest one shows */
  function draw(dir) {
    const cur = stack[stack.length - 1], k = kids(cur), nar = phone();
    const tv = nar ? stack.slice(-2) : stack, off = stack.length - tv.length;
    trail.innerHTML = (off ? '<span aria-hidden="true">…</span>' : "") + tv.map((n, j) => { const i = j + off; return `${j ? '<span aria-hidden="true">›</span>' : ""}<button type="button" data-up="${i}"${i === stack.length - 1 ? ' aria-current="true"' : ""}>${E(n.t)}</button>`; }).join("");
    backB.disabled = stack.length < 2 && !o.onExit;
    const levels = [];
    for (let i = 0; i < stack.length; i++) { const kk = kids(stack[i]); if (!kk.length) break; levels.push({ i, kk, on: stack[i + 1] ? stack[i + 1].id : null }); }
    const fit = Math.max(1, Math.floor((cols.clientWidth - (k.length ? 340 : 380)) / 272)); /* keep the explanation in view; older levels stay in the trail */
    const showLv = nar ? levels.slice(-1) : levels.slice(-fit);
    let html = showLv.map(L => `<div class="dr-col" data-lv="${L.i}"><div class="dr-ch">${E(stack[L.i].t)}</div>${L.kk.map((n, j) => rowHTML(n, j, n.id === L.on)).join("")}</div>`).join("");
    if (!k.length) html = (nar ? "" : html) + `<div class="dr-col det">${detailHTML(cur)}</div>`;
    else if (!nar && stack.length === 1 && root.d) html += `<div class="dr-col det intro"><div class="dr-det"><h3>${E(root.t)}</h3><p>${E(root.d)}</p></div></div>`;
    else if (!nar) { html += `<div class="dr-col det peek"><div class="dr-det">${cur.img ? `<img alt="" loading="lazy" src="${E((o.base || "") + cur.img)}">` : ""}<h3>${E(cur.t)}</h3>${cur.d || cur.s ? `<p class="m">${E(cur.d || cur.s)}</p>` : ""}<div class="dr-sums">${k.map((n, j) => `<button type="button" class="dr-sum" data-sum="${j}"><b>${E(n.t)}</b>${n.d || n.s ? `<span>${E(n.d || n.s)}</span>` : ""}${(n.k || []).length ? `<em>${n.k.length} inside</em>` : ""}</button>`).join("")}</div>${(cur.l || []).length ? `<div class="dr-links">${cur.l.map((x, i) => `<a class="${i ? "" : "primary"}" href="${E(x[1])}"${/^https?:/.test(x[1]) ? ' target="_blank" rel="noopener"' : ""}>${E(x[0])}</a>`).join("")}</div>` : ""}</div></div>`; }
    cols.innerHTML = html; cols.classList.toggle("phone", nar);
    const last = cols.lastElementChild; if (!RM && last) last.animate(nar ? [{ opacity: 0, transform: `translateX(${dir === "out" ? -24 : 24}px)` }, { opacity: 1, transform: "none" }] : [{ opacity: 0, transform: "translateX(16px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" });
    requestAnimationFrame(() => { cols.scrollTo({ left: cols.scrollWidth, behavior: RM ? "auto" : "smooth" }); const on = cols.querySelectorAll(".dr-row.on"); on.forEach(r => r.scrollIntoView({ block: "nearest" })); });
    o.onMove && o.onMove(stack);
  }
  function openAt(lv, j) { const kk = kids(stack[lv]); if (!kk[j]) return; stack = stack.slice(0, lv + 1).concat([kk[j]]); draw("in"); focusRow(); }
  function out(to) { if (stack.length < 2) { o.onExit && o.onExit(); return; } stack = stack.slice(0, to == null ? -1 : to + 1); draw("out"); focusRow(); }
  function focusRow() { requestAnimationFrame(() => { const c = [...cols.querySelectorAll(".dr-col:not(.det)")].pop(); const r = c && (c.querySelector(".dr-row.on") || c.querySelector(".dr-row")); if (r && host.contains(document.activeElement)) r.focus({ preventScroll: true }); }); }
  cols.addEventListener("click", e => { const r = e.target.closest(".dr-row"); if (r) { openAt(+r.closest(".dr-col").dataset.lv, +r.dataset.i); return; } const sm = e.target.closest("[data-sum]"); if (sm) { openAt(stack.length - 1, +sm.dataset.sum); return; } const s = e.target.closest("[data-sib]"); if (s) { const lv = stack.length - 2; openAt(lv, +s.dataset.sib); } });
  cols.addEventListener("keydown", e => {
    const r = e.target.closest(".dr-row"); if (!r) return; const col = r.closest(".dr-col"), rows = [...col.querySelectorAll(".dr-row")], i = rows.indexOf(r);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); const n = rows[Math.max(0, Math.min(rows.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)))]; n.focus(); openAt(+col.dataset.lv, +n.dataset.i); }
    else if (e.key === "ArrowRight") { e.preventDefault(); const nx = col.nextElementSibling && col.nextElementSibling.querySelector(".dr-row"); if (nx) { nx.focus(); openAt(+nx.closest(".dr-col").dataset.lv, 0); } }
    else if (e.key === "ArrowLeft") { e.preventDefault(); const pv = col.previousElementSibling && col.previousElementSibling.querySelector(".dr-row.on"); if (pv) pv.focus(); else out(); }
  });
  host.addEventListener("contextmenu", e => { if (e.target.closest("a, input")) return; if (stack.length > 1 || o.onExit) { e.preventDefault(); out(); } });
  trail.addEventListener("click", e => { const b = e.target.closest("[data-up]"); if (b && !b.hasAttribute("aria-current")) out(+b.dataset.up); });
  backB.onclick = () => out();
  /* search: every idea, with its path, one tap to jump there */
  let flat = null;
  const buildFlat = () => { flat = []; (function walk(n, p) { kids(n).forEach(c => { const pp = p.concat(c.id); flat.push({ p: pp, t: c.t, x: (c.t + " " + (c.s || "") + " " + (c.d || "")).toLowerCase(), where: p.length ? pathTitles(p) : "" }); if (pp.length < 6 && !c.r) walk(c, pp); }); })(root, []); };
  const pathTitles = p => { let n = root; return p.map(id => (n = kids(n).find(x => x.id === id) || n).t).join(" › "); };
  if (find) {
    find.addEventListener("input", () => { const v = find.value.trim().toLowerCase(); if (!v) { hits.hidden = true; return; } if (!flat) buildFlat();
      const w = v.split(/\s+/), res = flat.filter(f => w.every(x => f.x.includes(x))).sort((a, b) => (b.t.toLowerCase().includes(v) - a.t.toLowerCase().includes(v)) || a.p.length - b.p.length).slice(0, 12);
      hits.hidden = false; hits.innerHTML = res.length ? res.map((f, i) => `<button type="button" data-hit="${i}"><b>${E(f.t)}</b><span>${E(f.where)}</span></button>`).join("") : `<p>Nothing yet for "${E(v)}". Try a shorter word.</p>`; hits._r = res; });
    hits.addEventListener("click", e => { const b = e.target.closest("[data-hit]"); if (!b) return; api.open(hits._r[+b.dataset.hit].p); find.value = ""; hits.hidden = true; });
    find.addEventListener("keydown", e => { if (e.key === "Enter") { const b = hits.querySelector("[data-hit]"); if (b) b.click(); } if (e.key === "Escape") { find.value = ""; hits.hidden = true; e.stopPropagation(); } });
  }
  const onKey = e => { if (e.key === "Escape" && host.isConnected && host.offsetParent !== null && !document.querySelector("dialog[open]") && document.activeElement !== find) { e.preventDefault(); out(); } };
  addEventListener("keydown", onKey);
  let rz, wasPhone = phone(); const onRz = () => { clearTimeout(rz); rz = setTimeout(() => { if (host.isConnected && phone() !== wasPhone) { wasPhone = phone(); draw(); } }, 150); }; addEventListener("resize", onRz);
  const api = {
    open(ids) { root = tree; flat = null; stack = [tree]; for (const id of ids || []) { const n = kids(stack[stack.length - 1]).find(x => x.id === id); if (!n) break; stack.push(n); } draw("in"); },
    openSlug(sl) { const n = BY[sl]; if (!n) return false; root = n; flat = null; stack = [n]; draw("in"); return true; },
    path: () => stack.slice(1).map(n => n.id), has: sl => !!BY[sl],
    destroy() { removeEventListener("keydown", onKey); removeEventListener("resize", onRz); }
  };
  return api;
}
