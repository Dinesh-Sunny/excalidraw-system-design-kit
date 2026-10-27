import { rect, ell, txt, poly, INK, MUTED, ACCENT, WHITE } from "./core.js";

const LINE = "#ced4da", SOFT = "#f1f3f5", GRAY = "#e9ecef", DARK = "#343a40";
const t = (x, y, s, o = {}) => txt(x, y, s, { fontSize: 16, strokeColor: INK, ...o });
const R = (x, y, w, h, o = {}) => rect(x, y, w, h, { strokeColor: LINE, backgroundColor: WHITE, strokeWidth: 1.5, ...o });
const lbl = (x, y, w, h, s, o = {}, lo = {}) => R(x, y, w, h, { ...o, label: { text: s, fontSize: 16, strokeColor: INK, ...lo } });

export const img = (x, y, w, h) => [R(x, y, w, h, { backgroundColor: GRAY, roundness: { type: 3 } }),
  poly(x, y, [[w * 0.15, h * 0.8], [w * 0.4, h * 0.42], [w * 0.58, h * 0.65], [w * 0.7, h * 0.52], [w * 0.88, h * 0.8]], { closed: true, strokeColor: "#adb5bd", backgroundColor: "#ced4da", strokeWidth: 1.5 }),
  ell(x + w * 0.68, y + h * 0.18, Math.min(w, h) * 0.16, Math.min(w, h) * 0.16, { strokeColor: "#adb5bd", backgroundColor: "#dee2e6", strokeWidth: 1.5 })];
export const avatar = (x, y, d, fill = "#d0bfff", s = "AB") => [ell(x, y, d, d, { strokeColor: "#9775fa", backgroundColor: fill, strokeWidth: 1.5, label: d >= 50 ? { text: s, fontSize: Math.round(d * 0.36), strokeColor: "#5f3dc4" } : undefined })];
export const btn = (x, y, w, h, s, kind = "primary") => [lbl(x, y, w, h, s,
  kind === "primary" ? { backgroundColor: ACCENT, strokeColor: ACCENT } : kind === "danger" ? { backgroundColor: "#fa5252", strokeColor: "#fa5252" } : { backgroundColor: WHITE, strokeColor: ACCENT },
  { strokeColor: kind === "secondary" ? ACCENT : WHITE })];
export const input = (x, y, w, label, ph) => [...(label ? [t(x, y, label, { fontSize: 14, strokeColor: "#495057" })] : []),
  R(x, y + (label ? 22 : 0), w, 42, { strokeColor: "#adb5bd" }), t(x + 12, y + (label ? 22 : 0) + 11, ph, { fontSize: 16, strokeColor: MUTED })];
export const searchBar = (x, y, w, ph = "Search...") => [R(x, y, w, 40, { strokeColor: "#adb5bd", backgroundColor: SOFT }),
  ell(x + 12, y + 11, 13, 13, { strokeColor: "#495057", strokeWidth: 2, backgroundColor: "transparent" }), poly(x, y, [[23, 22], [29, 28]], { strokeColor: "#495057", strokeWidth: 2 }),
  t(x + 38, y + 10, ph, { strokeColor: MUTED })];
const chev = (x, y, c = MUTED) => poly(x, y, [[0, 0], [6, 6], [0, 12]], { strokeColor: c, strokeWidth: 2 });
const back = (x, y) => poly(x, y, [[8, 0], [0, 8], [8, 16]], { strokeColor: INK, strokeWidth: 2 });
const lines = (x, y, ws, gap = 14, h = 8) => ws.map((w, i) => R(x, y + i * gap, w, h, { backgroundColor: GRAY, strokeColor: GRAY }));
export const appBar = (x, y, w, title, backBtn = true) => [R(x, y, w, 52, { roundness: null, strokeColor: LINE }), ...(backBtn ? [back(x + 14, y + 18)] : []),
  t(x + (backBtn ? 38 : 16), y + 14, title, { fontSize: 20 }), ell(x + w - 34, y + 15, 20, 20, { strokeColor: "#495057", backgroundColor: WHITE, strokeWidth: 1.5 })];
export const tabBar = (x, y, w, tabs = ["Home", "Search", "Inbox", "Profile"]) => {
  const out = [R(x, y, w, 58, { roundness: null })]; const cw = w / tabs.length;
  tabs.forEach((s, i) => { const cx = x + cw * i + cw / 2; const on = i === 0;
    out.push(rect(cx - 10, y + 8, 20, 20, { strokeColor: on ? ACCENT : MUTED, backgroundColor: on ? "#dbe4ff" : WHITE, strokeWidth: 1.5 }),
      rect(cx - cw / 2 + 2, y + 31, cw - 4, 22, { strokeColor: "transparent", backgroundColor: "transparent", label: { text: s, fontSize: 12, strokeColor: on ? ACCENT : MUTED } })); });
  return out;
};
export const listItem = (x, y, w, title = "Title", sub = "Supporting text") => [R(x, y, w, 64, { roundness: null, strokeColor: GRAY }), ...avatar(x + 12, y + 12, 40),
  t(x + 64, y + 12, title, { fontSize: 16 }), t(x + 64, y + 34, sub, { fontSize: 13, strokeColor: MUTED }), chev(x + w - 22, y + 26)];
