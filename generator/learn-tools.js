/* Hands-on tools for block lessons - one per kind of block. Each is TOOLS.<key>(el) and builds a small playground in el.
   Shared look: .tool1 card, a header line, one primary Play action, a quiet Reset, a live log line and three stat tiles.
   Everything shown is computed from the simulation itself (no made-up numbers); example assumptions are stated on screen. */
const PLAY = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4.5 3v10l8.5-5z"/></svg>';
const RM = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function toolShell(el, o) { // o: { head, seg: [[key,label,title]], segOn, play, hint, body, stats: [[key,label]] }
  el.innerHTML = `<div class="tool1"><div class="th"><span>${o.head}</span>${o.seg ? `<span class="tseg" role="group">${o.seg.map(([k, l, ti]) => `<button type="button" data-seg="${k}" class="${k === o.segOn ? "on" : ""}"${ti ? ` title="${ti}"` : ""}>${l}</button>`).join("")}</span>` : ""}</div>
    <div class="lrow">${o.play ? `<button class="pill primary sm" type="button" data-play>${PLAY}${o.play}</button>` : ""}${o.hint ? `<span class="lhint">${o.hint}</span>` : ""}<button class="tlink" type="button" data-reset>Reset</button></div>
    ${o.body}<p class="tlog" aria-live="polite">${o.log || ""}</p>
    ${o.stats ? `<div class="tstat">${o.stats.map(([k, l]) => `<div><b data-s="${k}">-</b><span>${l}</span></div>`).join("")}</div>` : ""}</div>`;
  const q = s => el.querySelector(s);
  return { q, log: h => { q(".tlog").innerHTML = h; }, stat: (k, v) => { const b = q(`[data-s="${k}"]`); if (b) b.textContent = v; }, seg: k => el.querySelectorAll("[data-seg]").forEach(b => b.classList.toggle("on", b.dataset.seg === k)) };
}
const tick = (fn, ms, n, done) => { if (RM()) { for (let i = 0; i < n; i++) fn(i); if (done) done(); return null; } let i = 0; const h = setInterval(() => { fn(i); if (++i >= n) { clearInterval(h); if (done) done(); } }, ms); return h; };
Object.assign(TOOLS, {
  lb(el) { // three servers, B is slower; compare routing methods and take a server out
    const U = ["ana", "ben", "cai", "dee"], st = { alg: "rr", q: [0, 0, 0], served: [0, 0, 0], down: [false, false, false], rr: 0, t: 0, waits: [], run: null };
    const S = toolShell(el, { head: "Three servers behind one load balancer. Server B is half as fast.", seg: [["rr", "Round robin", "Take turns"], ["lc", "Least busy", "Send to the server with the fewest open requests"], ["hash", "Same user", "Hash the user so they always land on one server"]], segOn: "rr", play: "Send 40 requests", hint: "tap a server to take it offline",
      body: `<div class="lbv">${["A", "B", "C"].map((n, i) => `<button type="button" class="srv" data-srv="${i}"><b>Server ${n}</b><small>${i === 1 ? "slow" : "fast"}</small><span class="qbar"><i></i></span><em>0 queued · 0 done</em></button>`).join("")}</div>`,
      log: "Pick a method, then send traffic. Watch the queues.", stats: [["wait", "average wait (ticks)"], ["max", "longest queue"], ["spread", "done per server"]] });
    const paint = () => { el.querySelectorAll(".srv").forEach((b, i) => { b.classList.toggle("off", st.down[i]); b.querySelector("i").style.width = Math.min(100, st.q[i] * 10) + "%"; b.querySelector("em").textContent = st.down[i] ? "offline - health check failed" : `${st.q[i]} queued · ${st.served[i]} done`; });
      S.stat("wait", st.waits.length ? (st.waits.reduce((a, b) => a + b, 0) / st.waits.length).toFixed(1) : "-"); S.stat("max", Math.max(...st.q)); S.stat("spread", st.served.join(" / ")); };
    const pick = u => { const live = [0, 1, 2].filter(i => !st.down[i]); if (!live.length) return -1;
      if (st.alg === "rr") { let i = st.rr % 3; while (st.down[i]) i = (i + 1) % 3; st.rr = i + 1; return i; }
      if (st.alg === "lc") return live.sort((a, b) => st.q[a] - st.q[b])[0];
      const h = [...U[u]].reduce((a, c) => a + c.charCodeAt(0), 0) % 3; let i = h; while (st.down[i]) i = (i + 1) % 3; return i; };
    const step = () => { st.t++; [0, 1, 2].forEach(i => { if (st.down[i] || !st.q[i]) return; if (i === 1 && st.t % 2) return; st.q[i]--; st.served[i]++; });
      const u = Math.floor(Math.random() * 4), s = pick(u); if (s < 0) { S.log("Every server is offline. Nothing can be served."); return; }
      st.waits.push(st.q[s] * (s === 1 ? 2 : 1)); st.q[s]++; S.log(`Request from <b>${U[u]}</b> went to <b>Server ${"ABC"[s]}</b>${st.alg === "hash" ? " (same server every time for this user)" : st.alg === "lc" ? " (fewest open requests)" : " (next in turn)"}.`); paint(); };
    const reset = () => { clearInterval(st.run); Object.assign(st, { q: [0, 0, 0], served: [0, 0, 0], rr: 0, t: 0, waits: [] }); S.log("Pick a method, then send traffic. Watch the queues."); paint(); };
    el.addEventListener("click", e => { const g = e.target.closest("[data-seg]"); if (g) { st.alg = g.dataset.seg; S.seg(st.alg); reset(); return; }
      const v = e.target.closest("[data-srv]"); if (v) { const i = +v.dataset.srv; st.down[i] = !st.down[i]; S.log(st.down[i] ? `Server ${"ABC"[i]} failed its health check, so the balancer stops sending to it.` : `Server ${"ABC"[i]} passed its health check and is back in rotation.`); paint(); return; }
      if (e.target.closest("[data-reset]")) { st.down = [false, false, false]; return reset(); }
      if (e.target.closest("[data-play]")) { reset(); st.run = tick(step, 120, 40, () => S.log(st.alg === "lc" ? "Least busy kept the slow server's queue short." : st.alg === "rr" ? "Round robin gave B as much as the others, so its queue grew." : "Each user stuck to one server: handy for sessions, uneven when one server is slow.")); } });
    paint();
  },
  ratelimit(el) { // token bucket vs fixed window, one request at a time or a burst
    const st = { alg: "tb", tokens: 5, cap: 5, win: 0, winStart: 0, t: 0, ok: 0, no: 0, run: null, clock: null };
    const S = toolShell(el, { head: "Limit: 5 requests, refilled at 1 per second.", seg: [["tb", "Token bucket", "Each request spends a token; tokens refill steadily"], ["fw", "Fixed window", "Count requests per 5 second window; reset at the edge"]], segOn: "tb", play: "Send a burst of 8", hint: "or one at a time",
      body: `<div class="lrow"><button class="chip" type="button" data-one>Send 1 request</button></div><div class="tokens" aria-label="Tokens"></div>`, log: "Tokens show what you can spend right now.", stats: [["ok", "allowed (200)"], ["no", "limited (429)"], ["left", "left now"]] });
    const paint = () => { const k = el.querySelector(".tokens"); if (st.alg === "tb") k.innerHTML = Array.from({ length: st.cap }, (_, i) => `<i class="${i < Math.floor(st.tokens) ? "on" : ""}"></i>`).join(""); else k.innerHTML = Array.from({ length: st.cap }, (_, i) => `<i class="${i < st.cap - st.win ? "on" : ""}"></i>`).join("") + `<small>window resets in ${5 - ((st.t - st.winStart) % 5)} s</small>`;
      S.stat("ok", st.ok); S.stat("no", st.no); S.stat("left", st.alg === "tb" ? Math.floor(st.tokens) : st.cap - st.win); };
    const req = () => { let ok; if (st.alg === "tb") { ok = st.tokens >= 1; if (ok) st.tokens -= 1; } else { ok = st.win < st.cap; if (ok) st.win++; }
      ok ? st.ok++ : st.no++; S.log(ok ? `<b class="h">200 OK.</b> Request allowed.` : `<b class="m">429 Too Many Requests.</b> Retry-After: ${st.alg === "tb" ? 1 : 5 - ((st.t - st.winStart) % 5)} s. The client waits instead of hammering.`); paint(); };
    const sec = () => { st.t++; if (st.alg === "tb") st.tokens = Math.min(st.cap, st.tokens + 1); else if ((st.t - st.winStart) % 5 === 0) { st.win = 0; st.winStart = st.t; } paint(); };
    st.clock = setInterval(() => { if (el.isConnected) sec(); else clearInterval(st.clock); }, 1000);
    const reset = () => { clearInterval(st.run); Object.assign(st, { tokens: 5, win: 0, winStart: st.t, ok: 0, no: 0 }); S.log("Tokens show what you can spend right now."); paint(); };
    el.addEventListener("click", e => { const g = e.target.closest("[data-seg]"); if (g) { st.alg = g.dataset.seg; S.seg(st.alg); reset(); return; }
      if (e.target.closest("[data-one]")) return req(); if (e.target.closest("[data-reset]")) return reset();
      if (e.target.closest("[data-play]")) { st.run = tick(req, 90, 8, () => S.log(`Burst of 8: ${st.ok} allowed, ${st.no} limited. ${st.alg === "tb" ? "The bucket absorbs a burst up to its size, then refills steadily." : "A fixed window allows a burst at the edge of two windows - up to double for a moment."}`)); } });
    paint();
  },
  kafka(el) { // three partitions, keyed events, a consumer group you can grow and shrink
    const P = 3, KEYS = ["user-1", "user-2", "user-3", "user-4"], st = { logs: [[], [], []], read: [0, 0, 0], cons: 2, n: 0, run: null };
    const hp = k => [...k].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7) % P;
    const S = toolShell(el, { head: "A topic with 3 partitions and one consumer group.", play: "Produce 9 events", hint: "same key → same partition, in order",
      body: `<div class="lrow"><span class="lhint">Consumers in the group</span><button class="chip" type="button" data-c="-1">−</button><b class="ccount">2</b><button class="chip" type="button" data-c="1">+</button><button class="chip" type="button" data-consume>Consume once</button></div><div class="parts"></div>`, log: "Events with the same key always land in the same partition.", stats: [["msgs", "events stored"], ["lag", "lag (not yet read)"], ["idle", "idle consumers"]] });
    const owner = p => p % st.cons; // range-style assignment
    const paint = () => { el.querySelector(".ccount").textContent = st.cons;
      el.querySelector(".parts").innerHTML = st.logs.map((l, p) => `<div class="part"><span class="pn">P${p}<small>→ consumer ${owner(p) + 1}</small></span><div class="cells">${l.map((m, o) => `<i class="${o < st.read[p] ? "rd" : ""} k${KEYS.indexOf(m)}" title="offset ${o}: ${m}">${o}</i>`).join("")}</div></div>`).join("");
      const tot = st.logs.reduce((a, l) => a + l.length, 0), rd = st.read.reduce((a, b) => a + b, 0); S.stat("msgs", tot); S.stat("lag", tot - rd); S.stat("idle", Math.max(0, st.cons - P)); };
    const produce = () => { const k = KEYS[st.n++ % 4], p = hp(k); st.logs[p].push(k); S.log(`<b>${k}</b> → partition <b>P${p}</b> at offset ${st.logs[p].length - 1}.`); paint(); };
    const consume = () => { let moved = 0; for (let p = 0; p < P; p++) if (st.read[p] < st.logs[p].length) { st.read[p]++; moved++; } S.log(moved ? `Each consumer read the next event from its own partitions, in offset order.` : "Nothing new to read: lag is zero."); paint(); };
    const reset = () => { clearInterval(st.run); Object.assign(st, { logs: [[], [], []], read: [0, 0, 0], n: 0 }); S.log("Events with the same key always land in the same partition."); paint(); };
    el.addEventListener("click", e => { const c = e.target.closest("[data-c]"); if (c) { st.cons = Math.max(1, Math.min(5, st.cons + +c.dataset.c)); S.log(st.cons > P ? `${st.cons} consumers but only ${P} partitions: ${st.cons - P} sit idle. Partitions cap how many consumers can share the work.` : `Rebalanced: ${st.cons} consumer${st.cons > 1 ? "s" : ""} now split ${P} partitions.`); paint(); return; }
      if (e.target.closest("[data-consume]")) return consume(); if (e.target.closest("[data-reset]")) return reset();
      if (e.target.closest("[data-play]")) st.run = tick(produce, 160, 9, () => S.log("Same colour = same key = same partition, so each user's events stay in order.")); });
    paint();
  },
  mq(el) { // a queue with two workers; a crashed worker's message comes back after the visibility timeout; 3 tries → dead letter queue
    const st = { q: [], fly: [], done: 0, dlq: 0, retries: 0, n: 0, crash: 0.3, run: null };
    const S = toolShell(el, { head: "Two workers, a 3-tick visibility timeout, 3 tries before the dead letter queue.", play: "Run 12 jobs", hint: "some workers crash mid-job",
      body: `<div class="lrow"><span class="lhint">Crash chance</span><span class="tseg">${[0, 0.3, 0.7].map(v => `<button type="button" data-cr="${v}" class="${v === 0.3 ? "on" : ""}">${Math.round(v * 100)}%</button>`).join("")}</span></div><div class="mqv"><div><span class="lhint">Queue</span><div class="mqq"></div></div><div><span class="lhint">In flight (hidden)</span><div class="mqf"></div></div><div><span class="lhint">Dead letters</span><div class="mqd"></div></div></div>`, log: "A message stays hidden while a worker has it, and comes back if no one deletes it in time.", stats: [["done", "jobs done"], ["retry", "retries"], ["dlq", "in dead letter queue"]] });
    const chip = m => `<i title="job ${m.id}, try ${m.tries}">${m.id}${m.tries > 1 ? `<sup>${m.tries}</sup>` : ""}</i>`;
    const paint = () => { el.querySelector(".mqq").innerHTML = st.q.map(chip).join(""); el.querySelector(".mqf").innerHTML = st.fly.map(f => chip(f.m)).join(""); el.querySelector(".mqd").innerHTML = Array.from({ length: st.dlq }, () => "<i>!</i>").join(""); S.stat("done", st.done); S.stat("retry", st.retries); S.stat("dlq", st.dlq); };
    const step = i => { if (i < 12) st.q.push({ id: ++st.n, tries: 0 });
      st.fly.forEach(f => f.t--); const back = st.fly.filter(f => f.t <= 0); st.fly = st.fly.filter(f => f.t > 0);
      back.forEach(f => { if (f.ok) { st.done++; } else if (f.m.tries >= 3) { st.dlq++; S.log(`Job ${f.m.id} failed 3 times, so it moved to the dead letter queue for a person to look at.`); } else { st.q.unshift(f.m); st.retries++; S.log(`Job ${f.m.id}'s worker crashed. After the timeout it became visible again and will be retried.`); } });
      while (st.fly.length < 2 && st.q.length) { const m = st.q.shift(); m.tries++; st.fly.push({ m, t: 3, ok: Math.random() >= st.crash }); }
      paint(); };
    const reset = () => { clearInterval(st.run); Object.assign(st, { q: [], fly: [], done: 0, dlq: 0, retries: 0, n: 0 }); S.log("A message stays hidden while a worker has it, and comes back if no one deletes it in time."); paint(); };
    el.addEventListener("click", e => { const c = e.target.closest("[data-cr]"); if (c) { st.crash = +c.dataset.cr; el.querySelectorAll("[data-cr]").forEach(b => b.classList.toggle("on", b === c)); return; }
      if (e.target.closest("[data-reset]")) return reset();
      if (e.target.closest("[data-play]")) { reset(); st.run = tick(step, 220, 40, () => S.log(`Finished: ${st.done} done, ${st.retries} retries, ${st.dlq} in the dead letter queue. Retries mean a job can run twice, so workers should be idempotent.`)); } });
    paint();
  },
  sqlindex(el) { // full table scan vs a B-tree lookup, on any table size
    const SIZES = [1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9], FAN = 300;
    const S = toolShell(el, { head: "Find one row by its id. Example B-tree: about 300 keys per page.", body: `<label class="rng"><span>Rows in the table</span><input type="range" min="0" max="6" value="3" data-rows><b data-rl></b></label><div class="cmpb"><div><span>Without an index</span><i class="bar scan"></i><em data-scan></em></div><div><span>With a B-tree index</span><i class="bar idx"></i><em data-idx></em></div></div>`,
      log: "", stats: [["scan", "rows read, no index"], ["pages", "pages read, index"], ["x", "times less work"]] });
    S.q("[data-play]") && S.q("[data-play]").remove();
    const fmt = n => n >= 1e9 ? n / 1e9 + " billion" : n >= 1e6 ? n / 1e6 + " million" : n.toLocaleString("en");
    const paint = () => { const N = SIZES[+S.q("[data-rows]").value], depth = Math.max(1, Math.ceil(Math.log(N) / Math.log(FAN))), pages = depth + 1;
      S.q("[data-rl]").textContent = fmt(N); S.q("[data-scan]").textContent = `checks up to ${fmt(N)} rows`; S.q("[data-idx]").textContent = `${depth} level${depth > 1 ? "s" : ""} down the tree + 1 table page`;
      S.q(".bar.scan").style.width = "100%"; S.q(".bar.idx").style.width = Math.max(1.5, pages / N * 100) + "%";
      S.stat("scan", fmt(N)); S.stat("pages", pages); S.stat("x", Math.round(N / pages).toLocaleString("en"));
      S.log(`The tree is only ${depth} level${depth > 1 ? "s" : ""} deep, because each page fans out to ~${FAN} children. Going from ${fmt(N / 10 >= 1e3 ? N / 10 : N)} to ${fmt(N)} rows barely changes the lookup - that is why indexes matter at scale.`); };
    el.addEventListener("input", e => { if (e.target.matches("[data-rows]")) paint(); });
    el.addEventListener("click", e => { if (e.target.closest("[data-reset]")) { S.q("[data-rows]").value = 3; paint(); } });
    paint();
  },
  quorum(el) { // N replicas, choose W and R, take nodes down
    const st = { n: 3, w: 2, r: 2, down: new Set() };
    const S = toolShell(el, { head: "Each row is copied to N replicas. A write waits for W of them, a read asks R of them.",
      body: `<div class="qset">${["n", "w", "r"].map(k => `<label class="rng"><span>${k === "n" ? "N replicas" : k === "w" ? "W (write acks)" : "R (read replies)"}</span><input type="range" min="1" max="5" value="${st[k]}" data-q="${k}"><b data-qv="${k}"></b></label>`).join("")}</div><div class="ring"></div><p class="lhint">Tap a replica to take it down.</p>`,
      log: "", stats: [["fresh", "reads see the latest write?"], ["wok", "writes still work?"], ["rok", "reads still work?"]] });
    S.q("[data-play]") && S.q("[data-play]").remove();
    const paint = () => { st.w = Math.min(st.w, st.n); st.r = Math.min(st.r, st.n); ["n", "w", "r"].forEach(k => { S.q(`[data-q="${k}"]`).value = st[k]; S.q(`[data-q="${k}"]`).max = k === "n" ? 5 : st.n; S.q(`[data-qv="${k}"]`).textContent = st[k]; });
      [...st.down].forEach(i => { if (i >= st.n) st.down.delete(i); });
      const up = st.n - st.down.size;
      S.q(".ring").innerHTML = Array.from({ length: st.n }, (_, i) => `<button type="button" data-node="${i}" class="${st.down.has(i) ? "dn" : ""}">${st.down.has(i) ? "down" : "R" + (i + 1)}</button>`).join("");
      const fresh = st.r + st.w > st.n; S.stat("fresh", fresh ? "Yes" : "Not always"); S.stat("wok", up >= st.w ? "Yes" : "No"); S.stat("rok", up >= st.r ? "Yes" : "No");
      S.log(`${fresh ? `<b class="h">R + W > N</b> (${st.r} + ${st.w} > ${st.n}): every read overlaps at least one replica that has the newest write.` : `<b class="m">R + W ≤ N</b> (${st.r} + ${st.w} ≤ ${st.n}): a read can miss the newest write - faster, but eventually consistent.`} With ${st.down.size} down, writes ${up >= st.w ? "still succeed" : "fail"} and reads ${up >= st.r ? "still succeed" : "fail"}.`); };
    el.addEventListener("input", e => { const k = e.target.dataset.q; if (k) { st[k] = +e.target.value; paint(); } });
    el.addEventListener("click", e => { const nd = e.target.closest("[data-node]"); if (nd) { const i = +nd.dataset.node; st.down.has(i) ? st.down.delete(i) : st.down.add(i); paint(); return; } if (e.target.closest("[data-reset]")) { Object.assign(st, { n: 3, w: 2, r: 2 }); st.down.clear(); paint(); } });
    paint();
  },
  cdn(el) { // a minute of traffic through an edge cache; the file changes at 30 s
    const st = { ttl: 20, run: null };
    const S = toolShell(el, { head: "60 seconds, 2 requests a second, through one edge. The file changes at 30 s.", play: "Play the minute", hint: "then change the TTL",
      body: `<label class="rng"><span>Cache TTL (max-age)</span><input type="range" min="0" max="60" step="5" value="20" data-ttl><b data-tl>20 s</b></label><div class="tl"></div>`, log: "Longer TTL = fewer trips to the origin, but more time serving an old copy.", stats: [["hit", "hit ratio at the edge"], ["origin", "origin requests"], ["stale", "old copies served after the change"]] });
    const sim = () => { let cachedAt = -1e9, ver = 0, cv = -1, hit = 0, org = 0, stale = 0; const cells = [];
      for (let s = 0; s < 60; s++) { if (s === 30) ver = 1; for (let k = 0; k < 2; k++) { const fresh = st.ttl > 0 && s - cachedAt < st.ttl; if (fresh) { hit++; if (cv < ver) stale++; cells.push(cv < ver ? "s" : "h"); } else { org++; cachedAt = s; cv = ver; cells.push("o"); } } }
      return { hit, org, stale, cells }; };
    const paint = (upto = 120) => { const r = sim(); S.q("[data-tl]").textContent = st.ttl + " s"; S.q(".tl").innerHTML = r.cells.map((c, i) => `<i class="${i < upto ? c : ""}${i === 60 ? " chg" : ""}"></i>`).join("");
      S.stat("hit", Math.round(r.hit / 120 * 100) + "%"); S.stat("origin", r.org); S.stat("stale", r.stale); return r; };
    el.addEventListener("input", e => { if (e.target.matches("[data-ttl]")) { st.ttl = +e.target.value; const r = paint(); S.log(st.ttl === 0 ? "TTL 0: every request goes to the origin. Always fresh, no savings." : `TTL ${st.ttl} s: ${r.org} of 120 requests reach the origin; ${r.stale} served the old file after the change. Purging on deploy, or versioned file names, gives both.`); } });
    el.addEventListener("click", e => { if (e.target.closest("[data-reset]")) { st.ttl = 20; S.q("[data-ttl]").value = 20; paint(); return; }
      if (e.target.closest("[data-play]")) { clearInterval(st.run); st.run = tick(i => paint(i + 1), 25, 120, () => S.log("Green = served at the edge, grey = fetched from the origin, orange = old copy after the change.")); } });
    paint();
  },
  vector(el) { // words placed by meaning; find nearest neighbours exactly or by walking a graph
    const P = [["cat", 18, 22], ["kitten", 22, 18], ["dog", 26, 30], ["puppy", 30, 25], ["lion", 14, 34], ["car", 74, 20], ["truck", 80, 28], ["bus", 70, 32], ["bike", 66, 14], ["train", 84, 18], ["apple", 30, 74], ["pear", 36, 80], ["banana", 24, 82], ["mango", 40, 70], ["bread", 50, 86], ["rocket", 88, 60], ["plane", 80, 50], ["boat", 64, 46], ["pizza", 56, 76], ["tiger", 10, 26]];
    const st = { q: [33, 40], k: 3, mode: "exact" };
    const S = toolShell(el, { head: "Words placed by meaning (a 2D toy - real embeddings have hundreds of dimensions). Tap to place a query.", seg: [["exact", "Exact", "Compare against every point"], ["ann", "Graph walk", "Hop through a neighbour graph like HNSW"]], segOn: "exact",
      body: `<svg class="vec" viewBox="0 0 100 100" role="img" aria-label="Embedding space"></svg><label class="rng"><span>k (results)</span><input type="range" min="1" max="6" value="3" data-k><b data-kv>3</b></label>`, log: "", stats: [["hits", "nearest words"], ["cmp", "points compared"], ["of", "of all points"]] });
    S.q("[data-play]") && S.q("[data-play]").remove();
    const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const G = P.map((p, i) => P.map((x, j) => [j, d([p[1], p[2]], [x[1], x[2]])]).filter(x => x[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 4).map(x => x[0]));
    const HUB = [0, 5, 10, 15]; // upper layer: a few far-apart points linked to each other, like HNSW's top layer
    const search = () => { const q = st.q, D = i => d(q, [P[i][1], P[i][2]]); if (st.mode === "exact") return { res: P.map((p, i) => [i, D(i)]).sort((a, b) => a[1] - b[1]).slice(0, st.k).map(x => x[0]), seen: new Set(P.map((_, i) => i)) };
      const seen = new Set(HUB); let entry = HUB.reduce((b, i) => D(i) < D(b) ? i : b, HUB[0]); // 1) pick the closest hub on the top layer
      const ef = Math.max(st.k, 5); let cand = [[entry, D(entry)]], best = [[entry, D(entry)]]; // 2) best-first search on the bottom layer, keeping ef candidates
      while (cand.length) { cand.sort((a, b) => a[1] - b[1]); const [c, dc] = cand.shift(); const worst = best.length >= ef ? best[best.length - 1][1] : Infinity; if (dc > worst) break;
        for (const n of G[c]) { if (seen.has(n)) continue; seen.add(n); const dn = D(n); if (best.length < ef || dn < best[best.length - 1][1]) { cand.push([n, dn]); best.push([n, dn]); best.sort((a, b) => a[1] - b[1]); if (best.length > ef) best.pop(); } } }
      return { res: best.slice(0, st.k).map(x => x[0]), seen }; };
    const paint = () => { const { res, seen } = search(), set = new Set(res);
      S.q(".vec").innerHTML = res.map(i => `<line x1="${st.q[0]}" y1="${st.q[1]}" x2="${P[i][1]}" y2="${P[i][2]}" class="vl"/>`).join("") + P.map((p, i) => `<g class="${set.has(i) ? "hit" : seen.has(i) && st.mode === "ann" ? "seen" : ""}"><circle cx="${p[1]}" cy="${p[2]}" r="1.6"/><text x="${p[1] + 2.4}" y="${p[2] + 1.2}">${p[0]}</text></g>`).join("") + `<circle class="vq" cx="${st.q[0]}" cy="${st.q[1]}" r="2.4"/>`;
      S.q("[data-kv]").textContent = st.k; S.stat("hits", res.map(i => P[i][0]).join(", ")); S.stat("cmp", seen.size); S.stat("of", P.length);
      S.log(st.mode === "exact" ? "Exact search compares the query with every point: perfect results, slow on millions." : `The graph walk compared ${seen.size} of ${P.length} points. On huge sets that saving is everything - at the cost of sometimes missing a true neighbour.`); };
    S.q(".vec").addEventListener("click", e => { const r = e.currentTarget.getBoundingClientRect(); st.q = [(e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100]; paint(); });
    el.addEventListener("input", e => { if (e.target.matches("[data-k]")) { st.k = +e.target.value; paint(); } });
    el.addEventListener("click", e => { const g = e.target.closest("[data-seg]"); if (g) { st.mode = g.dataset.seg; S.seg(st.mode); paint(); } if (e.target.closest("[data-reset]")) { st.q = [33, 40]; st.k = 3; S.q("[data-k]").value = 3; paint(); } });
    paint();
  },
  llm(el) { // tokens in, tokens out: context fill, time and cost
    const st = { inp: 2000, out: 500, tps: 60, ttft: 0.6, pin: 3, pout: 15, ctx: 200000 };
    const S = toolShell(el, { head: "Plan one LLM call. Prices are examples - use your provider's.", body: `<div class="qset">${[["inp", "Prompt tokens", 100, 150000, 100], ["out", "Output tokens", 50, 8000, 50], ["tps", "Output speed (tokens/s)", 10, 200, 5]].map(([k, l, a, b, s]) => `<label class="rng"><span>${l}</span><input type="range" min="${a}" max="${b}" step="${s}" value="${st[k]}" data-l="${k}"><b data-lv="${k}"></b></label>`).join("")}</div>
      <div class="lrow"><label class="pin">$ per 1M input <input type="number" min="0" step="0.1" value="${st.pin}" data-p="pin"></label><label class="pin">$ per 1M output <input type="number" min="0" step="0.1" value="${st.pout}" data-p="pout"></label></div><div class="ctxb"><i class="ci"></i><i class="co"></i></div><p class="lhint" data-ctxl></p>`,
      log: "", stats: [["time", "total time"], ["cost", "cost per call"], ["k", "cost per 1,000 calls"]] });
    S.q("[data-play]") && S.q("[data-play]").remove();
    const paint = () => { ["inp", "out", "tps"].forEach(k => { S.q(`[data-lv="${k}"]`).textContent = st[k].toLocaleString("en"); });
      const t = st.ttft + st.out / st.tps, c = st.inp / 1e6 * st.pin + st.out / 1e6 * st.pout;
      S.q(".ci").style.width = Math.min(100, st.inp / st.ctx * 100) + "%"; S.q(".co").style.width = Math.min(100 - Math.min(100, st.inp / st.ctx * 100), st.out / st.ctx * 100) + "%";
      S.q("[data-ctxl]").textContent = `Uses ${((st.inp + st.out) / st.ctx * 100).toFixed(1)}% of an example ${st.ctx.toLocaleString("en")}-token context window.`;
      S.stat("time", t.toFixed(1) + " s"); S.stat("cost", "$" + c.toFixed(c < 0.01 ? 4 : 3)); S.stat("k", "$" + (c * 1000).toFixed(2));
      S.log(`Output tokens drive the wait: ${st.out.toLocaleString("en")} tokens at ${st.tps}/s is ${(st.out / st.tps).toFixed(1)} s after the first token. Streaming shows words as they come, so it feels faster. A cached prompt prefix cuts both input cost and time to first token.`); };
    el.addEventListener("input", e => { const k = e.target.dataset.l, p = e.target.dataset.p; if (k) st[k] = +e.target.value; if (p) st[p] = Math.max(0, +e.target.value || 0); if (k || p) paint(); });
    el.addEventListener("click", e => { if (e.target.closest("[data-reset]")) { Object.assign(st, { inp: 2000, out: 500, tps: 60, pin: 3, pout: 15 }); el.querySelectorAll("[data-l]").forEach(i => { i.value = st[i.dataset.l]; }); el.querySelectorAll("[data-p]").forEach(i => { i.value = st[i.dataset.p]; }); paint(); } });
    paint();
  },
  agent(el) { // the agent loop, step by step, with a step limit and a human approval gate
    const PLAN = [["think", "I need flight prices for Friday, London to Paris."], ["tool", "search_flights(from=LHR, to=CDG, date=Fri)"], ["obs", "3 results: 09:10 £89, 12:40 £74, 18:05 £112"], ["think", "The 12:40 is cheapest. Booking spends money, so ask first."], ["ask", "Approve booking the 12:40 for £74?"], ["tool", "book_flight(id=BA306)"], ["obs", "Booked. Reference X7K2Q."], ["done", "Booked the 12:40 to Paris for £74, ref X7K2Q."]];
    const st = { i: 0, max: 6, gate: true, run: null };
    const S = toolShell(el, { head: "Task: book the cheapest Friday flight from London to Paris.", play: "Run the agent", hint: "or step through it",
      body: `<div class="lrow"><button class="chip" type="button" data-step>Next step</button><label class="tog2"><input type="checkbox" data-gate checked> Human approval for spending</label><label class="rng sm"><span>Step limit</span><input type="range" min="3" max="10" value="6" data-max><b data-mv>6</b></label></div><ol class="trace"></ol>`, log: "An agent repeats: think, call a tool, look at the result - until the task is done or a limit is hit.", stats: [["steps", "steps used"], ["tools", "tool calls"], ["state", "status"]] });
    const plan = () => PLAN.filter(p => st.gate || p[0] !== "ask");
    const paint = () => { const pl = plan(), shown = pl.slice(0, st.i); S.q(".trace").innerHTML = shown.map(([k, t]) => `<li class="tr-${k}"><b>${{ think: "Think", tool: "Tool call", obs: "Result", ask: "Asks you", done: "Done" }[k]}</b><code>${t.replace(/[<>&]/g, "")}</code></li>`).join("");
      const steps = shown.filter(p => p[0] !== "obs").length, tools = shown.filter(p => p[0] === "tool").length, end = st.i >= pl.length;
      S.q("[data-mv]").textContent = st.max; S.stat("steps", steps); S.stat("tools", tools); S.stat("state", end ? "Done" : steps >= st.max ? "Stopped" : st.i ? "Working" : "Ready"); return { steps, end }; };
    const next = () => { const pl = plan(); const r = paint(); if (r.end) return false; if (r.steps >= st.max) { S.log("Hit the step limit, so the agent stopped and reports back. Limits keep a confused agent from looping forever."); return false; }
      st.i++; const cur = pl[st.i - 1]; S.log(cur[0] === "ask" ? "Spending money is a risky action, so the agent pauses for a person to approve." : cur[0] === "tool" ? "The model asks your code to run a tool; your code runs it and returns the result." : cur[0] === "done" ? "The goal is met, so the loop ends with a clear answer." : cur[0] === "obs" ? "The tool result goes back into the conversation for the next thought." : "The model plans the next move from everything so far."); paint(); return true; };
    const reset = () => { clearInterval(st.run); st.i = 0; S.log("An agent repeats: think, call a tool, look at the result - until the task is done or a limit is hit."); paint(); };
    el.addEventListener("change", e => { if (e.target.matches("[data-gate]")) { st.gate = e.target.checked; reset(); } });
    el.addEventListener("input", e => { if (e.target.matches("[data-max]")) { st.max = +e.target.value; paint(); } });
    el.addEventListener("click", e => { if (e.target.closest("[data-step]")) return next(); if (e.target.closest("[data-reset]")) return reset();
      if (e.target.closest("[data-play]")) { reset(); const go = () => { if (next()) st.run = setTimeout(go, RM() ? 0 : 900); }; go(); } });
    paint();
  },
});
