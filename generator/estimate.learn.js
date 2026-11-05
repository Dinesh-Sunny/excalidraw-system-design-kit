/* ---------- learn: every number, where it comes from, what it leads to ---------- */
const SRC = {
  slo: ["Google SRE book: Service level objectives", "https://sre.google/sre-book/service-level-objectives/"],
  risk: ["Google SRE book: Embracing risk", "https://sre.google/sre-book/embracing-risk/"],
  tail: ["Dean and Barroso, The Tail at Scale (CACM 2013)", "https://research.google/pubs/the-tail-at-scale/"],
  lat: ["Latency numbers every programmer should know", "https://gist.github.com/jboner/2841832"],
  little: ["Little's law", "https://en.wikipedia.org/wiki/Little%27s_law"]
};
const KC = { i: "var(--atmo-sky-mid)", m: "var(--sketch)", d: "var(--atmo-dusk-1)" };
const KN = { i: "Your input", m: "Result", d: "Design choice" };
const pl = (n, a, b) => n === 1 ? a : b;

/* nodes: k = kind (i input, m result, d design), v = live value, what/why/how/deep, blk = kit block */
const NODES = {
  "i:u": { k: "i", t: "Daily active users", v: () => N(S.u), what: "How many different people use the product on a normal day.", why: "Almost every other number starts here, so it is the first thing to agree with the interviewer.", deep: "Monthly users are bigger than daily ones. If you are given monthly users, a common guess is that a fifth to a half of them show up on a given day." },
  "i:w": { k: "i", t: "Writes per user a day", v: () => trim(S.w), what: "How many new things each person creates: posts, messages, uploads, clicks you store.", why: "Writes decide how fast data grows and how hard the database works.", deep: "Count only actions that store something. Likes and views often go to a counter or a log, not the main database." },
  "i:r": { k: "i", t: "Reads per write", v: () => trim(S.r) + " : 1", what: "How many times each new thing is read. 100 means every post is viewed about 100 times.", why: "This ratio tells you whether the system is read heavy (cache it) or write heavy (spread the writes).", deep: "Most social and content apps sit between 10:1 and 1000:1. Chat sits near 1:1 because each message is delivered about once per reader." },
  "i:p": { k: "i", t: "Peak vs average", v: () => trim(S.p) + "×", what: "How much busier the busiest minute is than a normal one.", why: "You size servers for the peak, not the average, or the busiest minute is the one that slows down.", deep: "Daily rhythms give about 2 to 3×. Launches, sales and live events can give 10 to 100×. Big spikes are often better smoothed by a queue than met with idle servers." },
  "i:s": { k: "i", t: "Size per write", v: () => B(S.s), what: "How big one stored item is: a row, a message, a file.", why: "With the write rate, it sets storage and incoming bandwidth.", deep: "Text rows are hundreds of bytes, photos are megabytes, video is gigabytes. Large items usually go to object storage with a small row pointing at them." },
  "i:rs": { k: "i", t: "Size per read", v: () => B(S.rs), what: "How much one read sends back: one item, a page of items, a video chunk.", why: "With the read rate, it sets outgoing bandwidth and cache size.", deep: "A feed load returns many items, so it can be far bigger than one write." },
  "i:y": { k: "i", t: "Keep data for", v: () => trim(S.y) + " " + pl(S.y, "year", "years"), what: "How long you keep what users write.", why: "Storage grows in a straight line with time, so this multiplies everything stored.", deep: "Keep recent data on fast storage and move old data to cheaper tiers. Some data must be kept for a fixed time, payments for example." },
  "i:c": { k: "i", t: "Copies of each write", v: () => S.c + "×", what: "How many copies of every item you keep on different machines.", why: "Copies keep data safe when a disk or machine fails, and let more machines serve reads.", deep: "Three copies is a common default in distributed stores. Erasure coding gives similar safety for about 1.5× the space, at the cost of slower rebuilds." },
  "i:l": { k: "i", t: "Latency target, p99", v: () => MS(S.l), what: "How fast a request must finish. p99 means 99 out of 100 requests finish within this time.", why: "Tight targets push data into memory and cut the number of steps per request.", deep: "The slow 1% matters more than it looks: if a page calls 100 servers that are each slow 1% of the time, 1 - 0.99¹⁰⁰ ≈ 63% of page loads hit at least one slow call.", src: "tail" },
  "i:a": { k: "i", t: "Availability target", v: () => PCT(S.a), what: "The share of time the system works. Each extra nine cuts allowed downtime by ten.", why: "It decides how much redundancy you pay for: one zone, many zones or many regions.", deep: "A target like this is an SLO. The gap between it and 100% is the error budget: room to ship changes and take risks.", src: "slo" },
  "i:g": { k: "i", t: "Plan for growth", v: () => S.g + "×", what: "How much more traffic you expect in a year or two.", why: "Sizing for growth now saves a rebuild later.", deep: "Plan for the next order of size, not forever. Designs often change once traffic grows 10×." },
  "i:sv": { k: "i", t: "One server handles", v: () => N(S.sv) + " req/s", what: "How many requests a second one server can serve. A starting guess you can change.", why: "Peak traffic divided by this gives the number of servers.", deep: "Real numbers depend on the work per request. A cached lookup might serve tens of thousands a second; a heavy query far fewer. Load tests give the true figure." },
  "i:h": { k: "i", t: "Hot share in cache", v: () => trim(S.h) + "%", what: "The share of a day's reads worth keeping in memory.", why: "It sets how much memory the cache needs.", deep: "The 80/20 rule of thumb: a small share of items gets most reads. Real access patterns are often even more skewed, so 20% is a safe upper guess." },

  "m:w": { k: "m", t: "Writes a second", v: c => N(c.w) + "/s", how: c => `${N(S.u)} users × ${trim(S.w)} writes${c.g > 1 ? ` × ${c.g} growth` : ""} ÷ 86,400 s = ${N(c.w)}/s`, what: "How many new items arrive each second on average.", why: "Write rate decides how many database machines you need and whether writes must be split across shards.", deep: "A single well-tuned SQL primary handles thousands of writes a second. Far beyond that, split the data by key or put a log in front." },
  "m:r": { k: "m", t: "Reads a second", v: c => N(c.r) + "/s", how: c => `${N(c.w)}/s × ${trim(S.r)} reads per write = ${N(c.r)}/s`, what: "How many reads arrive each second on average.", why: "High read rates are the classic reason for caches, read replicas and CDNs.", deep: "Reads are easy to scale by adding copies, as long as slightly stale data is fine." },
  "m:pk": { k: "m", t: "Peak requests", v: c => N(c.tp) + "/s", how: c => `(${N(c.w)} + ${N(c.r)})/s × ${trim(S.p)} peak = ${N(c.tp)}/s`, what: "Reads plus writes in the busiest minute.", why: "This is the number your servers, load balancer and databases must survive.", deep: "Peaks can also be smoothed: a queue takes the burst and workers drain it at a steady rate." },
  "m:st": { k: "m", t: "Storage", v: c => B(c.store), how: c => `${B(c.day)} a day × 365 × ${trim(S.y)} yr × ${S.c} ${pl(S.c, "copy", "copies")} = ${B(c.store)}`, what: "All the data you keep, copies included.", why: "It decides the kind of store, how many machines, and whether to shard.", deep: "Beyond a few terabytes, data no longer fits one machine comfortably: plan to split it, and keep large files in object storage." },
  "m:bw": { k: "m", t: "Bandwidth out", v: c => B(c.outB) + "/s", how: c => `${N(c.r)} reads/s × ${B(S.rs)} = ${B(c.outB)}/s, peak ${BIT(c.outP)}`, what: "Data sent to users each second.", why: "Large outgoing traffic is costly and is usually served from a CDN close to users.", deep: "Network cards are rated in bits: 1 Gbps carries 125 MB a second. Cloud egress is billed per gigabyte, so this number shows up on the bill." },
  "m:ca": { k: "m", t: "Cache memory", v: c => B(c.cache), how: c => `${N(c.r)}/s × 86,400 s × ${B(S.rs)} × ${trim(S.h)}% = ${B(c.cache)}`, what: "Memory needed to keep the hot data close.", why: "If it fits in one or a few machines, a cache is cheap and fast. If not, shard the cache too.", deep: "Repeated reads of the same item count once in memory, so real caches are often smaller than this upper guess." },
  "m:sv": { k: "m", t: "Servers at peak", v: c => N(c.srv), how: c => `${N(c.tp)}/s ÷ ${N(S.sv)} per server = ${N(c.srv)}`, what: "App servers needed for the busiest minute.", why: "More than one server means a load balancer, and spares in each zone so one can fail.", deep: "Keep servers around 60-70% busy at peak. The room absorbs surprises and keeps latency steady." },
  "m:fl": { k: "m", t: "Requests in flight", v: c => N(c.tp * S.l / 1000), how: c => `${N(c.tp)}/s × ${MS(S.l)} = ${N(c.tp * S.l / 1000)} at once`, what: "How many requests are being worked on at the same moment.", why: "It sizes connection pools, threads and open sockets.", deep: "This is Little's law: items in a system = arrival rate × time each spends inside. Using the p99 target gives a safe upper bound.", src: "little" },
  "m:dn": { k: "m", t: "Downtime allowed", v: c => DUR(c.down * 365.25 * 86400) + " a year", how: c => `(100% - ${PCT(S.a)}) × 1 year = ${DUR(c.down * 365.25 * 86400)}`, what: "How long the system may be down in a year and still hit the target.", why: "Minutes a year rule out manual fixes: recovery has to be automatic.", deep: "Planned work counts too, so very high targets need rolling deploys with no downtime." },
  "m:eb": { k: "m", t: "Error budget", v: c => N((c.w + c.r) * 86400 * 30 * c.down) + " a month", how: c => `${N((c.w + c.r) * 86400 * 30)} requests a month × ${PCT(100 - S.a)} = ${N((c.w + c.r) * 86400 * 30 * c.down)}`, what: "How many requests may fail in a month within the target.", why: "Teams spend it on releases and experiments; when it runs low, they slow down and fix reliability.", deep: "Counting failed requests is fairer than counting minutes for a system that is partly up.", src: "risk" },

  "d:cache": { k: "d", t: "Cache", blk: "pattern-cache-aside-lazy-loading-read-path", v: () => S.r >= 5 || S.l <= 100 ? "fits now" : "optional", what: "Keep hot data in memory in front of the database.", why: "Read heavy traffic and tight latency both point here.", deep: "Watch for stale data and for a sudden flood when a popular key expires; refresh it early or let one request rebuild it." },
  "d:repl": { k: "d", t: "Read replicas", blk: "data-read-replica-follower-slave-reader-replication", v: () => S.r >= 5 ? "fits now" : "optional", what: "Copies of the database that serve reads.", why: "They spread a high read rate without touching the write path.", deep: "Replicas lag a little behind the primary, so read-your-own-write needs care." },
  "d:shard": { k: "d", t: "Shards", blk: "data-shard-partition-horizontal-scaling", v: c => c.wp >= 5000 || c.store >= 5e13 ? "fits now" : "later", what: "Split data by key across many machines.", why: "Too many writes or too much data for one machine.", deep: "Pick a key that spreads load evenly; a celebrity user or a hot product can still overload one shard." },
  "d:queue": { k: "d", t: "Queue", blk: "msg-message-queue-mq-async-buffer-decouple", v: () => S.p >= 10 ? "fits now" : "optional", what: "A buffer that takes work now and hands it to workers at a steady pace.", why: "Sharp peaks and slow work both get easier.", deep: "Queues trade a little delay for steadiness; anything the user waits on directly should stay out of them." },
  "d:cdn": { k: "d", t: "CDN", blk: "edge-cdn-cloudfront-akamai-edge-cache-static-assets", v: c => c.outP >= 1.25e9 || S.rs >= 1e5 ? "fits now" : "optional", what: "Servers near users that keep copies of popular files.", why: "Big outgoing bandwidth and large files.", deep: "Great for files that many people fetch; private or fast-changing data gains less." },
  "d:multi": { k: "d", t: "Multi-region", blk: "pattern-multi-region-active-active-geo-dns-failover", v: () => S.a >= 99.99 ? "fits now" : "later", what: "Run in more than one region so a whole region can fail.", why: "Four nines and up leave too little downtime for a region outage.", deep: "The hard part is data: choose which data can be eventually consistent across regions and which needs one home." },
  "d:lb": { k: "d", t: "Load balancer", blk: "edge-load-balancer-lb-elb-alb-nlb-l4-l7-round-robin", v: c => c.srv > 1 ? "fits now" : "optional", what: "One address that spreads requests over many servers.", why: "Needed as soon as you have more than one server.", deep: "Health checks take failed servers out of rotation within seconds." },
  "d:obj": { k: "d", t: "Object storage", blk: "data-object-storage-s3-s3-blob-gcs-files-images-video", v: () => S.s >= 1e5 ? "fits now" : "optional", what: "Cheap, durable storage for files and blobs.", why: "Large items and very large totals.", deep: "Store the file in object storage and a small record with its key in the database." },
  "d:pool": { k: "d", t: "Connection pools", blk: "", v: () => "always", what: "Reused connections between services and databases.", why: "Requests in flight set how many you need.", deep: "Too few and requests wait; too many and the database spends its time switching between them." }
};
const EDGES = [["i:u", "m:w"], ["i:w", "m:w"], ["i:g", "m:w"], ["m:w", "m:r"], ["i:r", "m:r"], ["m:w", "m:pk"], ["m:r", "m:pk"], ["i:p", "m:pk"],
  ["m:w", "m:st"], ["i:s", "m:st"], ["i:y", "m:st"], ["i:c", "m:st"], ["m:r", "m:bw"], ["i:rs", "m:bw"], ["m:r", "m:ca"], ["i:rs", "m:ca"], ["i:h", "m:ca"],
  ["m:pk", "m:sv"], ["i:sv", "m:sv"], ["m:pk", "m:fl"], ["i:l", "m:fl"], ["i:a", "m:dn"], ["i:a", "m:eb"], ["m:w", "m:eb"], ["m:r", "m:eb"],
  ["m:ca", "d:cache"], ["i:l", "d:cache"], ["m:r", "d:repl"], ["m:w", "d:shard"], ["m:st", "d:shard"], ["i:p", "d:queue"], ["m:pk", "d:queue"],
  ["m:bw", "d:cdn"], ["i:rs", "d:cdn"], ["m:dn", "d:multi"], ["i:a", "d:multi"], ["m:sv", "d:lb"], ["i:s", "d:obj"], ["m:st", "d:obj"], ["m:fl", "d:pool"]];
