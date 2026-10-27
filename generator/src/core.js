// Core helpers: themes, primitives, icons, component card builder.
export const T = {
  client: { fill: "#a5d8ff", stroke: "#1971c2" },
  edge: { fill: "#99e9f2", stroke: "#0c8599" },
  svc: { fill: "#d0bfff", stroke: "#6741d9" },
  data: { fill: "#b2f2bb", stroke: "#2f9e44" },
  cache: { fill: "#ffc9c9", stroke: "#e03131" },
  msg: { fill: "#ffec99", stroke: "#e67700" },
  ai: { fill: "#fcc2d7", stroke: "#c2255c" },
  ops: { fill: "#e9ecef", stroke: "#495057" },
  ext: { fill: "#ffd8a8", stroke: "#d9480f" },
  agent: { fill: "#eebefa", stroke: "#9c36b5" },
  rag: { fill: "#d8f5a2", stroke: "#5c940d" },
  llmops: { fill: "#bac8ff", stroke: "#3b5bdb" },
};
export const INK = "#1e1e1e";
export const MUTED = "#868e96";
export const ACCENT = "#4263eb";
export const WHITE = "#ffffff";

let seq = 0;
export const nid = (p = "e") => `${p}${(++seq).toString(36)}`;
export const resetIds = (p) => { seq = 0; };

// ---------- primitives (skeletons) ----------
export const rect = (x, y, w, h, o = {}) => ({ type: "rectangle", x, y, width: w, height: h, roundness: { type: 3 }, ...o });
export const ell = (x, y, w, h, o = {}) => ({ type: "ellipse", x, y, width: w, height: h, ...o });
export const dia = (x, y, w, h, o = {}) => ({ type: "diamond", x, y, width: w, height: h, ...o });
export const txt = (x, y, text, o = {}) => ({ type: "text", x, y, text, fontSize: 16, strokeColor: INK, ...o });
export function poly(x, y, pts, o = {}) {
  const p = pts.slice();
  if (o.closed) p.push(p[0]);
  const { closed, ...rest } = o;
  return {
    type: "line", x: x + p[0][0], y: y + p[0][1],
    points: p.map((q) => [q[0] - p[0][0], q[1] - p[0][1]]),
    ...(closed ? { fillStyle: "solid" } : {}), ...rest,
  };
}
export function arr(x1, y1, x2, y2, o = {}) {
  return { type: "arrow", x: x1, y: y1, points: [[0, 0], [x2 - x1, y2 - y1]], endArrowhead: "arrow", startArrowhead: null, ...o };
}

