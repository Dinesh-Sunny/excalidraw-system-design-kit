import { comp, nid, txt, rect, INK, MUTED } from "./core.js";

// Grid diagram builder used by patterns and templates.
// spec: { title, sub, nodes:[[id,title,icon,theme,c,r]], edges:[[from,to,label,opts]], notes, colw, rowh }
export function diagram(spec) {
  const gid = nid("tpl");
  const COLW = spec.colw || 240, ROWH = spec.rowh || 180;
  const els = [];
  const minR = spec.minR ?? Math.min(...spec.nodes.map((n) => n[5]));
  const Y0 = (spec.title ? 120 : 0) - minR * ROWH;
  const S20 = (v) => Math.round(v / 20) * 20;
  const P = (c, r) => [S20(c * COLW), S20(Y0 + r * ROWH)];
  if (spec.title) {
    els.push(txt(0, 0, spec.title, { fontSize: 36, groupIds: [gid] }));
    if (spec.sub) els.push(txt(0, 52, spec.sub, { fontSize: 20, strokeColor: MUTED, groupIds: [gid] }));
  }
  const N = {};
  const H = spec.nodes.some((n) => n[1].includes("\n")) ? 120 : 100; // one node height per diagram
  for (const [id, title, icon, theme, c, r, w] of spec.nodes) {
    const [x, y] = P(c, r);
    const k = comp(x, y, { title, icon, theme, id: nid("n" + id + "_"), w, h: H }, [gid]);
    N[id] = { x, y, w: k.w, h: k.h, id: k.id };
    els.push(...k.els);
  }
  const side = (n, tx, ty) => {
    const cx = n.x + n.w / 2, cy = n.y + n.h / 2, dx = tx - cx, dy = ty - cy, G = 6;
    if (Math.abs(dx) / (n.w / 2 + 20) >= Math.abs(dy) / (n.h / 2 + 20)) return [dx > 0 ? n.x + n.w + G : n.x - G, cy];
    return [cx, dy > 0 ? n.y + n.h + G : n.y - G];
  };
  for (const [a, b, label, o = {}] of spec.edges) {
    const A = N[a], B = N[b];
    if (!A || !B) throw new Error("edge " + a + "->" + b);
    const via = (o.via || []).map(([c, r]) => P(c, r));
    const ac = [A.x + A.w / 2, A.y + A.h / 2], bc = [B.x + B.w / 2, B.y + B.h / 2];
    const s = side(A, ...(via[0] || bc));
    const e = side(B, ...(via[via.length - 1] || ac));
    // keep straight lines straight when nodes are aligned
    if (!via.length) {
      if (Math.abs(s[1] - e[1]) < 30 && s[0] !== ac[0]) { const y = (s[1] + e[1]) / 2; s[1] = y; e[1] = y; }
      if (Math.abs(s[0] - e[0]) < 30 && s[1] !== ac[1]) { const x = (s[0] + e[0]) / 2; s[0] = x; e[0] = x; }
    }
    if (via.length) { // snap via to the start/end so segments are orthogonal
      if (o.ortho !== false) { via[0] = [s[0] === A.x + A.w / 2 ? s[0] : via[0][0], s[1] === A.y + A.h / 2 ? s[1] : via[0][1]];
        const L = via.length - 1; via[L] = [e[0] === B.x + B.w / 2 ? e[0] : via[L][0], e[1] === B.y + B.h / 2 ? e[1] : via[L][1]]; }
    }
    const pts = [s, ...via, e];
    const arrow = {
      type: "arrow", x: s[0], y: s[1], points: pts.map((p) => [p[0] - s[0], p[1] - s[1]]),
      strokeColor: o.color || "#495057", strokeWidth: 2, roundness: null,
      strokeStyle: o.dash ? "dashed" : o.dot ? "dotted" : "solid",
      startArrowhead: o.both ? "arrow" : null, endArrowhead: "arrow",
      start: { id: A.id }, end: { id: B.id }, groupIds: [gid],
    };
    if (label) arrow.label = { text: label, fontSize: 14, strokeColor: "#343a40" };
    els.push(arrow);
  }
  if (spec.notes) {
    // notes sit BELOW the diagram at its width, so the item grows down, not sideways
    const V = Object.values(N), nx = S20(Math.min(...V.map((n) => n.x)));
    const bottom = Math.max(...V.map((n) => n.y + n.h), ...els.filter((e) => e.type === "arrow").map((e) => e.y + Math.max(...e.points.map((p) => p[1]))));
    const ny = S20(bottom + 60); // below every node AND every loop arrow
    const nw = Math.max(400, S20(Math.max(...V.map((n) => n.x + n.w)) - nx));
    const nl = spec.notes.split("\n"), cpl = Math.floor((nw - 24) / 8.6);
    const lines = nl.reduce((a, l) => a + Math.max(1, Math.ceil(l.length / cpl)), 0);
    els.push(rect(nx, ny, nw, S20(30 + lines * 21), {
      groupIds: [gid], strokeColor: "#f08c00", backgroundColor: "#fff9db", strokeWidth: 1,
      label: { text: spec.notes, fontSize: 16, textAlign: "left", verticalAlign: "top", strokeColor: INK },
    }));
  }
  return els;
}