const from = id => EDGES.filter(e => e[1] === id).map(e => e[0]), to = id => EDGES.filter(e => e[0] === id).map(e => e[1]);
const nv = (id, c) => { try { return NODES[id].v(c); } catch (e) { return ""; } };

/* why tiles */
const ICO = {
  size: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  pick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v6m0 6v6M3 12h6m6 0h6"/><circle cx="12" cy="12" r="3"/></svg>',
  talk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h16v11H9l-5 4z"/></svg>'
};
$("#whyt").innerHTML = [["size", "Find the size of the problem", "Thousands of requests a second fit on a few servers. Millions need a very different shape. Estimates tell you which world you are in."],
  ["pick", "Pick parts for a reason", "A cache because reads outnumber writes 100 to 1. Shards because data passes a hundred terabytes. Numbers turn guesses into choices."],
  ["talk", "Show clear thinking", "Interviewers look for stated assumptions and simple maths, rounded generously. Being in the right range beats being precise."]]
  .map(([i, t, d]) => `<div class="tile">${ICO[i]}<b>${t}</b><p>${d}</p></div>`).join("");

/* how to use: each step points at the part of the page it means */
const USE = [["Pick a starting point", "Use a classic question, or start from round numbers.", "#preset summary"],
  ["Change the numbers that matter", "Drag a slider or type 2B, 500 KB or 50 ms. Arrow keys nudge.", "#ein"],
  ["Read your requirements", "The yellow note lists them in interview words. Each card below shows its maths.", "#nfrc"],
  ["Put it on your board", "Copy to Excalidraw pastes the note as a sticky. The ⋯ menu copies text, Markdown or a link.", "#cpx"]];