// ---------- icons: drawn inside a 40x40 box at (x,y) ----------
const sw = 1.5;
export const ICONS = {
  user: (x, y, c, f) => [ell(x + 13, y + 2, 14, 14, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    rect(x + 6, y + 20, 28, 18, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: { type: 3 } })],
  users: (x, y, c) => [ell(x + 3, y + 6, 11, 11, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    rect(x - 2, y + 20, 22, 14, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    ell(x + 23, y + 2, 13, 13, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    rect(x + 17, y + 18, 25, 18, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw })],
  mobile: (x, y, c) => [rect(x + 10, y, 20, 40, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[16, 34], [24, 34]], { strokeColor: c, strokeWidth: sw }), rect(x + 16, y + 3, 8, 3, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })],
  browser: (x, y, c) => [rect(x, y + 5, 40, 30, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }),
    poly(x, y, [[0, 13], [40, 13]], { strokeColor: c, strokeWidth: sw }),
    ...[4, 9, 14].map((d) => ell(x + d, y + 8, 3, 3, { strokeColor: c, backgroundColor: c, strokeWidth: 1 }))],
  desktop: (x, y, c) => [rect(x + 1, y + 3, 38, 26, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }),
    poly(x, y, [[20, 29], [20, 36]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[11, 37], [29, 37]], { strokeColor: c, strokeWidth: 2 })],
  iot: (x, y, c) => [rect(x + 9, y + 9, 22, 22, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }),
    ...[14, 20, 26].flatMap((d) => [poly(x, y, [[d, 2], [d, 9]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[d, 31], [d, 38]], { strokeColor: c, strokeWidth: sw }),
      poly(x, y, [[2, d], [9, d]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[31, d], [38, d]], { strokeColor: c, strokeWidth: sw })])],
  server: (x, y, c) => [4, 15, 26].flatMap((d) => [rect(x + 3, y + d, 34, 10, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }),
    ell(x + 29, y + d + 3.5, 3, 3, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })]),
  service: (x, y, c) => [poly(x, y, [[20, 1], [37, 10.5], [37, 29.5], [20, 39], [3, 29.5], [3, 10.5]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[13, 20], [27, 20]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[20, 13], [20, 27]], { strokeColor: c, strokeWidth: sw })],
  db: (x, y, c, f, bg = WHITE) => [ell(x + 4, y + 28, 32, 10, { strokeColor: c, backgroundColor: bg, strokeWidth: sw }),
    rect(x + 4, y + 7, 32, 26, { strokeColor: "transparent", backgroundColor: bg, strokeWidth: 0, roundness: null }),
    poly(x, y, [[4, 7], [4, 33]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[36, 7], [36, 33]], { strokeColor: c, strokeWidth: sw }),
    poly(x, y, [[4, 18], [10, 21.5], [20, 23], [30, 21.5], [36, 18]], { strokeColor: c, strokeWidth: 1, roundness: { type: 2 } }),
    ell(x + 4, y + 2, 32, 10, { strokeColor: c, backgroundColor: bg, strokeWidth: sw })],
  cache: (x, y, c) => [poly(x, y, [[24, 0], [7, 23], [18, 23], [14, 40], [33, 15], [22, 15]], { closed: true, strokeColor: c, backgroundColor: "#ffe066", strokeWidth: sw })],
  queue: (x, y, c) => [rect(x, y + 12, 34, 16, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }),
    ...[8.5, 17, 25.5].map((d) => poly(x, y, [[d, 12], [d, 28]], { strokeColor: c, strokeWidth: sw })),
    poly(x, y, [[34, 20], [40, 20]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[37, 17], [40, 20], [37, 23]], { strokeColor: c, strokeWidth: sw })],
  stream: (x, y, c) => [4, 16, 28].flatMap((d, i) => [rect(x + i * 3, y + d, 30 - i * 3, 8, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }),
    poly(x, y, [[31, d + 4], [39, d + 4]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[36, d + 1.5], [39, d + 4], [36, d + 6.5]], { strokeColor: c, strokeWidth: sw })]),
  pubsub: (x, y, c) => [ell(x, y + 14, 12, 12, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    ...[4, 20, 36].map((d) => poly(x, y, [[12, 20], [34, d]], { strokeColor: c, strokeWidth: sw })),
    ...[4, 20, 36].map((d) => ell(x + 33, y + d - 3, 6, 6, { strokeColor: c, backgroundColor: c, strokeWidth: 1 }))],
  lb: (x, y, c) => [ell(x + 1, y + 1, 38, 38, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    ...[11, 20, 29].map((d) => poly(x, y, [[8, 20], [16, 20], [30, d]], { strokeColor: c, strokeWidth: sw })),
    ...[11, 20, 29].map((d) => ell(x + 29, y + d - 2, 4, 4, { strokeColor: c, backgroundColor: c, strokeWidth: 1 }))],
  gateway: (x, y, c) => [rect(x + 2, y + 4, 36, 32, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    txt(x + 8, y + 12, "API", { fontSize: 12, strokeColor: c, fontFamily: 3 })],
  proxy: (x, y, c) => [rect(x + 12, y + 4, 16, 32, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[0, 14], [12, 14]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[28, 26], [40, 26]], { strokeColor: c, strokeWidth: sw }),
    poly(x, y, [[9, 11], [12, 14], [9, 17]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[37, 23], [40, 26], [37, 29]], { strokeColor: c, strokeWidth: sw })],
  globe: (x, y, c) => [ell(x + 1, y + 1, 38, 38, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    ell(x + 11, y + 1, 18, 38, { strokeColor: c, strokeWidth: 1, backgroundColor: "transparent" }),
    poly(x, y, [[1, 20], [39, 20]], { strokeColor: c, strokeWidth: 1 }), poly(x, y, [[5, 11], [35, 11]], { strokeColor: c, strokeWidth: 1 }), poly(x, y, [[5, 29], [35, 29]], { strokeColor: c, strokeWidth: 1 })],
  dns: (x, y, c) => [poly(x, y, [[20, 2], [20, 39]], { strokeColor: c, strokeWidth: 2 }),
    poly(x, y, [[8, 6], [32, 6], [37, 11], [32, 16], [8, 16]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[32, 20], [8, 20], [3, 25], [8, 30], [32, 30]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw })],
  bucket: (x, y, c) => [poly(x, y, [[3, 9], [37, 9], [32, 38], [8, 38]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    ell(x + 3, y + 4, 34, 10, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw })],
  search: (x, y, c) => [ell(x + 2, y + 2, 24, 24, { strokeColor: c, backgroundColor: WHITE, strokeWidth: 2 }), poly(x, y, [[23, 23], [37, 37]], { strokeColor: c, strokeWidth: 4 })],
  gear: (x, y, c) => {
    const pts = []; const n = 8;
    for (let i = 0; i < n * 2; i++) {
      const a0 = (i / (n * 2)) * Math.PI * 2, r = i % 2 === 0 ? 19 : 14;
      pts.push([20 + r * Math.cos(a0 - 0.12), 20 + r * Math.sin(a0 - 0.12)], [20 + r * Math.cos(a0 + 0.12), 20 + r * Math.sin(a0 + 0.12)]);
    }
    return [poly(x, y, pts, { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), ell(x + 14, y + 14, 12, 12, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })];
  },
  clock: (x, y, c) => [ell(x + 1, y + 1, 38, 38, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[20, 8], [20, 20], [29, 26]], { strokeColor: c, strokeWidth: 2 })],
  lambda: (x, y, c) => [rect(x + 2, y + 2, 36, 36, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[11, 9], [16, 9], [29, 32]], { strokeColor: c, strokeWidth: 2.5 }), poly(x, y, [[20, 18], [12, 32]], { strokeColor: c, strokeWidth: 2.5 })],
  cube: (x, y, c) => [poly(x, y, [[20, 2], [37, 11], [20, 20], [3, 11]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[3, 11], [20, 20], [20, 39], [3, 30]], { closed: true, strokeColor: c, backgroundColor: "#e7f5ff", strokeWidth: sw }),
    poly(x, y, [[37, 11], [20, 20], [20, 39], [37, 30]], { closed: true, strokeColor: c, backgroundColor: "#d0ebff", strokeWidth: sw })],
  lock: (x, y, c) => [poly(x, y, [[12, 19], [12, 11], [16, 4], [24, 4], [28, 11], [28, 19]], { strokeColor: c, strokeWidth: 2.5, roundness: { type: 2 } }),
    rect(x + 6, y + 18, 28, 20, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), ell(x + 17, y + 24, 6, 6, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })],
  shield: (x, y, c) => [poly(x, y, [[20, 1], [36, 7], [34, 24], [20, 39], [6, 24], [4, 7]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[13, 20], [18, 25], [27, 14]], { strokeColor: c, strokeWidth: 2.5 })],
  wall: (x, y, c) => [rect(x + 1, y + 6, 38, 28, { strokeColor: c, backgroundColor: "#ffd8a8", strokeWidth: sw, roundness: null }),
    poly(x, y, [[1, 15.3], [39, 15.3]], { strokeColor: c, strokeWidth: 1 }), poly(x, y, [[1, 24.6], [39, 24.6]], { strokeColor: c, strokeWidth: 1 }),
    ...[[14, 6, 15.3], [28, 6, 15.3], [8, 15.3, 24.6], [22, 15.3, 24.6], [34, 15.3, 24.6], [14, 24.6, 34], [28, 24.6, 34]].map(([a, b, d]) => poly(x, y, [[a, b], [a, d]], { strokeColor: c, strokeWidth: 1 }))],
  gauge: (x, y, c) => [poly(x, y, [[2, 30], [4, 18], [11, 9], [20, 6], [29, 9], [36, 18], [38, 30]], { strokeColor: c, strokeWidth: 3, roundness: { type: 2 } }),
    poly(x, y, [[20, 30], [30, 14]], { strokeColor: "#e03131", strokeWidth: 2.5 }), ell(x + 16, y + 26, 8, 8, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })],
  chart: (x, y, c) => [rect(x + 1, y + 4, 38, 32, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }),
    poly(x, y, [[5, 29], [13, 19], [20, 24], [28, 12], [35, 16]], { strokeColor: "#e03131", strokeWidth: 2 })],
  bars: (x, y, c) => [poly(x, y, [[2, 38], [38, 38]], { strokeColor: c, strokeWidth: 2 }),
    ...[[5, 24], [14, 14], [23, 20], [32, 6]].map(([a, h]) => rect(x + a, y + h, 6, 38 - h, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }))],
  doc: (x, y, c) => [poly(x, y, [[6, 1], [26, 1], [34, 9], [34, 39], [6, 39]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[26, 1], [26, 9], [34, 9]], { strokeColor: c, strokeWidth: sw }),
    ...[17, 24, 31].map((d) => poly(x, y, [[11, d], [29, d]], { strokeColor: c, strokeWidth: 1 }))],
  trace: (x, y, c) => [[2, 4, 36], [8, 14, 22], [14, 24, 12], [22, 34, 16]].map(([a, d, w]) => rect(x + a, y + d - 3, w, 6, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null })),
  bell: (x, y, c) => [poly(x, y, [[20, 3], [28, 7], [31, 16], [31, 26], [36, 31], [4, 31], [9, 26], [9, 16], [12, 7]], { closed: true, strokeColor: c, backgroundColor: "#ffe066", strokeWidth: sw, roundness: { type: 2 } }),
    ell(x + 16, y + 32, 8, 7, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })],
  mail: (x, y, c) => [rect(x + 1, y + 8, 38, 26, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }), poly(x, y, [[1, 8], [20, 23], [39, 8]], { strokeColor: c, strokeWidth: sw })],
  chat: (x, y, c) => [poly(x, y, [[2, 4], [38, 4], [38, 28], [16, 28], [8, 36], [9, 28], [2, 28]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    ...[12, 20, 28].map((d) => ell(x + d - 2, y + 14, 4, 4, { strokeColor: c, backgroundColor: c, strokeWidth: 1 }))],
  neural: (x, y, c) => {
    const L = [[[4, 8], [4, 20], [4, 32]], [[20, 4], [20, 15], [20, 26], [20, 36]], [[36, 14], [36, 26]]];
    const out = [];
    for (let i = 0; i < 2; i++) for (const a of L[i]) for (const b of L[i + 1]) out.push(poly(x, y, [a, b], { strokeColor: c, strokeWidth: 0.75 }));
    for (const l of L) for (const p of l) out.push(ell(x + p[0] - 3.5, y + p[1] - 3.5, 7, 7, { strokeColor: c, backgroundColor: WHITE, strokeWidth: 1.25 }));
    return out;
  },
  sparkle: (x, y, c) => [poly(x, y, [[20, 1], [24, 16], [39, 20], [24, 24], [20, 39], [16, 24], [1, 20], [16, 16]], { closed: true, strokeColor: c, backgroundColor: "#ffe066", strokeWidth: sw }),
    poly(x, y, [[33, 3], [34.5, 6.5], [38, 8], [34.5, 9.5], [33, 13], [31.5, 9.5], [28, 8], [31.5, 6.5]], { closed: true, strokeColor: c, backgroundColor: "#ffe066", strokeWidth: 1 })],
  vector: (x, y, c) => [poly(x, y, [[8, 32], [8, 4]], { strokeColor: c, strokeWidth: 2 }), poly(x, y, [[8, 32], [38, 32]], { strokeColor: c, strokeWidth: 2 }), poly(x, y, [[8, 32], [28, 14]], { strokeColor: c, strokeWidth: 2 }),
    ...[[8, 4], [38, 32], [28, 14]].map(([a, b]) => ell(x + a - 3, y + b - 3, 6, 6, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })),
    ...[[18, 9], [33, 22], [16, 24]].map(([a, b]) => ell(x + a - 2, y + b - 2, 4, 4, { strokeColor: c, backgroundColor: WHITE, strokeWidth: 1 }))],
  graph: (x, y, c) => [poly(x, y, [[8, 8], [32, 12], [20, 32], [8, 8]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[32, 12], [34, 34], [20, 32]], { strokeColor: c, strokeWidth: sw }),
    ...[[8, 8], [32, 12], [20, 32], [34, 34]].map(([a, b]) => ell(x + a - 5, y + b - 5, 10, 10, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }))],
  warehouse: (x, y, c) => [26, 14, 2].flatMap((d) => [rect(x + 4, y + d + 4, 32, 8, { strokeColor: "transparent", backgroundColor: WHITE, strokeWidth: 0, roundness: null }),
    poly(x, y, [[4, d + 4], [4, d + 12]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[36, d + 4], [36, d + 12]], { strokeColor: c, strokeWidth: sw }),
    ell(x + 4, y + d + 8, 32, 8, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), ell(x + 4, y + d, 32, 8, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw })]).slice(0),
  lake: (x, y, c) => [poly(x, y, [[1, 16], [7, 12], [13, 16], [19, 12], [25, 16], [31, 12], [39, 16]], { strokeColor: c, strokeWidth: 2, roundness: { type: 2 } }),
    poly(x, y, [[1, 25], [7, 21], [13, 25], [19, 21], [25, 25], [31, 21], [39, 25]], { strokeColor: c, strokeWidth: 2, roundness: { type: 2 } }),
    poly(x, y, [[1, 34], [7, 30], [13, 34], [19, 30], [25, 34], [31, 30], [39, 34]], { strokeColor: c, strokeWidth: 2, roundness: { type: 2 } })],
  cloud: (x, y, c) => [poly(x, y, [[8, 32], [2, 26], [4, 18], [11, 15], [14, 8], [22, 5], [29, 9], [32, 16], [38, 20], [38, 28], [33, 32]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: { type: 2 } })],
  card: (x, y, c) => [rect(x + 1, y + 7, 38, 26, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), rect(x + 1, y + 12, 38, 5, { strokeColor: c, backgroundColor: c, strokeWidth: 1, roundness: null }),
    rect(x + 5, y + 23, 10, 6, { strokeColor: c, backgroundColor: "#ffe066", strokeWidth: 1, roundness: null })],
  pin: (x, y, c) => [poly(x, y, [[20, 39], [9, 22], [7, 14], [11, 5], [20, 1], [29, 5], [33, 14], [31, 22]], { closed: true, strokeColor: c, backgroundColor: "#ff8787", strokeWidth: sw, roundness: { type: 2 } }),
    ell(x + 15, y + 9, 10, 10, { strokeColor: c, backgroundColor: WHITE, strokeWidth: 1 })],
  video: (x, y, c) => [rect(x + 1, y + 6, 38, 28, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), poly(x, y, [[16, 13], [27, 20], [16, 27]], { closed: true, strokeColor: c, backgroundColor: "#e03131", strokeWidth: 1 })],
  ws: (x, y, c) => [poly(x, y, [[2, 14], [38, 14]], { strokeColor: c, strokeWidth: 2 }), poly(x, y, [[32, 8], [38, 14], [32, 20]], { strokeColor: c, strokeWidth: 2 }),
    poly(x, y, [[2, 26], [38, 26]], { strokeColor: c, strokeWidth: 2 }), poly(x, y, [[8, 20], [2, 26], [8, 32]], { strokeColor: c, strokeWidth: 2 })],
  key: (x, y, c) => [ell(x + 2, y + 12, 16, 16, { strokeColor: c, backgroundColor: WHITE, strokeWidth: 2 }), poly(x, y, [[18, 20], [38, 20]], { strokeColor: c, strokeWidth: 2.5 }),
    poly(x, y, [[30, 20], [30, 27]], { strokeColor: c, strokeWidth: 2.5 }), poly(x, y, [[36, 20], [36, 26]], { strokeColor: c, strokeWidth: 2.5 })],
  hash: (x, y, c) => [rect(x + 2, y + 2, 36, 36, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), txt(x + 12, y + 6, "#", { fontSize: 24, strokeColor: c, fontFamily: 3 })],
  funnel: (x, y, c) => [poly(x, y, [[2, 4], [38, 4], [24, 20], [24, 36], [16, 32], [16, 20]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw })],
  waves: (x, y, c) => [ell(x + 1, y + 1, 38, 38, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[7, 17], [13, 12], [20, 17], [27, 22], [33, 17]], { strokeColor: c, strokeWidth: 2, roundness: { type: 2 } }),
    poly(x, y, [[7, 25], [13, 20], [20, 25], [27, 30], [33, 25]], { strokeColor: c, strokeWidth: 2, roundness: { type: 2 } })],
  flag: (x, y, c) => [poly(x, y, [[8, 2], [8, 39]], { strokeColor: c, strokeWidth: 2.5 }), poly(x, y, [[8, 4], [34, 4], [28, 12], [34, 20], [8, 20]], { closed: true, strokeColor: c, backgroundColor: "#69db7c", strokeWidth: sw })],
  cicd: (x, y, c) => [ell(x + 2, y + 6, 18, 28, { strokeColor: c, backgroundColor: WHITE, strokeWidth: 2 }), ell(x + 20, y + 6, 18, 28, { strokeColor: c, backgroundColor: WHITE, strokeWidth: 2 }),
    poly(x, y, [[30, 2], [34, 6.5], [29, 10]], { strokeColor: c, strokeWidth: 2 })],
  breaker: (x, y, c) => [poly(x, y, [[1, 26], [12, 26]], { strokeColor: c, strokeWidth: 2.5 }), poly(x, y, [[12, 26], [28, 12]], { strokeColor: "#e03131", strokeWidth: 2.5 }), poly(x, y, [[28, 26], [39, 26]], { strokeColor: c, strokeWidth: 2.5 }),
    ell(x + 9, y + 23, 6, 6, { strokeColor: c, backgroundColor: c, strokeWidth: 1 }), ell(x + 25, y + 23, 6, 6, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })],
  star: (x, y, c) => {
    const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 8 : 19; pts.push([20 + r * Math.cos(a), 21 + r * Math.sin(a)]); }
    return [poly(x, y, pts, { closed: true, strokeColor: c, backgroundColor: "#ffe066", strokeWidth: sw })];
  },
  robot: (x, y, c) => [rect(x + 5, y + 10, 30, 24, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), poly(x, y, [[20, 10], [20, 3]], { strokeColor: c, strokeWidth: 2 }),
    ell(x + 17, y, 6, 6, { strokeColor: c, backgroundColor: c, strokeWidth: 1 }), ell(x + 11, y + 17, 6, 6, { strokeColor: c, backgroundColor: c, strokeWidth: 1 }), ell(x + 23, y + 17, 6, 6, { strokeColor: c, backgroundColor: c, strokeWidth: 1 }),
    poly(x, y, [[14, 28], [26, 28]], { strokeColor: c, strokeWidth: 2 })],
  wrench: (x, y, c) => [poly(x, y, [[6, 34], [22, 18]], { strokeColor: c, strokeWidth: 5 }), ell(x + 18, y + 4, 18, 18, { strokeColor: c, backgroundColor: WHITE, strokeWidth: 3 })],
  layers: (x, y, c) => [26, 17, 8].map((d) => poly(x, y, [[20, d - 6], [38, d + 2], [20, d + 10], [2, d + 2]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw })),
  ranking: (x, y, c) => [[4, 10, 34], [4, 20, 24], [4, 30, 14]].map(([a, d, w]) => rect(x + a, y + d - 4, w, 7, { strokeColor: c, backgroundColor: d === 10 ? "#ffe066" : WHITE, strokeWidth: sw, roundness: null })),
};