export const bubble = (x, y, w, s, mine) => [lbl(x, y, w, 40, s, { backgroundColor: mine ? ACCENT : SOFT, strokeColor: mine ? ACCENT : SOFT }, { strokeColor: mine ? WHITE : INK, fontSize: 15 })];
export const post = (x, y, w, h = 150) => [R(x, y, w, h + 104), ...avatar(x + 12, y + 12, 36, "#a5d8ff", "JD"), t(x + 56, y + 12, "Jane Doe", { fontSize: 15 }), t(x + 56, y + 31, "2h", { fontSize: 12, strokeColor: MUTED }),
  ...img(x + 12, y + 58, w - 24, h - 20), t(x + 12, y + h + 48, "Like   Comment   Share", { fontSize: 13, strokeColor: "#495057" }), ...lines(x + 12, y + h + 72, [w * 0.7], 12, 7)];
export const bars = (x, y, w, h) => { const hs = [0.4, 0.65, 0.5, 0.85, 0.7, 0.95]; const bw = (w - 20) / hs.length;
  return [poly(x, y, [[0, h], [w, h]], { strokeColor: "#adb5bd", strokeWidth: 1.5 }), ...hs.map((k, i) => rect(x + 10 + i * bw + 3, y + h - h * k, bw - 8, h * k, { strokeColor: ACCENT, backgroundColor: "#bac8ff", strokeWidth: 1, roundness: null }))]; };

// ---------- device frames ----------
export function phone(x = 0, y = 0) {
  return [rect(x, y, 300, 600, { strokeColor: INK, backgroundColor: WHITE, strokeWidth: 3 }), rect(x + 110, y + 12, 80, 22, { strokeColor: INK, backgroundColor: INK, strokeWidth: 1 }),
    t(x + 24, y + 13, "9:41", { fontSize: 14 }), rect(x + 252, y + 16, 24, 12, { strokeColor: INK, backgroundColor: "#69db7c", strokeWidth: 1.5, roundness: null }),
    poly(x, y, [[110, 586], [190, 586]], { strokeColor: INK, strokeWidth: 4 })];
}
export const PH = { x: 10, y: 44, w: 280, h: 530 }; // phone content box
export function browser(x = 0, y = 0, w = 760, h = 480, url = "https://app.example.com") {
  return [rect(x, y, w, h, { strokeColor: INK, backgroundColor: WHITE, strokeWidth: 2.5 }), rect(x, y, w, 44, { strokeColor: INK, backgroundColor: SOFT, strokeWidth: 2.5 }),
    ...[["#ff6b6b", 16], ["#fcc419", 34], ["#51cf66", 52]].map(([c, d]) => ell(x + d, y + 16, 12, 12, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })),
    R(x + 84, y + 9, w - 110, 26, { backgroundColor: WHITE }), t(x + 98, y + 13, url, { fontSize: 14, strokeColor: MUTED })];
}
export const tablet = () => [rect(0, 0, 560, 760, { strokeColor: INK, backgroundColor: WHITE, strokeWidth: 3 }), ell(274, 12, 12, 12, { strokeColor: INK, backgroundColor: INK, strokeWidth: 1 }),
  t(24, 30, "9:41", { fontSize: 14 }), poly(0, 0, [[230, 744], [330, 744]], { strokeColor: INK, strokeWidth: 4 })];
export const watch = () => [rect(40, 0, 100, 30, { strokeColor: INK, backgroundColor: GRAY, strokeWidth: 2 }), rect(40, 200, 100, 30, { strokeColor: INK, backgroundColor: GRAY, strokeWidth: 2 }),
  rect(10, 25, 160, 180, { strokeColor: INK, backgroundColor: INK, strokeWidth: 3 }), t(62, 80, "10:09", { fontSize: 28, strokeColor: WHITE }), rect(172, 90, 8, 30, { strokeColor: INK, backgroundColor: GRAY, strokeWidth: 1.5, roundness: null })];