$("#uset").innerHTML = USE.map(([t, d], i) => `<div class="ustep"><div><b>${t}</b><span>${d}</span></div><button type="button" data-show="${i}">Show me</button></div>`).join("");
$("#uset").addEventListener("click", e => {
  const b = e.target.closest("[data-show]"); if (!b) return; const el = $(USE[+b.dataset.show][2]); if (!el) return;
  el.scrollIntoView({ behavior: RM.matches ? "auto" : "smooth", block: "center" });
  el.classList.add("spot"); setTimeout(() => el.classList.remove("spot"), 2200); ev("estimate/learn-show/" + b.dataset.show);
});

/* connections explorer */
let cur = "m:pk", trail = ["m:pk"];
const card = (id, c) => `<button type="button" class="nd" data-go="${id}"><span class="nt"><i style="background:${KC[NODES[id].k]}"></i>${NODES[id].t}</span><em>${esc(nv(id, c))}</em></button>`;
function drawCx() {
  const c = calc(), n = NODES[cur], f = from(cur), t = to(cur);
  const src = n.src ? `<a href="${SRC[n.src][1]}" target="_blank" rel="noopener">Source: ${SRC[n.src][0]}</a>` : "";
  const blk = n.blk ? `<a href="../#i=${n.blk}">Open the ${n.t.toLowerCase()} block</a>` : "";
  const inp = n.k === "i" ? `<button type="button" data-edit="${cur.slice(2)}">Change it</button>` : "";
  const met = n.k === "m" && $(`[data-m="${MCARD[cur] || ""}"]`) ? `<button type="button" data-card="${MCARD[cur]}">See its card</button>` : "";
  $("#cx").innerHTML = `<div class="cxc from"><span>Comes from</span>${f.map(x => card(x, c)).join("") || `<p class="none">This is where it starts: a number you choose.</p>`}</div>
  <div class="focus" aria-live="polite"><span class="kk"><i style="background:${KC[n.k]}"></i>${KN[n.k]}</span><h4>${n.t}</h4><span class="val">${esc(nv(cur, c))}</span>
  <p>${n.what}</p><p><b>Why it matters.</b> ${n.why}</p>${n.how ? `<code>${esc(n.how(c))}</code>` : ""}
  <details><summary>Go deeper</summary><p>${n.deep}</p></details>${blk || src || inp || met ? `<div class="fa">${[inp, met, blk, src].filter(Boolean).join("")}</div>` : ""}</div>
  <div class="cxc to"><span>Leads to</span>${t.map(x => card(x, c)).join("") || `<p class="none">A design choice: the end of this chain.</p>`}</div>`;
  $("#trail").innerHTML = trail.length > 1 ? trail.map((id, i) => i === trail.length - 1 ? `<b>${NODES[id].t}</b>` : `<button type="button" data-tr="${i}">${NODES[id].t}</button>›`).join(" ") : "";
  document.querySelectorAll("#jump button").forEach(b => b.setAttribute("aria-current", String(b.dataset.go === cur)));
}
const MCARD = { "m:w": "w", "m:r": "r", "m:st": "st", "m:bw": "bw", "m:ca": "ca", "m:sv": "sv" };
function goNode(id, keep) { if (!NODES[id]) return; cur = id; if (keep) { const i = trail.indexOf(id); trail = i >= 0 ? trail.slice(0, i + 1) : [...trail, id].slice(-6); } else trail = [id]; drawCx(); }
$("#leg").innerHTML = Object.keys(KN).map(k => `<span><i style="background:${KC[k]}"></i>${KN[k]}</span>`).join("");
$("#jump").innerHTML = ["m:w", "m:r", "m:pk", "m:st", "m:bw", "m:ca", "m:sv", "m:fl", "m:dn", "m:eb"].map(id => `<button type="button" data-go="${id}"><i style="background:${KC.m}"></i>${NODES[id].t}</button>`).join("");
$("#jump").addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) { goNode(b.dataset.go); ev("estimate/learn-node/" + b.dataset.go); b.scrollIntoView({ block: "nearest", inline: "center", behavior: RM.matches ? "auto" : "smooth" }); } });
$("#cx").addEventListener("click", e => {
  const g = e.target.closest("[data-go]"); if (g) { goNode(g.dataset.go, true); if (innerWidth < 860) $("#cx .focus").scrollIntoView({ behavior: RM.matches ? "auto" : "smooth", block: "center" }); return; }
  const ed = e.target.closest("[data-edit]"); if (ed) { const k = ed.dataset.edit; if (FINE.includes(k)) $("#fine").open = true; const el = $("#i_" + k) || document.querySelector(`[data-seg="${k}"] button`); if (el) { el.scrollIntoView({ behavior: RM.matches ? "auto" : "smooth", block: "center" }); setTimeout(() => el.focus({ preventScroll: true }), 350); const box = el.closest(".fld"); box.classList.add("spot"); setTimeout(() => box.classList.remove("spot"), 2000); } return; }
  const cd = e.target.closest("[data-card]"); if (cd) { const m = $(`[data-m="${cd.dataset.card}"]`); m.scrollIntoView({ behavior: RM.matches ? "auto" : "smooth", block: "center" }); m.classList.add("elit"); setTimeout(() => m.classList.remove("elit"), 2000); }
});
$("#trail").addEventListener("click", e => { const b = e.target.closest("[data-tr]"); if (b) goNode(trail[+b.dataset.tr], true); });

