/* Drill: a mind-map you can walk into. The current idea sits on the left, the ideas inside it branch out
   to the right with drawn connectors; each branch previews how deep it goes. Go in with a tap or double-click,
   come out with right-click, Esc, Back or the trail. Cards glide between levels (FLIP), so you never lose your place.
   Shared by the Explore page and the practice canvas. Needs TREE nodes {id, t, s?, d?, img?, l?, k?, r?, sl?}. */
function Drill(host, tree, o) {
  o = o || {};
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches, NS = "http://www.w3.org/2000/svg";
  const E = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const BY = {}; (function idx(n) { if (n.sl) BY[n.sl] = n; (n.k || []).forEach(idx); })(tree);
  const kids = n => (n.k && n.k.length ? n.k : n.r && BY[n.r] ? BY[n.r].k || [] : []);
  const depth = n => { const k = kids(n); return k.length ? 1 + Math.max(...k.slice(0, 12).map(x => (x.k || []).length ? 1 + Math.min(2, Math.max(...x.k.map(y => (y.k || []).length ? 1 : 0))) : 0)) : 0; };
  let stack = [tree], busy = false;
  host.classList.add("drill");
  host.innerHTML = `<div class="dr-top"><button type="button" class="dr-back" hidden>← Back</button><nav class="dr-trail" aria-label="Where you are"></nav></div><div class="dr-stage"><svg class="dr-wires" aria-hidden="true"></svg><div class="dr-cards"></div></div><div class="dr-detail" hidden></div>`;
  const $q = s => host.querySelector(s), stage = $q(".dr-stage"), wires = $q(".dr-wires"), cards = $q(".dr-cards"), trail = $q(".dr-trail"), backB = $q(".dr-back"), detail = $q(".dr-detail");
  const narrow = () => (stage.clientWidth || host.clientWidth) < 640;
  function cardHTML(n, role, i) {
    const k = kids(n), dp = depth(n);
    const dots = k.length ? `<span class="dr-depth" title="${dp} level${dp > 1 ? "s" : ""} inside">${Array.from({ length: Math.min(dp, 3) }, (_, j) => `<i style="--j:${j}"></i>`).join("")}</span>` : "";
    return `<div class="dr-card ${role}${k.length ? "" : " leaf"}" data-id="${E(n.id)}" data-i="${i}" tabindex="0" role="button" aria-label="${E(n.t)}${k.length ? ", " + k.length + " inside" : ""}">
      ${n.img ? `<img alt="" loading="lazy" src="${E((o.base || "") + n.img)}">` : ""}
      <b>${E(n.t)}</b>${role === "root" ? (n.d ? `<p>${E(n.d)}</p>` : n.s ? `<p>${E(n.s)}</p>` : "") : n.s ? `<span>${E(n.s)}</span>` : ""}
      ${k.length && role !== "root" ? `<em>${k.length} inside</em>` : ""}${dots}</div>`;
  }
  function layout() {
    const cur = stack[stack.length - 1], k = kids(cur), W = stage.clientWidth || host.clientWidth, nar = narrow();
    const els = [...cards.children], root = els[0], ch = els.slice(1);
    const rw = nar ? W : !k.length ? Math.min(W, 760) : Math.min(340, Math.max(240, W * 0.3)), cx = nar ? 0 : rw + 90, cw = nar ? W - 22 : W - cx;
    root.style.width = rw + "px"; root.style.left = "0px"; root.style.top = "0px";
    let y = nar ? root.offsetHeight + 28 : 0; const gap = 12;
    ch.forEach(c => { c.style.width = cw + "px"; c.style.left = (nar ? 22 : cx) + "px"; c.style.top = y + "px"; y += c.offsetHeight + gap; });
    const H = Math.max(y - gap, root.offsetHeight); if (!nar) root.style.top = Math.max(0, Math.min(H - root.offsetHeight, (ch.length ? (parseFloat(ch[0].style.top) + parseFloat(ch[ch.length - 1].style.top) + ch[ch.length - 1].offsetHeight) / 2 : 0) - root.offsetHeight / 2)) + "px";
    stage.style.height = H + "px"; wires.setAttribute("width", W); wires.setAttribute("height", H); wires.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const rt = parseFloat(root.style.top), sx = nar ? 10 : rw, sy = nar ? root.offsetHeight : rt + root.offsetHeight / 2;
    wires.innerHTML = ch.map((c, i) => { const ty = parseFloat(c.style.top) + Math.min(28, c.offsetHeight / 2), tx = parseFloat(c.style.left);
      const d = nar ? `M ${sx} ${sy} L ${sx} ${ty} L ${tx} ${ty}` : `M ${sx} ${sy} C ${sx + 50} ${sy}, ${tx - 50} ${ty}, ${tx} ${ty}`;
      return `<path d="${d}" style="--i:${i}" pathLength="1"/>`; }).join("");
    return k;
  }
  function draw(dir, from) {
    const cur = stack[stack.length - 1], k = kids(cur);
    const old = {}; [...cards.children].forEach(c => old[c.dataset.id] = c.getBoundingClientRect());
    trail.innerHTML = stack.map((n, i) => `${i ? '<span aria-hidden="true">/</span>' : ""}<button type="button" data-up="${i}"${i === stack.length - 1 ? ' aria-current="true"' : ""}>${E(n.t)}</button>`).join("");
    backB.hidden = stack.length < 2 && !o.onExit;
    cards.innerHTML = cardHTML(cur, "root", -1) + k.map((n, i) => cardHTML(n, "kid", i)).join("");
    detail.hidden = true; let dh = "";
    if (cur.l && cur.l.length) dh += cur.l.map((x, i) => `<a class="${i ? "" : "primary"}" href="${E(x[1])}"${/^https?:/.test(x[1]) ? ' target="_blank" rel="noopener"' : ""}>${E(x[0])}</a>`).join("");
    if (!k.length && stack.length > 1) { const sib = kids(stack[stack.length - 2]), at = sib.findIndex(x => x.id === cur.id); /* read the next idea without going back out */
      if (at > 0) dh += `<button type="button" class="dr-sib" data-sib="${at - 1}">← ${E(sib[at - 1].t)}</button>`; if (at > -1 && at < sib.length - 1) dh += `<button type="button" class="dr-sib" data-sib="${at + 1}">${E(sib[at + 1].t)} →</button>`; }
    if (dh) { detail.hidden = false; detail.innerHTML = dh; }
    host.classList.toggle("is-leaf", !k.length);
    layout();
    if (RM) return;
    /* FLIP: a card that was on screen glides from where it was to where it is now */
    [...cards.children].forEach((c, i) => {
      const was = old[c.dataset.id] || (from && i === 0 ? from : null), now = c.getBoundingClientRect();
      if (was) { const dx = was.left - now.left, dy = was.top - now.top, s = Math.max(.4, Math.min(2.5, was.width / now.width)); c.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, transformOrigin: "0 0" }, { transform: "none", transformOrigin: "0 0" }], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" }); }
      else c.animate([{ opacity: 0, transform: `translateX(${dir === "out" ? -16 : 24}px) scale(.97)` }, { opacity: 1, transform: "none" }], { duration: 360, delay: 60 + Math.min(i, 10) * 35, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
    });
    wires.querySelectorAll("path").forEach((p, i) => p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 420, delay: 120 + Math.min(i, 10) * 35, easing: "ease-out", fill: "backwards" }));
  }
  function goIn(i, el) { const cur = stack[stack.length - 1], n = kids(cur)[i]; if (!n || busy) return; const r = n.r && BY[n.r] && !n.k ? Object.assign({}, BY[n.r], { id: n.id, t: n.t, s: n.s || BY[n.r].s }) : n; if (!kids(r).length && !(r.l || []).length && !r.d) return; busy = true; stack.push(r); draw("in", el && el.getBoundingClientRect()); busy = false; o.onMove && o.onMove(stack); }
  function goOut(to) { if (busy) return; if (stack.length < 2) { o.onExit && o.onExit(); return; } stack = stack.slice(0, to == null ? -1 : to + 1); draw("out"); o.onMove && o.onMove(stack); }
  cards.addEventListener("click", e => { const c = e.target.closest(".dr-card.kid"); if (c) goIn(+c.dataset.i, c); });
  cards.addEventListener("dblclick", e => { if (e.target.closest(".dr-card.root")) goOut(); });
  cards.addEventListener("keydown", e => { const c = e.target.closest(".dr-card.kid"); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); goIn(+c.dataset.i, c); } });
  host.addEventListener("contextmenu", e => { if (e.target.closest("a")) return; if (stack.length > 1 || o.onExit) { e.preventDefault(); goOut(); } });
  trail.addEventListener("click", e => { const b = e.target.closest("[data-up]"); if (b && !b.hasAttribute("aria-current")) goOut(+b.dataset.up); });
  backB.onclick = () => goOut();
  detail.addEventListener("click", e => { const b = e.target.closest("[data-sib]"); if (!b || busy) return; const sib = kids(stack[stack.length - 2]); stack[stack.length - 1] = sib[+b.dataset.sib]; draw("in"); o.onMove && o.onMove(stack); });
  const onKey = e => { if (e.key === "Escape" && host.isConnected && host.offsetParent !== null && !document.querySelector("dialog[open]")) { e.preventDefault(); goOut(); } };
  addEventListener("keydown", onKey);
  let rz; const onRz = () => { clearTimeout(rz); rz = setTimeout(() => host.isConnected && layout(), 120); }; addEventListener("resize", onRz);
  const api = {
    open(ids) { stack = [tree]; for (const id of ids || []) { const n = kids(stack[stack.length - 1]).find(x => x.id === id); if (!n) break; stack.push(n.r && BY[n.r] && !n.k ? Object.assign({}, BY[n.r], { id: n.id, t: n.t }) : n); } draw("in"); },
    openSlug(sl, from) { const n = BY[sl]; if (!n) return false; stack = [n]; draw("in", from); return true; },
    path: () => stack.slice(1).map(n => n.id), has: sl => !!BY[sl],
    destroy() { removeEventListener("keydown", onKey); removeEventListener("resize", onRz); }
  };
  return api;
}