// ---------- UI components (ui/) ----------
export const UI = [
  ["Button - primary cta", () => btn(0, 0, 150, 44, "Continue")],
  ["Button - secondary outline", () => btn(0, 0, 150, 44, "Cancel", "secondary")],
  ["Button - danger destructive", () => btn(0, 0, 150, 44, "Delete", "danger")],
  ["Text Input - field form label", () => input(0, 0, 260, "Email", "you@example.com")],
  ["Search Bar - search field", () => searchBar(0, 0, 280)],
  ["Dropdown - select menu", () => [R(0, 0, 220, 42, { strokeColor: "#adb5bd" }), t(12, 11, "Select option", { strokeColor: MUTED }), poly(0, 0, [[190, 17], [196, 23], [202, 17]], { strokeColor: "#495057", strokeWidth: 2 })]],
  ["Checkbox - tick option", () => [rect(0, 0, 22, 22, { strokeColor: ACCENT, backgroundColor: ACCENT, strokeWidth: 1.5 }), poly(0, 0, [[5, 11], [9, 16], [17, 6]], { strokeColor: WHITE, strokeWidth: 2.5 }), t(34, 1, "Remember me"),
    rect(0, 36, 22, 22, { strokeColor: "#adb5bd", backgroundColor: WHITE, strokeWidth: 1.5 }), t(34, 37, "Subscribe")]],
  ["Toggle Switch - on off setting", () => [t(0, 8, "Notifications"), rect(130, 4, 52, 30, { strokeColor: ACCENT, backgroundColor: ACCENT, strokeWidth: 1.5, roundness: { type: 3 } }), ell(154, 7, 24, 24, { strokeColor: WHITE, backgroundColor: WHITE, strokeWidth: 1 })]],
  ["Avatar - profile picture user", () => avatar(0, 0, 56)],
  ["Image Placeholder - photo media", () => img(0, 0, 200, 130)],
  ["Card - content tile", () => [R(0, 0, 240, 250), ...img(12, 12, 216, 120), t(12, 144, "Card title", { fontSize: 18 }), ...lines(12, 174, [200, 150]), ...btn(12, 200, 100, 36, "Open")]],
  ["List Item - row avatar title", () => listItem(0, 0, 300)],
  ["Top App Bar - header navbar", () => appBar(0, 0, 300, "Title")],
  ["Bottom Tab Bar - mobile navigation", () => tabBar(0, 0, 300)],
  ["Sidebar Navigation - side menu", () => [R(0, 0, 200, 360, { backgroundColor: SOFT }), t(18, 16, "Workspace", { fontSize: 18 }),
    ...["Dashboard", "Projects", "Messages", "Reports", "Settings"].flatMap((s, i) => [rect(10, 56 + i * 44, 180, 36, { strokeColor: i === 0 ? "#dbe4ff" : "transparent", backgroundColor: i === 0 ? "#dbe4ff" : "transparent", strokeWidth: 1 }),
      rect(22, 66 + i * 44, 16, 16, { strokeColor: i === 0 ? ACCENT : MUTED, backgroundColor: WHITE, strokeWidth: 1.5 }), t(48, 64 + i * 44, s, { strokeColor: i === 0 ? ACCENT : "#495057" })])]],
  ["Tabs - segmented control", () => [R(0, 0, 300, 40, { backgroundColor: SOFT }), lbl(4, 4, 96, 32, "Overview", { backgroundColor: WHITE, strokeColor: WHITE }, { fontSize: 14 }),
    rect(100, 4, 96, 32, { strokeColor: "transparent", backgroundColor: "transparent", label: { text: "Activity", fontSize: 14, strokeColor: MUTED } }), rect(196, 4, 100, 32, { strokeColor: "transparent", backgroundColor: "transparent", label: { text: "Settings", fontSize: 14, strokeColor: MUTED } })]],
  ["Modal Dialog - popup confirm", () => [rect(8, 8, 320, 190, { strokeColor: GRAY, backgroundColor: "#dee2e6", strokeWidth: 1 }), R(0, 0, 320, 190, { strokeColor: "#adb5bd" }), t(20, 18, "Delete project?", { fontSize: 20 }),
    t(20, 54, "This cannot be undone.", { fontSize: 15, strokeColor: "#495057" }), ...btn(70, 128, 110, 40, "Cancel", "secondary"), ...btn(192, 128, 110, 40, "Delete", "danger")]],
  ["Toast - snackbar alert message", () => [rect(0, 0, 280, 48, { strokeColor: DARK, backgroundColor: DARK, strokeWidth: 1, label: { text: "Saved successfully", fontSize: 15, strokeColor: WHITE } })]],
  ["Chips - tags badges filters", () => ["All", "Popular", "New", "Nearby"].map((s, i) => rect([0, 56, 140, 212][i], 0, [48, 76, 64, 78][i], 30, { strokeColor: i === 0 ? ACCENT : LINE, backgroundColor: i === 0 ? "#dbe4ff" : WHITE, strokeWidth: 1.5, label: { text: s, fontSize: 14, strokeColor: i === 0 ? ACCENT : "#495057" } }))],
  ["Chat Bubbles - messages conversation", () => [...bubble(0, 0, 180, "Hey! Are we still on?", false), ...bubble(100, 52, 180, "Yes, see you at 6", true), ...bubble(0, 104, 120, "Great!", false)]],
  ["Feed Post - social card", () => post(0, 0, 300)],
  ["Video Player - media playback", () => [rect(0, 0, 320, 190, { strokeColor: DARK, backgroundColor: DARK, strokeWidth: 1.5, roundness: null }), poly(0, 0, [[145, 70], [180, 95], [145, 120]], { closed: true, strokeColor: WHITE, backgroundColor: WHITE, strokeWidth: 1 }),
    rect(12, 166, 296, 5, { strokeColor: "#868e96", backgroundColor: "#868e96", strokeWidth: 1, roundness: null }), rect(12, 166, 110, 5, { strokeColor: "#fa5252", backgroundColor: "#fa5252", strokeWidth: 1, roundness: null }), ell(117, 163, 11, 11, { strokeColor: "#fa5252", backgroundColor: "#fa5252", strokeWidth: 1 })]],
  ["Map View - location pins route", () => [R(0, 0, 300, 220, { backgroundColor: "#ebfbee", strokeColor: "#b2f2bb", roundness: null }),
    poly(0, 0, [[0, 70], [300, 110]], { strokeColor: WHITE, strokeWidth: 8 }), poly(0, 0, [[120, 0], [160, 220]], { strokeColor: WHITE, strokeWidth: 8 }), poly(0, 0, [[0, 180], [300, 160]], { strokeColor: WHITE, strokeWidth: 6 }),
    poly(0, 0, [[70, 150], [140, 90], [230, 60]], { strokeColor: ACCENT, strokeWidth: 3 }), ell(62, 142, 16, 16, { strokeColor: WHITE, backgroundColor: ACCENT, strokeWidth: 2 }),
    poly(0, 0, [[230, 62], [221, 48], [220, 40], [224, 33], [230, 31], [236, 33], [240, 40], [239, 48]], { closed: true, strokeColor: "#c92a2a", backgroundColor: "#fa5252", strokeWidth: 1.5, roundness: { type: 2 } })]],
  ["Chart Widget - bar graph kpi", () => [R(0, 0, 300, 200), t(16, 14, "Weekly active users", { fontSize: 15, strokeColor: "#495057" }), t(16, 36, "12.4k", { fontSize: 24 }), ...bars(16, 76, 268, 108)]],
  ["KPI Stat Tile - metric number", () => [R(0, 0, 180, 100), t(16, 14, "Revenue", { fontSize: 14, strokeColor: MUTED }), t(16, 38, "£48.2k", { fontSize: 28 }), t(16, 74, "+12% vs last week", { fontSize: 13, strokeColor: "#2f9e44" })]],
  ["Data Table - grid rows columns", () => { const cols = [0, 120, 240], w = 360, out = [R(0, 0, w, 40 * 5, { roundness: null })];
    out.push(rect(0, 0, w, 40, { strokeColor: LINE, backgroundColor: SOFT, strokeWidth: 1.5, roundness: null }));
    ["Name", "Status", "Amount"].forEach((s, i) => out.push(t(cols[i] + 14, 10, s, { fontSize: 15 })));
    for (let r = 1; r < 5; r++) { out.push(poly(0, 0, [[0, r * 40], [w, r * 40]], { strokeColor: GRAY, strokeWidth: 1 }));
      out.push(...lines(14, r * 40 + 16, [80], 0, 8), rect(134, r * 40 + 10, 70, 22, { strokeColor: r % 2 ? "#b2f2bb" : "#ffec99", backgroundColor: r % 2 ? "#ebfbee" : "#fff9db", strokeWidth: 1, label: { text: r % 2 ? "Paid" : "Pending", fontSize: 12, strokeColor: r % 2 ? "#2b8a3e" : "#e67700" } }), ...lines(254, r * 40 + 16, [60], 0, 8)); }
    return out; }],
  ["Progress Bar - loading upload", () => [t(0, 0, "Uploading... 64%", { fontSize: 14, strokeColor: "#495057" }), rect(0, 24, 280, 10, { strokeColor: GRAY, backgroundColor: GRAY, strokeWidth: 1 }), rect(0, 24, 180, 10, { strokeColor: ACCENT, backgroundColor: ACCENT, strokeWidth: 1 })]],
  ["Skeleton Loader - loading placeholder shimmer", () => [ell(0, 0, 44, 44, { strokeColor: GRAY, backgroundColor: GRAY, strokeWidth: 1 }), ...lines(58, 6, [180, 120], 18, 10), ...lines(0, 64, [260, 260, 200], 18, 10)]],
  ["Empty State - no results zero data", () => [R(0, 0, 260, 200, { strokeStyle: "dashed", strokeColor: "#adb5bd" }), ell(105, 24, 50, 50, { strokeColor: "#adb5bd", backgroundColor: SOFT, strokeWidth: 1.5 }),
    rect(10, 88, 240, 24, { strokeColor: "transparent", backgroundColor: "transparent", label: { text: "No messages yet", fontSize: 17, strokeColor: INK } }), ...btn(70, 134, 120, 38, "Start chat")]],
  ["Login Form - sign in auth", () => [R(0, 0, 300, 300), t(24, 20, "Sign in", { fontSize: 22 }), ...input(24, 60, 252, "Email", "you@example.com"), ...input(24, 132, 252, "Password", "********"), ...btn(24, 220, 252, 44, "Log in")]],
  ["UX Annotation - numbered callout note", () => [ell(0, 0, 30, 30, { strokeColor: "#e64980", backgroundColor: "#e64980", strokeWidth: 1, label: { text: "1", fontSize: 16, strokeColor: WHITE } }),
    rect(40, -6, 220, 44, { strokeColor: "#e64980", backgroundColor: "#fff0f6", strokeWidth: 1, label: { text: "Why this UX choice", fontSize: 15, strokeColor: "#a61e4d", textAlign: "left" } })]],
];