/* the "?" on each result card opens it in the explorer */
const CARDN = { w: "m:w", r: "m:r", st: "m:st", bw: "m:bw", ca: "m:ca", sv: "m:sv" };
function addWhy() { document.querySelectorAll(".met").forEach(m => { if (m.querySelector(".qwhy")) return; m.insertAdjacentHTML("beforeend", `<button type="button" class="qwhy" data-why="${CARDN[m.dataset.m]}" aria-label="What is ${m.querySelector("span").textContent.toLowerCase()}?" title="What is this?">?</button>`); }); }
$("#mets").addEventListener("click", e => { const b = e.target.closest("[data-why]"); if (!b) return; goNode(b.dataset.why); goSec("links"); ev("estimate/learn-why/" + b.dataset.why); });

/* what if: try a change on a copy, compare, keep it if you like */
const WIF = [
  { id: "x10", t: "10× more users", f: s => ({ ...s, u: s.u * 10 }), ins: "Everything that counts requests or bytes grows <b>10×</b>. Latency and uptime targets stay put: they are promises, not totals." },
  { id: "video", t: "Video, not text", f: s => ({ ...s, s: 5e6, rs: 5e6 }), ins: "Item size drives <b>storage, bandwidth and cache</b>, while request counts stay the same. Big files move to object storage and a CDN." },
  { id: "sale", t: "Flash sale, 50× peak", f: s => ({ ...s, p: 50 }), ins: "Only the <b>peak</b> numbers move: servers and peak bandwidth. Average traffic and storage stay the same, which is why a queue in front often beats buying servers." },
  { id: "nines", t: "Five nines", f: s => ({ ...s, a: 99.999 }), ins: "Traffic and storage stay the same, but downtime drops to <b>about 5 minutes a year</b>. That rules out manual recovery and points to multiple regions." },
  { id: "keep", t: "Keep data 20 years", f: s => ({ ...s, y: 20 }), ins: "Only <b>storage</b> grows, in a straight line with time. Moving old data to cheaper tiers keeps it affordable." },
  { id: "one", t: "One copy only", f: s => ({ ...s, c: 1 }), ins: "Storage drops to a third, but one disk failure now loses data. Copies are the price of <b>durability</b>." }
];
let wsel = "";
function rows(c) { return [["Writes / s", N(c.w), c.w], ["Peak requests / s", N(c.tp), c.tp], ["Storage", B(c.store), c.store], ["Bandwidth at peak", BIT(c.outP), c.outP], ["Cache memory", B(c.cache), c.cache], ["Servers at peak", N(c.srv), c.srv], ["Downtime a year", DUR(c.down * 365.25 * 86400), c.down]]; }
function drawWif() {
  $("#wifs").innerHTML = WIF.map(w => `<button type="button" data-w="${w.id}" aria-pressed="${w.id === wsel}">${w.t}</button>`).join("");
  const w = WIF.find(x => x.id === wsel); if (!w) { $("#wres").innerHTML = ""; return; }
  const a = rows(calc()), keep = S; S = w.f({ ...S }); const b = rows(calc()); S = keep;
  const x = (p, q) => { if (!p && !q) return "same"; const r = q / p; if (Math.abs(r - 1) < 0.005) return "same"; return r >= 1 ? "×" + trim(r) : "÷" + trim(1 / r); };
  $("#wres").innerHTML = `<div class="wres"><p class="ins">${w.ins}</p><table class="dt"><thead><tr><th>Number</th><th>Yours</th><th>What if</th><th>Change</th></tr></thead><tbody>${a.map((r, i) => { const d = x(r[2], b[i][2]); return `<tr class="${d === "same" ? "same" : ""}"><td>${r[0]}</td><td>${r[1]}</td><td>${b[i][1]}</td><td><span class="dx">${d}</span></td></tr>`; }).join("")}</tbody></table><div class="wbtns"><button type="button" class="pill primary sm" data-wk="${w.id}">Keep this change</button><button type="button" class="pill ghost sm" data-wk="">Leave my numbers</button></div></div>`;
}
$("#wifs").addEventListener("click", e => { const b = e.target.closest("[data-w]"); if (!b) return; wsel = wsel === b.dataset.w ? "" : b.dataset.w; drawWif(); if (wsel) ev("estimate/whatif/" + wsel); });
$("#wres").addEventListener("click", e => {
  const b = e.target.closest("[data-wk]"); if (!b) return; const id = b.dataset.wk; wsel = "";
  if (id) { const was = { ...S }; S = WIF.find(x => x.id === id).f({ ...S }); syncInputs(); draw(true); say("Change kept", "Undo", () => { S = was; syncInputs(); draw(true); }); }
  drawWif();
});