// ---------- the component card ----------
// spec: { title, icon, theme, w?, h? }  returns { els, id }
export function comp(x, y, spec, gids = []) {
  const th = T[spec.theme];
  const lines = spec.title.split("\n").length;
  const g20 = (v) => Math.max(20, Math.round(v / 20) * 20);
  const w = g20(spec.w || 160), h = g20(spec.h || (lines > 1 ? 120 : 100));
  const g = nid("g"), id = spec.id || nid("c");
  const box = rect(x, y, w, h, {
    id, groupIds: [g, ...gids], strokeColor: th.stroke, backgroundColor: th.fill, strokeWidth: 2,
    label: { text: spec.title, fontSize: 16, verticalAlign: "bottom", strokeColor: INK },
  });
  const icon = ICONS[spec.icon](x + w / 2 - 20, y + 12, th.stroke, th.fill).map((e) => ({ ...e, groupIds: [g, ...gids] }));
  return { els: [box, ...icon], id, w, h };
}

// small text helper for captions
export const caption = (x, y, t, o = {}) => txt(x, y, t, { fontSize: 14, strokeColor: MUTED, ...o });

// ---------- v1.1 icons: devices + AI clients ----------
Object.assign(ICONS, {
  laptop: (x, y, c) => [rect(x + 6, y + 4, 28, 22, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }),
    poly(x, y, [[1, 29], [39, 29], [36, 35], [4, 35]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw })],
  tablet: (x, y, c) => [rect(x + 7, y + 2, 26, 36, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), ell(x + 18.5, y + 32, 3, 3, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })],
  tv: (x, y, c) => [rect(x + 1, y + 4, 38, 25, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }),
    poly(x, y, [[20, 29], [20, 35]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[12, 36], [28, 36]], { strokeColor: c, strokeWidth: 2 })],
  watch: (x, y, c) => [rect(x + 14, y, 12, 40, { strokeColor: c, backgroundColor: "#dee2e6", strokeWidth: 1, roundness: null }),
    rect(x + 8, y + 8, 24, 24, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), poly(x, y, [[20, 13], [20, 20], [25, 23]], { strokeColor: c, strokeWidth: 1.5 })],
  speaker: (x, y, c) => [rect(x + 10, y + 2, 20, 36, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    ell(x + 13, y + 16, 14, 14, { strokeColor: c, backgroundColor: "#e7f5ff", strokeWidth: sw }), ell(x + 17.5, y + 6, 5, 5, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })],
  car: (x, y, c) => [poly(x, y, [[2, 28], [3, 20], [9, 18], [13, 11], [27, 11], [32, 18], [38, 21], [38, 28]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[15, 13], [25, 13], [28, 18], [12, 18]], { closed: true, strokeColor: c, backgroundColor: "#d0ebff", strokeWidth: 1 }),
    ell(x + 6, y + 23, 10, 10, { strokeColor: c, backgroundColor: c, strokeWidth: 1 }), ell(x + 25, y + 23, 10, 10, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })],
  kiosk: (x, y, c) => [rect(x + 7, y + 1, 26, 24, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), rect(x + 11, y + 5, 18, 12, { strokeColor: c, backgroundColor: "#d0ebff", strokeWidth: 1, roundness: null }),
    poly(x, y, [[15, 25], [25, 25], [27, 38], [13, 38]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw })],
  sdk: (x, y, c) => [rect(x + 1, y + 4, 38, 32, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), txt(x + 7, y + 9, "{ }", { fontSize: 18, strokeColor: c, fontFamily: 3 })],
  mic: (x, y, c) => [rect(x + 14, y + 1, 12, 23, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: { type: 3 } }),
    poly(x, y, [[8, 15], [9, 23], [14, 28], [20, 29], [26, 28], [31, 23], [32, 15]], { strokeColor: c, strokeWidth: 2, roundness: { type: 2 } }),
    poly(x, y, [[20, 29], [20, 36]], { strokeColor: c, strokeWidth: 2 }), poly(x, y, [[13, 37], [27, 37]], { strokeColor: c, strokeWidth: 2 })],
  plug: (x, y, c) => [poly(x, y, [[15, 2], [15, 12]], { strokeColor: c, strokeWidth: 2.5 }), poly(x, y, [[25, 2], [25, 12]], { strokeColor: c, strokeWidth: 2.5 }),
    rect(x + 9, y + 12, 22, 14, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), poly(x, y, [[20, 26], [20, 32], [24, 36], [32, 38]], { strokeColor: c, strokeWidth: 2.5, roundness: { type: 2 } })],
  code: (x, y, c) => [rect(x + 1, y + 4, 38, 32, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), txt(x + 6, y + 11, "</>", { fontSize: 15, strokeColor: c, fontFamily: 3 })],
  terminal: (x, y, c) => [rect(x + 1, y + 5, 38, 30, { strokeColor: c, backgroundColor: "#343a40", strokeWidth: sw }),
    poly(x, y, [[7, 13], [13, 19], [7, 25]], { strokeColor: WHITE, strokeWidth: 2 }), poly(x, y, [[16, 27], [27, 27]], { strokeColor: WHITE, strokeWidth: 2 })],
  aichat: (x, y, c) => [poly(x, y, [[2, 8], [32, 8], [32, 30], [14, 30], [7, 37], [8, 30], [2, 30]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    ...[10, 17, 24].map((d) => ell(x + d - 2, y + 18, 4, 4, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })),
    poly(x, y, [[33, 0], [35, 5], [40, 7], [35, 9], [33, 14], [31, 9], [26, 7], [31, 5]], { closed: true, strokeColor: c, backgroundColor: "#ffe066", strokeWidth: 1 })],
  browserbot: (x, y, c) => [rect(x, y + 3, 36, 28, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }), poly(x, y, [[0, 10], [36, 10]], { strokeColor: c, strokeWidth: sw }),
    poly(x, y, [[22, 16], [22, 36], [27, 31], [31, 39], [34, 37.5], [30, 30], [37, 30]], { closed: true, strokeColor: c, backgroundColor: "#ffe066", strokeWidth: 1.25 })],
  flow: (x, y, c) => [poly(x, y, [[8, 30], [20, 9]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[20, 9], [32, 30]], { strokeColor: c, strokeWidth: sw }), poly(x, y, [[8, 30], [32, 30]], { strokeColor: c, strokeWidth: sw }),
    ...[[8, 30], [20, 9], [32, 30]].map(([a, b], i) => ell(x + a - 6, y + b - 6, 12, 12, { strokeColor: c, backgroundColor: i === 1 ? "#ffe066" : WHITE, strokeWidth: sw }))],
});

