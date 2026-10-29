/*__DRILLJS__*/
/* Explore: the whole kit as one Drill map; the path lives in the hash (#p=a/b/c) so links, refresh and Back work */
const pathOf = () => { const p = (location.hash.match(/#p=([^&]*)/) || [])[1]; return p ? p.split("/").map(decodeURIComponent) : []; };
let DR = null;
fetch("tree.json").then(r => r.json()).then(t => {
  DR = Drill($("#drill"), t, { base: "../", onMove: st => { const p = st.slice(1).map(n => n.id); history.replaceState(null, "", p.length ? "#p=" + p.map(encodeURIComponent).join("/") : location.pathname); document.title = (p.length ? st[st.length - 1].t + " - " : "") + "Explore - System Design Kit"; try { window.goatcounter && window.goatcounter.count({ path: "explore/" + p.join("/"), event: true }); } catch (e) {} } });
  DR.open(pathOf());
}).catch(() => { $("#drill").innerHTML = '<p style="color:var(--ink-muted)">The map is still loading. Refresh in a moment.</p>'; });
addEventListener("hashchange", () => { if (DR) { const p = pathOf(); if (p.join("/") !== DR.path().join("/")) DR.open(p); } });