/* say it: five points, revealed one at a time */
let shown = 1;
function beats() {
  const c = calc(), picks = $("#means") ? [...document.querySelectorAll("#means b")].map(b => /^[A-Z][a-z]/.test(b.textContent) && !/^(Redis|Kafka|CDN)/.test(b.textContent) ? b.textContent.toLowerCase() : b.textContent) : [];
  return [["Assumptions", `${N(S.u)} daily users, each writing ${S.w === 1 ? "once" : S.w === 2 ? "twice" : trim(S.w) + " times"} a day, with ${trim(S.r)} reads per write. Peaks run about ${trim(S.p)}× the average${S.g > 1 ? `, and I'll plan for ${S.g}× growth` : ""}.`],
    ["Traffic", `That's about ${N(c.w)} writes and ${N(c.r)} reads a second, so roughly ${N(c.tp)} a second at peak.`],
    ["Storage", `At ${B(S.s)} per write, that's ${B(c.day)} a day: ${B(c.raw)} over ${trim(S.y)} ${pl(S.y, "year", "years")}, ${B(c.store)} with ${S.c} ${pl(S.c, "copy", "copies")}.`],
    ["Targets", `p99 under ${MS(S.l)} and ${PCT(S.a)} available, which leaves about ${DUR(c.down * 365.25 * 86400)} of downtime a year.`],
    ["So the design needs", picks.length ? picks.slice(0, 4).map((x, i) => i ? x : x[0].toUpperCase() + x.slice(1)).join(", ").replace(/, ([^,]*)$/, " and $1") + "." : "a load balancer in front of a few servers."]];
}
function drawSay() {
  const b = beats();
  $("#sayb").innerHTML = b.slice(0, shown).map(([t, d], i) => `<div class="beat"><i>${i + 1}</i><div><b>${t}</b><p>${esc(d)}</p></div></div>`).join("") +
    `<div class="ctl">${shown < b.length ? `<button type="button" class="primary" data-s="next">Next point</button><button type="button" data-s="all">Show all</button>` : `<button type="button" data-s="copy">Copy the script</button><button type="button" data-s="again">Start again</button>`}<span>${shown} of ${b.length}</span></div>`;
}
$("#sayb").addEventListener("click", async e => {
  const b = e.target.closest("[data-s]"); if (!b) return; const s = b.dataset.s;
  if (s === "next") shown++; if (s === "all") shown = beats().length; if (s === "again") shown = 1;
  if (s === "copy") { if (await copyText(beats().map(([t, d]) => `${t}: ${d}`).join("\n"), "Script copied")) ev("estimate/copy-script"); return; }
  drawSay(); if (s === "next") { const l = $("#sayb .beat:last-of-type"); if (l) l.scrollIntoView({ behavior: RM.matches ? "auto" : "smooth", block: "nearest" }); }
});
$("#fus").innerHTML = [["Why size for the peak and not the average?", "Users feel the busiest minute. Sizing for the average means that minute is the slow one. Either buy room for the peak or smooth it with a queue."],
  ["Why p99 and not the average latency?", "The average hides the slow tail. One page often calls many services, so a rare slow call becomes a common slow page. That is why targets are set on p99."],
  ["Where did 2,000 requests per server come from?", "It is a starting guess. The real number depends on the work per request; a load test on one server gives it, then you divide the peak by that."],
  ["How would you cut the storage?", "Keep less for less time, compress text, drop duplicates, and move old data to cheaper storage tiers. Copies stay, because they protect the data."],
  ["What changes at ten times the traffic?", "Use What if above: request counts and storage grow 10×, targets stay. Usually the next steps are sharding the data and adding caches or a CDN."]]
  .map(([q, a]) => `<details class="efu"><summary>${q}</summary><p>${a}</p></details>`).join("");

/* words */
const WORDS = [["DAU", "daily active users", "People who use the product on a given day.", "MAU is the monthly figure. DAU ÷ MAU shows how often people come back."],
  ["QPS", "queries per second", "Requests arriving each second. Also called RPS.", "A day has 86,400 seconds, about 10⁵: 1M a day is about 12 a second."],
  ["Peak factor", "", "How much busier the busiest minute is than average.", "Size servers for the peak; smooth bursts with queues."],
  ["p50 / p99", "percentiles", "p50 is the typical request; p99 is the slowest of the fast 99%.", "Tail latency grows with fan-out, so large systems set targets on p99 or p99.9.", "tail"],
  ["SLI / SLO / SLA", "", "What you measure, the target you set for it, and the promise with consequences.", "Example: SLI = share of requests under 200 ms; SLO = 99.9% of them; SLA = a refund if it falls below 99.5%.", "slo"],
  ["Nines", "", "99.9% is three nines, 99.99% four. Each extra nine allows ten times less downtime.", "Parts in a row multiply their availability; spare copies side by side add nines.", ""],
  ["Error budget", "", "The failures you can afford within the target.", "Spend it on releases; when it runs out, focus on reliability.", "risk"],
  ["Replication factor", "", "How many copies of each item are kept.", "Three is common. It protects data and adds read capacity, at three times the space."],
  ["Hot set", "80/20", "The small share of data that gets most of the reads.", "Cache the hot set, not everything. Popularity is often even more skewed than 80/20."],
  ["Ingress / egress", "", "Data coming in and going out.", "Egress is what users download; cloud providers usually bill for it."],
  ["Gbps vs GB/s", "", "Networks count bits, storage counts bytes. 8 bits make a byte.", "1 Gbps = 125 MB/s. Mixing them up is an 8× mistake."],
  ["N + 1", "", "Run one more server than you need so any one can fail.", "With several zones, keep spare capacity in each zone."],
  ["Little's law", "", "In flight = arrival rate × time each request takes.", "It sizes thread pools and connection pools from QPS and latency.", "little"],
  ["KB vs KiB", "", "Here 1 KB = 1,000 bytes, like on a whiteboard. 1 KiB = 1,024 bytes.", "The gap is 2.4% at KB and 10% at TB: fine for estimates."]];
$("#wordl").innerHTML = WORDS.map(([t, s, d, deep, src]) => `<div class="word" id="w-${t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}"><b>${t}${s ? `<small>${s}</small>` : ""}</b><p>${d}</p><details><summary>A little deeper</summary><p>${deep}${src ? ` <a href="${SRC[src][1]}" target="_blank" rel="noopener">Source</a>` : ""}</p></details></div>`).join("");

/* section bar: lit tab follows the scroll; taps glide with the bar height accounted for */
const SECS = ["why", "use", "links", "whatif", "say", "words"];
let lock = 0;
function goSec(id) {
  const el = $("#" + id); if (!el) return; lock = Date.now();
  const y = el.getBoundingClientRect().top + scrollY - (navEl ? navEl.offsetHeight : 56) - $("#lbar").offsetHeight - 8;
  scrollTo({ top: y, behavior: RM.matches ? "auto" : "smooth" }); litSec(id);
}
function litSec(id) { document.querySelectorAll("#lbar a").forEach(a => { const on = a.getAttribute("href") === "#" + id; a.setAttribute("aria-current", String(on)); if (on) { const bar = $("#lbar"), l = a.offsetLeft - 16; if (l < bar.scrollLeft || a.offsetLeft + a.offsetWidth > bar.scrollLeft + bar.clientWidth) bar.scrollTo({ left: l, behavior: RM.matches ? "auto" : "smooth" }); } }); }
$("#lbar").addEventListener("click", e => { const a = e.target.closest("a"); if (!a) return; e.preventDefault(); goSec(a.getAttribute("href").slice(1)); });
addEventListener("scroll", () => { if (Date.now() - lock < 1200) return; const off = (navEl ? navEl.offsetHeight : 56) + 90; let id = ""; for (const s of SECS) if ($("#" + s).getBoundingClientRect().top < off) id = s; litSec(id); }, { passive: true });

/* keep the learn parts in step with the numbers */
const _draw = draw;
draw = function (p) { _draw(p); addWhy(); if ($("#cx")) { drawCx(); drawWif(); drawSay(); } };
draw();