export const FRAMES = [
  ["Phone - iphone android mobile device", () => phone()],
  ["Tablet - ipad device", () => tablet()],
  ["Laptop - macbook notebook computer device", () => [rect(40, 0, 640, 410, { strokeColor: INK, backgroundColor: INK, strokeWidth: 3 }), rect(54, 14, 612, 382, { strokeColor: INK, backgroundColor: WHITE, strokeWidth: 1, roundness: null }),
    poly(0, 0, [[0, 420], [720, 420], [700, 444], [20, 444]], { closed: true, strokeColor: INK, backgroundColor: GRAY, strokeWidth: 3 }), rect(310, 420, 100, 8, { strokeColor: INK, backgroundColor: "#adb5bd", strokeWidth: 1 })]],
  ["Browser Window - web page desktop", () => browser()],
  ["Desktop App Window - mac windows app", () => [rect(0, 0, 720, 460, { strokeColor: INK, backgroundColor: WHITE, strokeWidth: 2.5 }), rect(0, 0, 720, 36, { strokeColor: INK, backgroundColor: SOFT, strokeWidth: 2.5 }),
    ...[["#ff6b6b", 14], ["#fcc419", 32], ["#51cf66", 50]].map(([c, d]) => ell(d, 12, 12, 12, { strokeColor: c, backgroundColor: c, strokeWidth: 1 })), t(320, 8, "App name", { fontSize: 15, strokeColor: "#495057" })]],
  ["Smartwatch - wearable", () => watch()],
];