// ---------- v1.2 icons: agentic ----------
Object.assign(ICONS, {
  wrench: (x, y, c) => [poly(x, y, [[27, 3], [21, 7], [20, 14], [23, 19], [30, 20], [36, 17], [38, 11]], { strokeColor: c, strokeWidth: 4, roundness: { type: 2 } }),
    poly(x, y, [[23, 17], [5, 35]], { strokeColor: c, strokeWidth: 5 })],
  checklist: (x, y, c) => [rect(x + 4, y + 1, 32, 38, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    ...[10, 20, 30].flatMap((d, i) => [poly(x, y, [[9, d], [11.5, d + 3], [15, d - 3]], { strokeColor: i < 2 ? "#2f9e44" : "#ced4da", strokeWidth: 2 }), poly(x, y, [[19, d], [31, d]], { strokeColor: c, strokeWidth: 1.5 })])],
  scales: (x, y, c) => [poly(x, y, [[20, 3], [20, 35]], { strokeColor: c, strokeWidth: 2 }), poly(x, y, [[12, 37], [28, 37]], { strokeColor: c, strokeWidth: 2.5 }), poly(x, y, [[5, 9], [35, 9]], { strokeColor: c, strokeWidth: 2 }),
    poly(x, y, [[1, 22], [5, 10], [9, 22]], { strokeColor: c, strokeWidth: 1 }), poly(x, y, [[31, 22], [35, 10], [39, 22]], { strokeColor: c, strokeWidth: 1 }),
    poly(x, y, [[0, 22], [10, 22], [8, 26], [2, 26]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: 1.5 }), poly(x, y, [[30, 22], [40, 22], [38, 26], [32, 26]], { closed: true, strokeColor: c, backgroundColor: WHITE, strokeWidth: 1.5 })],
  picture: (x, y, c) => [rect(x + 1, y + 5, 38, 30, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    poly(x, y, [[5, 31], [15, 17], [22, 25], [27, 20], [35, 31]], { closed: true, strokeColor: c, backgroundColor: "#fcc2d7", strokeWidth: 1 }), ell(x + 26, y + 9, 7, 7, { strokeColor: c, backgroundColor: "#ffe066", strokeWidth: 1 })],
  grid: (x, y, c) => [[3, 3], [22, 3], [3, 22], [22, 22]].map(([a, b], i) => rect(x + a, y + b, 15, 15, { strokeColor: c, backgroundColor: i === 0 ? "#ffe066" : WHITE, strokeWidth: sw })),
  check: (x, y, c) => [ell(x + 1, y + 1, 38, 38, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }), poly(x, y, [[11, 20], [17, 27], [29, 13]], { strokeColor: "#2f9e44", strokeWidth: 3.5 })],
  sliders: (x, y, c) => [[10, 14], [20, 28], [30, 9]].flatMap(([a, k]) => [poly(x, y, [[a, 3], [a, 37]], { strokeColor: c, strokeWidth: 2 }), rect(x + a - 4, y + k, 8, 8, { strokeColor: c, backgroundColor: WHITE, strokeWidth: 1.5 })]),
  redact: (x, y, c) => [rect(x + 4, y + 1, 32, 38, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw }),
    ...[[9, 9, 22], [9, 17, 14], [9, 25, 20], [9, 32, 10]].map(([a, b, w], i) => rect(x + a, y + b - 2, w, 5, { strokeColor: i % 2 ? "#343a40" : c, backgroundColor: i % 2 ? "#343a40" : WHITE, strokeWidth: 1, roundness: null }))],
  memchip: (x, y, c) => [rect(x + 1, y + 10, 38, 18, { strokeColor: c, backgroundColor: WHITE, strokeWidth: sw, roundness: null }),
    ...[5, 15, 25].map((a) => rect(x + a, y + 14, 8, 9, { strokeColor: c, backgroundColor: "#eebefa", strokeWidth: 1, roundness: null })),
    ...[4, 9, 14, 19, 24, 29, 34].map((a) => poly(x, y, [[a + 1, 28], [a + 1, 33]], { strokeColor: c, strokeWidth: 1.5 }))],
});

