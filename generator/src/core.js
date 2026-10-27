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
  const w = spec.w || 150, h = spec.h || (lines > 1 ? 112 : 96);
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