// ---------- full screens (screen/) ----------
const P0 = (els) => [...phone(), ...els];
export const SCREENS = [
  ["Login - sign in onboarding mobile", () => P0([ell(120, 90, 60, 60, { strokeColor: ACCENT, backgroundColor: "#dbe4ff", strokeWidth: 2 }),
    rect(20, 166, 260, 34, { strokeColor: "transparent", backgroundColor: "transparent", label: { text: "Welcome back", fontSize: 26, strokeColor: INK } }),
    ...input(28, 222, 244, "Email", "you@example.com"), ...input(28, 296, 244, "Password", "********"), t(172, 366, "Forgot password?", { fontSize: 13, strokeColor: ACCENT }),
    ...btn(28, 396, 244, 46, "Log in"), t(140, 456, "or", { fontSize: 14, strokeColor: MUTED }), ...btn(28, 482, 244, 46, "Continue with Google", "secondary")])],
  ["Social Feed - home timeline instagram twitter", () => P0([...appBar(PH.x, PH.y, PH.w, "Home", false),
    ...[0, 1, 2, 3, 4].flatMap((i) => [ell(PH.x + 12 + i * 54, PH.y + 62, 44, 44, { strokeColor: "#f76707", backgroundColor: ["#ffd8a8", "#d0bfff", "#a5d8ff", "#b2f2bb", "#fcc2d7"][i], strokeWidth: 2.5 })]),
    ...post(PH.x + 8, PH.y + 120, PH.w - 16, 140), ...tabBar(PH.x, PH.y + PH.h - 58, PH.w)])],
  ["Chat Conversation - messaging whatsapp dm", () => P0([R(PH.x, PH.y, PH.w, 56, { roundness: null }), back(PH.x + 12, PH.y + 20), ...avatar(PH.x + 34, PH.y + 9, 38, "#a5d8ff", "AL"),
    t(PH.x + 82, PH.y + 9, "Alex", { fontSize: 17 }), t(PH.x + 82, PH.y + 31, "online", { fontSize: 12, strokeColor: "#2f9e44" }),
    ...bubble(PH.x + 10, PH.y + 76, 190, "Hey! Are we still on?", false), ...bubble(PH.x + 80, PH.y + 126, 190, "Yes, see you at 6", true), ...bubble(PH.x + 10, PH.y + 176, 150, "Bring the slides", false),
    ...bubble(PH.x + 130, PH.y + 226, 140, "Will do", true), t(PH.x + 222, PH.y + 270, "Read 18:02", { fontSize: 11, strokeColor: MUTED }),
    R(PH.x, PH.y + PH.h - 60, PH.w, 60, { roundness: null }), R(PH.x + 10, PH.y + PH.h - 50, 210, 40, { backgroundColor: SOFT }), t(PH.x + 24, PH.y + PH.h - 40, "Message", { strokeColor: MUTED }),
    ell(PH.x + 230, PH.y + PH.h - 50, 40, 40, { strokeColor: ACCENT, backgroundColor: ACCENT, strokeWidth: 1 }), poly(PH.x + 230, PH.y + PH.h - 50, [[13, 12], [29, 20], [13, 28], [16, 20]], { closed: true, strokeColor: WHITE, backgroundColor: WHITE, strokeWidth: 1 })])],
  ["Ride Booking - uber map pickup driver", () => P0([R(PH.x, PH.y, PH.w, 300, { backgroundColor: "#ebfbee", strokeColor: "#b2f2bb", roundness: null }),
    poly(PH.x, PH.y, [[0, 90], [280, 130]], { strokeColor: WHITE, strokeWidth: 8 }), poly(PH.x, PH.y, [[110, 0], [150, 300]], { strokeColor: WHITE, strokeWidth: 8 }),
    poly(PH.x, PH.y, [[60, 220], [130, 120], [220, 70]], { strokeColor: INK, strokeWidth: 3 }), ell(PH.x + 52, PH.y + 212, 16, 16, { strokeColor: WHITE, backgroundColor: ACCENT, strokeWidth: 2 }),
    rect(PH.x + 212, PH.y + 62, 16, 16, { strokeColor: WHITE, backgroundColor: INK, strokeWidth: 2, roundness: null }), ...searchBar(PH.x + 14, PH.y + 12, 252, "Where to?"),
    R(PH.x, PH.y + 284, PH.w, 246, { strokeColor: LINE }), rect(PH.x + 120, PH.y + 292, 40, 5, { strokeColor: LINE, backgroundColor: LINE, strokeWidth: 1 }),
    ...[["Standard", "£12.40", "3 min"], ["XL", "£18.10", "6 min"], ["Premium", "£24.80", "4 min"]].flatMap(([n, p, m], i) => [rect(PH.x + 10, PH.y + 308 + i * 52, 260, 46, { strokeColor: i === 0 ? INK : GRAY, backgroundColor: i === 0 ? SOFT : WHITE, strokeWidth: i === 0 ? 2 : 1 }),
      rect(PH.x + 20, PH.y + 318 + i * 52, 36, 26, { strokeColor: "#adb5bd", backgroundColor: GRAY, strokeWidth: 1 }), t(PH.x + 66, PH.y + 314 + i * 52, n, { fontSize: 16 }), t(PH.x + 66, PH.y + 333 + i * 52, m + " away", { fontSize: 12, strokeColor: MUTED }), t(PH.x + 206, PH.y + 322 + i * 52, p, { fontSize: 16 })]),
    ...btn(PH.x + 10, PH.y + 470, 260, 46, "Confirm Standard")])],
  ["Product Detail - ecommerce shop item", () => P0([...appBar(PH.x, PH.y, PH.w, "Product"), ...img(PH.x + 10, PH.y + 62, 260, 200),
    t(PH.x + 12, PH.y + 274, "Running Shoe", { fontSize: 22 }), t(PH.x + 12, PH.y + 306, "£89.99", { fontSize: 20, strokeColor: ACCENT }), t(PH.x + 130, PH.y + 310, "4.6 (1,204 reviews)", { fontSize: 13, strokeColor: MUTED }),
    t(PH.x + 12, PH.y + 344, "Size", { fontSize: 14, strokeColor: "#495057" }),
    ...["7", "8", "9", "10", "11"].map((s, i) => rect(PH.x + 12 + i * 52, PH.y + 368, 44, 36, { strokeColor: i === 2 ? INK : LINE, backgroundColor: i === 2 ? SOFT : WHITE, strokeWidth: i === 2 ? 2 : 1.5, label: { text: s, fontSize: 15, strokeColor: INK } })),
    ...lines(PH.x + 12, PH.y + 420, [250, 200], 14, 8), ...btn(PH.x + 10, PH.y + 470, 260, 48, "Add to cart")])],
  ["Checkout - cart payment order summary", () => P0([...appBar(PH.x, PH.y, PH.w, "Checkout"),
    t(PH.x + 14, PH.y + 66, "Order summary", { fontSize: 17 }),
    ...[["Running Shoe x1", "£89.99"], ["Socks x2", "£9.98"], ["Delivery", "£3.99"]].flatMap(([a, b], i) => [t(PH.x + 14, PH.y + 98 + i * 28, a, { fontSize: 15, strokeColor: "#495057" }), t(PH.x + 210, PH.y + 98 + i * 28, b, { fontSize: 15 })]),
    poly(PH.x, PH.y, [[14, 186], [266, 186]], { strokeColor: LINE, strokeWidth: 1.5 }), t(PH.x + 14, PH.y + 196, "Total", { fontSize: 18 }), t(PH.x + 198, PH.y + 196, "£103.96", { fontSize: 18 }),
    R(PH.x + 10, PH.y + 238, 260, 70), t(PH.x + 24, PH.y + 248, "Deliver to", { fontSize: 13, strokeColor: MUTED }), t(PH.x + 24, PH.y + 270, "12 High St, London", { fontSize: 15 }),
    R(PH.x + 10, PH.y + 320, 260, 70), rect(PH.x + 24, PH.y + 338, 44, 30, { strokeColor: ACCENT, backgroundColor: "#dbe4ff", strokeWidth: 1.5 }), t(PH.x + 80, PH.y + 330, "Visa ending 4242", { fontSize: 15 }), t(PH.x + 80, PH.y + 352, "Expires 08/28", { fontSize: 13, strokeColor: MUTED }),
    ...btn(PH.x + 10, PH.y + 466, 260, 50, "Pay £103.96")])],
  ["Profile - user account social", () => P0([...appBar(PH.x, PH.y, PH.w, "Profile"), ...avatar(PH.x + 100, PH.y + 66, 80, "#d0bfff", "DS"),
    rect(PH.x, PH.y + 152, PH.w, 28, { strokeColor: "transparent", backgroundColor: "transparent", label: { text: "Dinesh S", fontSize: 20, strokeColor: INK } }),
    ...[["128", "Posts"], ["4.2k", "Followers"], ["310", "Following"]].flatMap(([n, s], i) => [rect(PH.x + 10 + i * 88, PH.y + 190, 84, 48, { strokeColor: "transparent", backgroundColor: "transparent", label: { text: n + "\n" + s, fontSize: 14, strokeColor: INK } })]),
    ...btn(PH.x + 10, PH.y + 248, 260, 38, "Follow"),
    ...[0, 1, 2, 3, 4, 5].flatMap((i) => img(PH.x + 10 + (i % 3) * 88, PH.y + 298 + Math.floor(i / 3) * 88, 84, 84)), ...tabBar(PH.x, PH.y + PH.h - 58, PH.w)])],
  ["Notifications - activity inbox list", () => P0([...appBar(PH.x, PH.y, PH.w, "Notifications"),
    ...[["Sam liked your post", "2m"], ["New follower: Priya", "1h"], ["Order shipped", "3h"], ["Alex mentioned you", "1d"], ["Weekly summary ready", "2d"]].flatMap(([a, b], i) => listItem(PH.x, PH.y + 56 + i * 64, PH.w, a, b)),
    ...tabBar(PH.x, PH.y + PH.h - 58, PH.w)])],
  ["Seat Selection - ticket booking cinema concert", () => P0([...appBar(PH.x, PH.y, PH.w, "Choose seats"), rect(PH.x + 40, PH.y + 70, 200, 10, { strokeColor: "#adb5bd", backgroundColor: GRAY, strokeWidth: 1 }),
    t(PH.x + 118, PH.y + 84, "Stage", { fontSize: 12, strokeColor: MUTED }),
    ...Array.from({ length: 48 }, (_, k) => { const r = Math.floor(k / 8), c = k % 8; const taken = [3, 4, 11, 19, 20, 27, 34, 42].includes(k), mine = k === 28 || k === 29;
      return rect(PH.x + 26 + c * 30 + (c >= 4 ? 8 : 0), PH.y + 112 + r * 32, 22, 22, { strokeColor: mine ? ACCENT : taken ? "#adb5bd" : "#868e96", backgroundColor: mine ? ACCENT : taken ? "#dee2e6" : WHITE, strokeWidth: 1.5 }); }),
    t(PH.x + 14, PH.y + 318, "Free   Taken   Yours", { fontSize: 13, strokeColor: MUTED }), t(PH.x + 14, PH.y + 350, "2 seats · Row E · £64.00", { fontSize: 16 }),
    rect(PH.x + 14, PH.y + 384, 252, 30, { strokeColor: "#ffd43b", backgroundColor: "#fff9db", strokeWidth: 1, label: { text: "Seats held for 9:59", fontSize: 14, strokeColor: "#e67700" } }),
    ...btn(PH.x + 10, PH.y + 466, 260, 50, "Continue to payment")])],
  ["Video Watch Page - youtube streaming web", () => [...browser(0, 0, 760, 480, "https://video.example.com/watch?v=x"),
    rect(20, 60, 470, 264, { strokeColor: DARK, backgroundColor: DARK, strokeWidth: 1, roundness: null }), poly(0, 0, [[235, 170], [272, 192], [235, 214]], { closed: true, strokeColor: WHITE, backgroundColor: WHITE, strokeWidth: 1 }),
    rect(32, 304, 446, 5, { strokeColor: "#fa5252", backgroundColor: "#fa5252", strokeWidth: 1, roundness: null }),
    t(20, 336, "How to design YouTube in 45 minutes", { fontSize: 18 }), ...avatar(20, 368, 36, "#ffc9c9", "SD"), t(64, 368, "System Design Daily", { fontSize: 14 }), t(64, 386, "1.2M subscribers", { fontSize: 12, strokeColor: MUTED }), ...btn(220, 370, 100, 32, "Subscribe", "danger"),
    ...lines(20, 420, [440, 360], 14, 8), ...[0, 1, 2, 3].flatMap((i) => [...img(510, 60 + i * 100, 120, 80), ...lines(640, 66 + i * 100, [100, 70, 50], 16, 8)])]],
  ["Admin Dashboard - analytics web console", () => [...browser(0, 0, 900, 540, "https://admin.example.com"), R(0, 44, 170, 496, { backgroundColor: SOFT, roundness: null }), t(18, 60, "Admin", { fontSize: 18 }),
    ...["Overview", "Users", "Orders", "Reports", "Settings"].flatMap((s, i) => [rect(8, 96 + i * 40, 154, 32, { strokeColor: i === 0 ? "#dbe4ff" : "transparent", backgroundColor: i === 0 ? "#dbe4ff" : "transparent", strokeWidth: 1 }), t(20, 102 + i * 40, s, { fontSize: 15, strokeColor: i === 0 ? ACCENT : "#495057" })]),
    ...[["Revenue", "£48.2k"], ["Orders", "1,284"], ["Users", "9,310"], ["Churn", "2.1%"]].flatMap(([a, b], i) => [R(190 + i * 172, 64, 160, 84), t(204 + i * 172, 76, a, { fontSize: 13, strokeColor: MUTED }), t(204 + i * 172, 98, b, { fontSize: 24 })]),
    R(190, 164, 420, 180), t(206, 176, "Sales this week", { fontSize: 15, strokeColor: "#495057" }), ...bars(206, 204, 388, 124),
    R(626, 164, 252, 180), t(642, 176, "Top products", { fontSize: 15, strokeColor: "#495057" }), ...lines(642, 210, [200, 170, 150, 120, 90], 24, 10),
    R(190, 360, 688, 160), t(206, 372, "Recent orders", { fontSize: 15, strokeColor: "#495057" }), ...[0, 1, 2, 3].flatMap((i) => [poly(0, 0, [[190, 404 + i * 28], [878, 404 + i * 28]], { strokeColor: GRAY, strokeWidth: 1 }), ...lines(206, 412 + i * 28, [160], 0, 8), ...lines(520, 412 + i * 28, [80], 0, 8), ...lines(760, 412 + i * 28, [60], 0, 8)])]],
  ["Search Results - web search listing filters", () => [...browser(0, 0, 760, 480, "https://shop.example.com/search?q=laptop"), ...searchBar(20, 60, 500, "laptop"),
    t(20, 120, "Filters", { fontSize: 16 }), ...["Under £500", "£500 - £1000", "Over £1000"].flatMap((s, i) => [rect(20, 152 + i * 30, 16, 16, { strokeColor: i === 1 ? ACCENT : "#adb5bd", backgroundColor: i === 1 ? ACCENT : WHITE, strokeWidth: 1.5 }), t(46, 150 + i * 30, s, { fontSize: 14, strokeColor: "#495057" })]),
    t(200, 120, "1,240 results", { fontSize: 14, strokeColor: MUTED }),
    ...[0, 1, 2].flatMap((i) => [R(200, 146 + i * 104, 540, 94), ...img(210, 154 + i * 104, 100, 78), t(326, 158 + i * 104, ["Ultrabook 14\"", "Gaming Laptop 16\"", "Student Laptop 13\""][i], { fontSize: 17 }),
      t(326, 182 + i * 104, ["£799", "£1,249", "£449"][i], { fontSize: 16, strokeColor: ACCENT }), ...lines(326, 210 + i * 104, [300, 220], 13, 7)])]],
  ["AI Assistant Chat - llm chatbot rag web", () => [...browser(0, 0, 860, 520, "https://assistant.example.com"), R(0, 44, 200, 476, { backgroundColor: SOFT, roundness: null }), ...btn(14, 58, 172, 36, "+ New chat", "secondary"),
    ...["Trip to Lisbon", "SQL query help", "System design prep", "Email draft"].map((s, i) => t(18, 112 + i * 34, s, { fontSize: 14, strokeColor: i === 2 ? INK : "#495057" })),
    ...bubble(520, 64, 300, "How do I design a rate limiter?", true),
    ...avatar(220, 122, 30, "#fcc2d7", "AI"), R(260, 118, 560, 150, { strokeColor: "transparent", backgroundColor: "transparent" }),
    t(262, 120, "Use a token bucket at the API gateway.\nStore counters in Redis and update them\nwith an atomic Lua script...", { fontSize: 15 }),
    ...["Sources:", "rate-limiting.md", "redis-docs"].map((s, i) => i === 0 ? t(262, 196, s, { fontSize: 13, strokeColor: MUTED }) : rect(318 + (i - 1) * 140, 192, 130, 26, { strokeColor: "#fcc2d7", backgroundColor: "#fff0f6", strokeWidth: 1, label: { text: s, fontSize: 12, strokeColor: "#a61e4d" } })),
    R(220, 440, 620, 60, { strokeColor: "#adb5bd" }), t(238, 460, "Ask anything...", { strokeColor: MUTED }), ell(786, 452, 36, 36, { strokeColor: INK, backgroundColor: INK, strokeWidth: 1 }),
    poly(786, 452, [[18, 26], [18, 10]], { strokeColor: WHITE, strokeWidth: 2.5 }), poly(786, 452, [[11, 16], [18, 9], [25, 16]], { strokeColor: WHITE, strokeWidth: 2.5 })]],
];