// ---------- v1.4 icons: one distinct icon per concept ----------
const P = (x, y, pts, c, w = 1.5, o = {}) => poly(x, y, pts, { strokeColor: c, strokeWidth: w, ...o });
const PC = (x, y, pts, c, fill = WHITE, w = 1.5, o = {}) => poly(x, y, pts, { closed: true, strokeColor: c, backgroundColor: fill, strokeWidth: w, ...o });
const E = (x, y, w, h, c, fill = WHITE, sw2 = 1.5) => ell(x, y, w, h, { strokeColor: c, backgroundColor: fill, strokeWidth: sw2 });
const R = (x, y, w, h, c, fill = WHITE, sw2 = 1.5, round = true) => rect(x, y, w, h, { strokeColor: c, backgroundColor: fill, strokeWidth: sw2, roundness: round ? { type: 3 } : null });
const T2 = (x, y, s, c, size = 11, fam = 3) => txt(x, y, s, { fontSize: size, strokeColor: c, fontFamily: fam });
const miniDb = (x, y, c, w = 24, h = 26, fill = WHITE) => [E(x, y + h - 7, w, 7, c, fill), rect(x, y + 3.5, w, h - 7, { strokeColor: "transparent", backgroundColor: fill, strokeWidth: 0, roundness: null }),
  P(x, y, [[0, 3.5], [0, h - 3.5]], c), P(x, y, [[w, 3.5], [w, h - 3.5]], c), E(x, y, w, 7, c, fill)];
Object.assign(ICONS, {
  admin: (x, y, c) => [...ICONS.user(x - 4, y, c), ...ICONS.gear(x + 21, y + 21, c).map((e) => ({ ...e, x: x + 21 + (e.x - x - 21) * 0.45, y: y + 21 + (e.y - y - 21) * 0.45, ...(e.points ? { points: e.points.map(([a, b]) => [a * 0.45, b * 0.45]) } : { width: e.width * 0.45, height: e.height * 0.45 }) }))],
  spider: (x, y, c) => [E(x + 14, y + 13, 12, 14, c, c), ...[[-1, 1], [1, 1]].flatMap(([s]) => [6, 13, 20, 27].map((d, i) => P(x, y, [[20 + s * 5, y * 0 + d + 2], [20 + s * 13, d - 4 + i * 2], [20 + s * 18, d + 4]], c, 1.4)))],
  table: (x, y, c) => [R(x + 2, y + 5, 36, 30, c, WHITE, 1.5, false), rect(x + 2, y + 5, 36, 8, { strokeColor: c, backgroundColor: c, strokeWidth: 1, roundness: null }), P(x, y, [[2, 22], [38, 22]], c, 1), P(x, y, [[14, 13], [14, 35]], c, 1), P(x, y, [[26, 13], [26, 35]], c, 1)],
  dbpg: (x, y, c) => [...miniDb(x + 6, y + 4, c, 28, 32), T2(x + 13.5, y + 16, "PG", c, 11)],
  dbmy: (x, y, c) => [...miniDb(x + 6, y + 4, c, 28, 32), T2(x + 13.5, y + 16, "My", c, 11)],
  dbprimary: (x, y, c) => [...miniDb(x + 4, y + 8, c, 26, 30), PC(x, y, [[33, 1], [35.2, 5.8], [40, 6.4], [36.5, 9.8], [37.4, 14.6], [33, 12.3], [28.6, 14.6], [29.5, 9.8], [26, 6.4], [30.8, 5.8]], c, "#ffe066", 1.2)],
  dbreplica: (x, y, c) => [...miniDb(x + 12, y + 2, c, 24, 24, "#ebfbee"), ...miniDb(x + 3, y + 13, c, 24, 25)],
  dbshard: (x, y, c) => [...miniDb(x + 1, y + 10, c, 16, 22), ...miniDb(x + 23, y + 10, c, 16, 22), P(x, y, [[20, 2], [20, 38]], c, 1.5, { strokeStyle: "dashed" })],
  docdb: (x, y, c) => [...ICONS.doc(x, y, c).slice(0, 2), T2(x + 11, y + 17, "{}", c, 13)],
  columns: (x, y, c) => [R(x + 2, y + 4, 36, 32, c, WHITE, 1.5, false), ...[11, 20, 29].map((a) => P(x, y, [[a, 4], [a, 36]], c, 1)), rect(x + 2, y + 4, 9, 32, { strokeColor: c, backgroundColor: "#d3f9d8", strokeWidth: 1, roundness: null })],
  kv: (x, y, c) => [R(x + 1, y + 13, 14, 14, c, "#ffe066"), R(x + 25, y + 13, 14, 14, c), P(x, y, [[15, 20], [25, 20]], c, 2), P(x, y, [[21, 16.5], [25, 20], [21, 23.5]], c, 2)],
  cachekv: (x, y, c) => [R(x + 2, y + 6, 26, 28, c), ...[14, 21, 28].map((d) => P(x, y, [[7, d], [23, d]], c, 1)), PC(x, y, [[33, 4], [26, 21], [32, 21], [29, 36], [39, 16], [33, 16]], c, "#ffe066", 1.4)],
  ram: (x, y, c) => ICONS.memchip(x, y, c),
  cachelocal: (x, y, c) => [R(x + 2, y + 8, 30, 24, c, WHITE, 1.5, false), P(x, y, [[2, 16], [32, 16]], c, 1), PC(x, y, [[32, 6], [24, 22], [30, 22], [27, 36], [38, 18], [32, 18]], c, "#ffe066", 1.4)],
  ticket: (x, y, c) => [PC(x, y, [[2, 10], [38, 10], [38, 17], [35, 20], [38, 23], [38, 30], [2, 30], [2, 23], [5, 20], [2, 17]], c), P(x, y, [[13, 10], [13, 30]], c, 1, { strokeStyle: "dashed" }), P(x, y, [[18, 17], [32, 17]], c, 1), P(x, y, [[18, 23], [28, 23]], c, 1)],
  exchange: (x, y, c) => [R(x + 1, y + 15, 16, 10, c, WHITE, 1.5, false), ...[6, 20, 34].map((d) => P(x, y, [[17, 20], [28, d], [38, d]], c, 1.4)), ...[6, 20, 34].map((d) => P(x, y, [[35, d - 3], [38, d], [35, d + 3]], c, 1.4))],
  queuecloud: (x, y, c) => [PC(x, y, [[9, 17], [5, 13], [7, 8], [12, 6], [16, 2], [23, 2], [27, 6], [33, 7], [35, 12], [31, 17]], c, WHITE, 1.4, { roundness: { type: 2 } }), R(x + 2, y + 22, 36, 13, c, WHITE, 1.5, false), ...[11, 20, 29].map((d) => P(x, y, [[d, 22], [d, 35]], c, 1))],
  queuedead: (x, y, c) => [...ICONS.queue(x, y, c).slice(0, 4), ell(x + 24, y + 22, 16, 16, { strokeColor: "#e03131", backgroundColor: WHITE, strokeWidth: 1.5 }), P(x, y, [[28, 26], [36, 34]], "#e03131", 2), P(x, y, [[36, 26], [28, 34]], "#e03131", 2)],
  cdc: (x, y, c) => [...miniDb(x + 1, y + 7, c, 20, 26), P(x, y, [[24, 20], [38, 20]], c, 2), P(x, y, [[33, 15], [38, 20], [33, 25]], c, 2), ...[27, 32].map((a) => E(x + a, y + 8, 3, 3, c, c, 1))],
  chip: (x, y, c) => [R(x + 10, y + 10, 20, 20, c, WHITE, 1.5, false), R(x + 15, y + 15, 10, 10, c, c, 1, false), ...[14, 20, 26].flatMap((d) => [P(x, y, [[d, 4], [d, 10]], c), P(x, y, [[d, 30], [d, 36]], c), P(x, y, [[4, d], [10, d]], c), P(x, y, [[30, d], [36, d]], c)])],
  embed: (x, y, c) => [T2(x + 1, y + 11, "Aa", c, 13, 2), P(x, y, [[18, 20], [25, 20]], c, 1.6), P(x, y, [[22, 17], [25, 20], [22, 23]], c, 1.6), ...[[30, 10], [36, 16], [30, 24], [36, 30]].map(([a, b]) => E(x + a - 2.5, y + b - 2.5, 5, 5, c, c, 1))],
  gpu: (x, y, c) => [R(x + 1, y + 9, 38, 22, c, WHITE, 1.5, false), E(x + 6, y + 13, 14, 14, c), E(x + 22, y + 13, 14, 14, c), P(x, y, [[13, 13], [13, 27]], c, 1), P(x, y, [[29, 13], [29, 27]], c, 1), ...[8, 14, 20, 26, 32].map((a) => P(x, y, [[a, 31], [a, 36]], c, 1.4))],
  eye: (x, y, c) => [PC(x, y, [[1, 20], [8, 12], [20, 8], [32, 12], [39, 20], [32, 28], [20, 32], [8, 28]], c, WHITE, 1.5, { roundness: { type: 2 } }), E(x + 13, y + 13, 14, 14, c, "#a5d8ff"), E(x + 17.5, y + 17.5, 5, 5, c, c, 1)],
  imagegen: (x, y, c) => [...ICONS.picture(x, y + 3, c).slice(0, 2), PC(x, y, [[33, 0], [35, 5], [40, 7], [35, 9], [33, 14], [31, 9], [26, 7], [31, 5]], c, "#ffe066", 1.2)],
  robotcrown: (x, y, c) => [...ICONS.robot(x, y + 4, c).filter((e, i) => i !== 1 && i !== 2), PC(x, y, [[12, 9], [12, 1], [17, 5], [20, 0], [23, 5], [28, 1], [28, 9]], c, "#ffe066", 1.3)],
  robots: (x, y, c) => [R(x + 1, y + 14, 17, 15, c), R(x + 22, y + 14, 17, 15, c), ...[[5, 19], [11, 19], [26, 19], [32, 19]].map(([a, b]) => E(x + a, y + b, 3.5, 3.5, c, c, 1)), P(x, y, [[9.5, 14], [9.5, 9]], c), P(x, y, [[30.5, 14], [30.5, 9]], c), E(x + 8, y + 6, 3.5, 3.5, c, c, 1), E(x + 29, y + 6, 3.5, 3.5, c, c, 1), P(x, y, [[6, 25], [13, 25]], c, 1.4), P(x, y, [[27, 25], [34, 25]], c, 1.4)],
  a2a: (x, y, c) => [R(x + 1, y + 12, 13, 13, c), R(x + 26, y + 12, 13, 13, c), ...[[4, 17], [8.5, 17], [29, 17], [33.5, 17]].map(([a, b]) => E(x + a, y + b, 3, 3, c, c, 1)), P(x, y, [[15, 15], [25, 15]], c, 1.5), P(x, y, [[22, 12.5], [25, 15], [22, 17.5]], c, 1.5), P(x, y, [[25, 22], [15, 22]], c, 1.5), P(x, y, [[18, 19.5], [15, 22], [18, 24.5]], c, 1.5)],
  brain: (x, y, c) => [PC(x, y, [[20, 5], [13, 4], [7, 8], [4, 15], [5, 23], [9, 30], [16, 34], [20, 33], [24, 34], [31, 30], [35, 23], [36, 15], [33, 8], [27, 4]], c, "#f3d9fa", 1.5, { roundness: { type: 2 } }), P(x, y, [[20, 5], [20, 33]], c, 1.2), P(x, y, [[11, 13], [16, 16], [12, 22]], c, 1.1, { roundness: { type: 2 } }), P(x, y, [[29, 13], [24, 17], [29, 23]], c, 1.1, { roundness: { type: 2 } })],
  disk: (x, y, c) => [PC(x, y, [[3, 3], [31, 3], [37, 9], [37, 37], [3, 37]], c), R(x + 10, y + 3, 16, 10, c, WHITE, 1.2, false), R(x + 9, y + 22, 22, 15, c, "#e9ecef", 1.2, false), P(x, y, [[21, 5], [21, 11]], c, 2)],
  folder: (x, y, c) => [PC(x, y, [[2, 9], [14, 9], [18, 13], [38, 13], [38, 34], [2, 34]], c, "#fff3bf"), P(x, y, [[2, 17], [38, 17]], c, 1)],
  context: (x, y, c) => [T2(x - 1, y + 7, "[", c, 24, 2), T2(x + 31, y + 7, "]", c, 24, 2), ...[[9, 22], [9, 16], [9, 10]].map(([a, b]) => R(x + a, y + b, 22, 5, c, b === 10 ? "#d8f5a2" : WHITE, 1.2, false))],
  textaa: (x, y, c) => [R(x + 1, y + 6, 38, 28, c), T2(x + 7, y + 11, "Aa", c, 16, 2)],
  merge: (x, y, c) => [P(x, y, [[2, 8], [16, 8], [24, 20], [38, 20]], c, 2, { roundness: { type: 2 } }), P(x, y, [[2, 32], [16, 32], [24, 20]], c, 2, { roundness: { type: 2 } }), P(x, y, [[33, 15], [38, 20], [33, 25]], c, 2), E(x - 1, y + 5, 6, 6, c, c, 1), E(x - 1, y + 29, 6, 6, c, c, 1)],
  target: (x, y, c) => [E(x + 2, y + 2, 36, 36, c), E(x + 9, y + 9, 22, 22, c, "#ffc9c9"), E(x + 16, y + 16, 8, 8, c, "#e03131", 1), P(x, y, [[30, 10], [38, 2]], c, 2), P(x, y, [[33, 2], [38, 2], [38, 7]], c, 1.6)],
  idcard: (x, y, c) => [R(x + 1, y + 7, 38, 26, c), E(x + 6, y + 13, 10, 10, c, "#d0bfff", 1.2), P(x, y, [[5, 29], [17, 29]], c, 1.2), P(x, y, [[21, 15], [34, 15]], c, 1.2), P(x, y, [[21, 21], [34, 21]], c, 1.2), P(x, y, [[21, 27], [29, 27]], c, 1.2)],
  siren: (x, y, c) => [PC(x, y, [[10, 30], [10, 18], [13, 11], [20, 8], [27, 11], [30, 18], [30, 30]], c, "#ffc9c9", 1.5, { roundness: { type: 2 } }), R(x + 6, y + 30, 28, 6, c, WHITE, 1.4, false), P(x, y, [[20, 1], [20, 4]], c, 1.6), P(x, y, [[6, 6], [8.5, 8.5]], c, 1.6), P(x, y, [[34, 6], [31.5, 8.5]], c, 1.6)],
  invindex: (x, y, c) => [...[8, 15, 22, 29].flatMap((d) => [R(x + 1, y + d - 2, 4, 4, c, c, 1, false), P(x, y, [[8, d], [22, d]], c, 1.2)]), E(x + 21, y + 17, 13, 13, c, WHITE, 1.8), P(x, y, [[32, 28], [38, 34]], c, 2.4)],
  lbai: (x, y, c) => [...ICONS.lb(x, y, c), PC(x, y, [[33, 0], [34.8, 4.2], [39, 6], [34.8, 7.8], [33, 12], [31.2, 7.8], [27, 6], [31.2, 4.2]], c, "#ffe066", 1.1)],
  fallback: (x, y, c) => [P(x, y, [[2, 20], [14, 20]], c, 2), P(x, y, [[14, 20], [20, 8], [32, 8]], "#868e96", 1.6, { strokeStyle: "dashed" }), P(x, y, [[14, 20], [20, 32], [36, 32]], c, 2), P(x, y, [[31, 27], [36, 32], [31, 37]], c, 2), E(x + 30, y + 4, 8, 8, "#e03131", "#ffc9c9", 1.2)],
  webhook: (x, y, c) => [P(x, y, [[20, 4], [20, 22], [16, 28], [10, 28], [6, 24], [8, 19]], c, 2.4, { roundness: { type: 2 } }), E(x + 16, y + 1, 8, 8, c, WHITE, 1.6), P(x, y, [[24, 30], [36, 30]], c, 1.8), P(x, y, [[32, 26], [36, 30], [32, 34]], c, 1.8)],
  tasks: (x, y, c) => [...[6, 15, 24].map((d, i) => R(x + 2, y + d, 28, 7, c, i === 0 ? "#eebefa" : WHITE, 1.3, false)), P(x, y, [[30, 27.5], [38, 27.5]], c, 1.6), P(x, y, [[35, 24.5], [38, 27.5], [35, 30.5]], c, 1.6), E(x + 30, y + 3, 9, 9, c, c, 1)],
  calendar: (x, y, c) => [R(x + 2, y + 6, 36, 31, c), rect(x + 2, y + 6, 36, 8, { strokeColor: c, backgroundColor: c, strokeWidth: 1, roundness: null }), P(x, y, [[11, 2], [11, 9]], c, 2), P(x, y, [[29, 2], [29, 9]], c, 2), ...[[8, 19], [17, 19], [26, 19], [8, 27], [17, 27]].map(([a, b]) => R(x + a, y + b, 6, 5, c, WHITE, 1, false)), R(x + 26, y + 27, 6, 5, c, "#e03131", 1, false)],
  sandbox: (x, y, c) => [PC(x, y, [[4, 10], [36, 10], [36, 36], [4, 36]], c), P(x, y, [[4, 10], [12, 3], [28, 3], [36, 10]], c, 1.4), T2(x + 9, y + 15, "</>", c, 13)],
  scissors: (x, y, c) => [E(x + 3, y + 24, 12, 12, c), E(x + 25, y + 24, 12, 12, c), P(x, y, [[13, 26], [30, 2]], c, 2), P(x, y, [[27, 26], [10, 2]], c, 2)],
  parse: (x, y, c) => [...ICONS.doc(x - 5, y, c).slice(0, 2), P(x, y, [[22, 20], [30, 20]], c, 1.6), P(x, y, [[27, 17], [30, 20], [27, 23]], c, 1.6), ...[12, 20, 28].map((d) => R(x + 32, y + d - 2.5, 7, 5, c, d === 12 ? "#d8f5a2" : WHITE, 1, false))],
  learncurve: (x, y, c) => [P(x, y, [[3, 3], [3, 37], [38, 37]], c, 1.5), P(x, y, [[6, 33], [12, 30], [17, 22], [23, 14], [30, 9], [37, 7]], "#e64980", 2.2, { roundness: { type: 2 } }), ...[[12, 30], [23, 14], [37, 7]].map(([a, b]) => E(x + a - 2.5, y + b - 2.5, 5, 5, c, WHITE, 1.2))],
  sortarrows: (x, y, c) => [...[[4, 9, 24], [4, 19, 17], [4, 29, 10]].map(([a, b, w]) => R(x + a, y + b - 3, w, 6, c, b === 9 ? "#ffe066" : WHITE, 1.2, false)), P(x, y, [[34, 30], [34, 6]], c, 1.8), P(x, y, [[30, 10], [34, 5], [38, 10]], c, 1.8)],
  spans: (x, y, c) => [...[[2, 8, 34], [7, 17, 18], [12, 26, 10], [26, 26, 12]].map(([a, d, w], i) => R(x + a, y + d - 3, w, 6, c, i === 0 ? "#bac8ff" : WHITE, 1.3, false)), PC(x, y, [[34, 0], [35.6, 3.6], [39, 5], [35.6, 6.4], [34, 10], [32.4, 6.4], [29, 5], [32.4, 3.6]], c, "#ffe066", 1.1)],
  coins: (x, y, c) => [...[30, 24, 18].map((d) => E(x + 3, y + d, 22, 8, c, "#ffe066", 1.3)), E(x + 22, y + 6, 16, 16, c, WHITE, 1.4), T2(x + 26, y + 8, "#", c, 11)],
  policy: (x, y, c) => [...ICONS.doc(x - 3, y, c).slice(0, 2), ...[14, 20].map((d) => P(x, y, [[3, d], [17, d]], c, 1)), PC(x, y, [[30, 18], [39, 21], [38, 30], [30, 38], [22, 30], [21, 21]], c, "#bac8ff", 1.3)],
  leader: (x, y, c) => [P(x, y, [[20, 10], [7, 31]], c, 1.2), P(x, y, [[20, 10], [33, 31]], c, 1.2), P(x, y, [[7, 31], [33, 31]], c, 1.2), E(x + 13, y + 3, 14, 14, c, "#ffe066"), E(x + 1, y + 25, 12, 12, c), E(x + 27, y + 25, 12, 12, c)],
  prompt: (x, y, c) => [R(x + 1, y + 5, 38, 30, c, WHITE, 1.5), P(x, y, [[7, 14], [12, 19], [7, 24]], c, 2), P(x, y, [[16, 25], [26, 25]], c, 2), P(x, y, [[1, 11], [39, 11]], c, 1)],
  files: (x, y, c) => [R(x + 12, y + 1, 24, 30, c, "#e9ecef", 1.2, false), R(x + 8, y + 5, 24, 30, c, "#f8f9fa", 1.2, false), ...ICONS.doc(x - 2, y + 2, c).slice(0, 2).map((e) => ({ ...e }))],
  conveyor: (x, y, c) => [E(x + 2, y + 24, 10, 10, c), E(x + 28, y + 24, 10, 10, c), P(x, y, [[7, 24], [33, 24]], c, 1.5), P(x, y, [[7, 34], [33, 34]], c, 1.5), ...[[6, 13], [16, 13], [26, 13]].map(([a, b], i) => R(x + a, y + b, 8, 8, c, i === 2 ? "#d8f5a2" : WHITE, 1.2, false)), P(x, y, [[30, 6], [36, 6]], c, 1.4)],
  hnsw: (x, y, c) => [...[[6, 34], [6, 22], [6, 10]].map(([a, b], i) => PC(x, y, [[a, b], [a + 28, b], [a + 32, b - 6], [a + 4, b - 6]], c, i === 0 ? WHITE : "#f4fce3", 1.1)), ...[[14, 31], [28, 31], [20, 19], [26, 7]].map(([a, b]) => E(x + a - 2, y + b - 2, 4, 4, c, c, 1)), P(x, y, [[14, 31], [20, 19], [26, 7]], c, 1, { strokeStyle: "dashed" })],
  map: (x, y, c) => [PC(x, y, [[2, 8], [14, 4], [26, 8], [38, 4], [38, 32], [26, 36], [14, 32], [2, 36]], c, "#ebfbee", 1.4), P(x, y, [[14, 4], [14, 32]], c, 1), P(x, y, [[26, 8], [26, 36]], c, 1), PC(x, y, [[20, 28], [15, 20], [15, 15], [20, 11], [25, 15], [25, 20]], "#c92a2a", "#fa5252", 1.2, { roundness: { type: 2 } })],
  bank: (x, y, c) => [PC(x, y, [[20, 2], [38, 12], [2, 12]], c), ...[7, 15, 23, 31].map((a) => R(x + a, y + 15, 3, 15, c, WHITE, 1.2, false)), R(x + 2, y + 32, 36, 5, c, WHITE, 1.4, false)],
  send: (x, y, c) => [PC(x, y, [[2, 18], [38, 3], [28, 37], [19, 23]], c), P(x, y, [[19, 23], [38, 3]], c, 1.2)],
  phonebell: (x, y, c) => [R(x + 3, y + 2, 18, 36, c), P(x, y, [[9, 33], [15, 33]], c, 1.4), PC(x, y, [[31, 9], [36, 12], [37, 20], [40, 23], [22, 23], [25, 20], [26, 12]], c, "#ffe066", 1.3, { roundness: { type: 2 } }), E(x + 29, y + 24, 4, 4, c, c, 1)],
});
Object.assign(ICONS, {
  quote: (x, y, c) => [R(x + 1, y + 4, 38, 26, c), PC(x, y, [[8, 30], [8, 37], [15, 30]], c, WHITE, 1.4), T2(x + 7, y + 3, "“”", c, 24, 2)],
  clipboard: (x, y, c) => [R(x + 6, y + 4, 28, 34, c), R(x + 14, y + 1, 12, 7, c, "#e9ecef", 1.3), P(x, y, [[12, 23], [17, 28], [28, 16]], "#2f9e44", 2.6)],
});

// ---------- v1.4 polish: break visual near-duplicates ----------
Object.assign(ICONS, {
  sensor: (x, y, c) => [E(x + 15, y + 22, 10, 10, c, c), ...[[9, 5], [4, 10]].flatMap(([r, w]) => [
    P(x, y, [[20 - r - 2, 22 - r + 2], [20 - r + 3, 22 - r - 3], [20, 22 - r - 4], [20 + r - 3, 22 - r - 3], [20 + r + 2, 22 - r + 2]], c, 1.8, { roundness: { type: 2 } })]),
    P(x, y, [[20, 32], [20, 38]], c, 2), P(x, y, [[13, 38], [27, 38]], c, 2)],
  waveform: (x, y, c) => [E(x + 2, y + 2, 36, 36, c, WHITE, 1.5), ...[[10, 6], [15, 12], [20, 18], [25, 12], [30, 6]].map(([a, h]) => P(x, y, [[a, 20 - h / 2], [a, 20 + h / 2]], c, 2.5))],
  stt: (x, y, c) => [R(x + 3, y + 3, 10, 18, c, WHITE, 1.8), P(x, y, [[0, 14], [2, 22], [8, 25], [14, 22], [16, 14]], c, 1.6, { roundness: { type: 2 } }), P(x, y, [[8, 25], [8, 31]], c, 1.6),
    P(x, y, [[19, 15], [24, 15]], c, 1.6), P(x, y, [[22, 12], [25, 15], [22, 18]], c, 1.6), R(x + 27, y + 6, 12, 18, c, WHITE, 1.2, false), P(x, y, [[30, 11], [36, 11]], c, 1), P(x, y, [[30, 15], [36, 15]], c, 1), P(x, y, [[30, 19], [34, 19]], c, 1)],
  tts: (x, y, c) => [T2(x - 1, y + 10, "Aa", c, 15, 2), P(x, y, [[19, 18], [23, 18]], c, 1.6), P(x, y, [[21, 15], [24, 18], [21, 21]], c, 1.6),
    PC(x, y, [[26, 14], [30, 14], [35, 9], [35, 27], [30, 22], [26, 22]], c, WHITE, 1.5), P(x, y, [[38, 13], [40, 18], [38, 23]], c, 1.4, { roundness: { type: 2 } })],
  smarttv: (x, y, c) => [R(x + 1, y + 7, 38, 25, c, WHITE, 2, false), P(x, y, [[13, 1], [20, 7], [27, 1]], c, 1.6), PC(x, y, [[16, 14], [26, 19.5], [16, 25]], c, c, 1), P(x, y, [[12, 36], [28, 36]], c, 2)],
  cicd2: (x, y, c) => [P(x, y, [[20, 20], [14, 12], [6, 11], [2, 20], [6, 29], [14, 28], [20, 20], [26, 12], [34, 11], [38, 20], [34, 29], [26, 28], [20, 20]], c, 2.2, { roundness: { type: 2 } }),
    P(x, y, [[30, 7], [34, 11], [30, 15]], c, 2)],
  conveyor2: (x, y, c) => [R(x, y + 26, 40, 10, c, WHITE, 1.6), E(x + 3, y + 28, 6, 6, c, c, 1), E(x + 31, y + 28, 6, 6, c, c, 1),
    R(x + 2, y + 12, 10, 12, c, WHITE, 1.4, false), R(x + 15, y + 12, 10, 12, c, WHITE, 1.4, false), R(x + 28, y + 12, 10, 12, c, "#d8f5a2", 1.4, false),
    P(x, y, [[4, 16], [10, 16]], c, 1), P(x, y, [[4, 19], [9, 19]], c, 1), ...[0, 3, 6].map((o) => E(x + 17 + o, y + 16, 2.2, 2.2, c, c, 0.5)), P(x, y, [[8, 5], [32, 5]], c, 1.6), P(x, y, [[28, 2], [32, 5], [28, 8]], c, 1.6)],
});
Object.assign(ICONS, {
  semcache: (x, y, c) => [PC(x, y, [[2, 4], [30, 4], [30, 24], [12, 24], [6, 30], [6, 24], [2, 24]], c, WHITE, 1.6),
    PC(x, y, [[22, 10], [15, 22], [21, 22], [18, 34], [28, 19], [22, 19], [26, 10]], c, "#ffec99", 1.4), P(x, y, [[34, 2], [34, 10]], c, 1.4), P(x, y, [[30, 6], [38, 6]], c, 1.4)],
});
Object.assign(ICONS, {
  tsdb: (x, y, c) => [...miniDb(x + 2, y + 4, c, 24, 32), P(x, y, [[22, 34], [28, 24], [33, 28], [39, 14]], c, 2), E(x + 37, y + 12, 4, 4, c, c, 1)],
  mcpserver: (x, y, c) => [R(x + 2, y + 18, 36, 9, c, WHITE, 1.5, false), R(x + 2, y + 29, 36, 9, c, WHITE, 1.5, false), E(x + 30, y + 21, 3, 3, c, c, 1), E(x + 30, y + 32, 3, 3, c, c, 1),
    P(x, y, [[15, 1], [15, 7]], c, 2.2), P(x, y, [[25, 1], [25, 7]], c, 2.2), R(x + 11, y + 7, 18, 8, c, WHITE, 1.5), P(x, y, [[20, 15], [20, 18]], c, 2)],
  kg: (x, y, c) => [P(x, y, [[8, 10], [30, 8], [20, 22], [8, 10]], c, 1.3), P(x, y, [[20, 22], [10, 34], [32, 32], [20, 22]], c, 1.3), P(x, y, [[30, 8], [32, 32]], c, 1.3),
    E(x + 3, y + 5, 10, 10, c, "#d8f5a2", 1.5), E(x + 25, y + 3, 10, 10, c, WHITE, 1.5), E(x + 15, y + 17, 10, 10, c, c, 1.5), E(x + 5, y + 29, 10, 10, c, WHITE, 1.5), E(x + 27, y + 27, 10, 10, c, "#d8f5a2", 1.5)],
  agentsvc: (x, y, c) => [...ICONS.robot(x - 3, y, c), R(x + 26, y + 24, 14, 14, c, WHITE, 1.2), P(x, y, [[29, 31], [32, 34], [37, 28]], c, 1.6)],
});
Object.assign(ICONS, {
  computeruse: (x, y, c) => [R(x + 1, y + 3, 36, 24, c, WHITE, 1.8, false), P(x, y, [[19, 27], [19, 33]], c, 1.8), P(x, y, [[11, 34], [27, 34]], c, 1.8),
    PC(x, y, [[22, 12], [22, 30], [26.5, 25.5], [30, 33], [33, 31.5], [29.5, 24.5], [35, 24]], c, "#ffd43b", 1.3), E(x + 6, y + 8, 5, 5, c, c, 1), P(x, y, [[6, 18], [16, 18]], c, 1.2)],
});
