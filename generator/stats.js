const q = new URLSearchParams(location.search).get("s");
const PLACE = { featured: "Homepage under the search · README top · sponsor row", gold: "Homepage sponsor row (large) · README", silver: "Homepage sponsor row · README", bronze: "README · Backers", supporter: "README", backer: "Backers list", coffee: "Thank-you" };
const n = v => (v || 0).toLocaleString();
Promise.all([fetch("../../sponsors.json", { cache: "no-cache" }).then(r => r.json()).catch(() => ({ sponsors: [] })), fetch("../../stats.json", { cache: "no-cache" }).then(r => r.ok ? r.json() : {}).catch(() => ({}))]).then(([sj, st]) => {
  const list = (sj.sponsors || []).filter(x => x.org !== false), S = st.sponsors || {};
  $("#sf").textContent = st.updated ? `Last updated ${new Date(st.updated).toLocaleString()}. Views count once per visit when the logo is on screen; clicks count every visit to your link.` : "Stats start counting as soon as the first sponsor is live.";
  const me = q && list.find(x => (x.login || x.name).toLowerCase() === q.toLowerCase());
  if (me) {
    const m = S[me.login || me.name] || {}, ctr = m.views30 ? ((m.clicks30 || 0) / m.views30 * 100).toFixed(1) + "%" : "-";
    $("#sl").textContent = "Your results on the System Design Kit.";
    $("#sv").innerHTML = `<div class="who">${me.logo ? `<img src="${esc(me.logo)}" alt="">` : ""}<div style="text-align:left"><b>${esc(me.name)}</b><small>${esc(me.tier)} · ${esc(PLACE[me.tier] || "")}</small></div></div>
      <div class="kpis"><div class="kpi"><span>Logo views</span><b>${n(m.views30)}</b><small>last 30 days</small></div><div class="kpi"><span>Clicks to your site</span><b>${n(m.clicks30)}</b><small>last 30 days</small></div><div class="kpi"><span>Click rate</span><b>${ctr}</b><small>clicks ÷ views</small></div><div class="kpi"><span>All-time clicks</span><b>${n(m.clicksAll)}</b><small>${n(m.viewsAll)} views</small></div></div>`;
  } else if (list.length) {
    $("#sv").innerHTML = `<div class="list">${list.map(x => { const m = S[x.login || x.name] || {}; return `<a href="?s=${encodeURIComponent(x.login || x.name)}"><span>${esc(x.name)} <small>${esc(x.tier)}</small></span><small>${n(m.views30)} views · ${n(m.clicks30)} clicks</small></a>`; }).join("")}</div>`;
  } else {
    $("#sv").innerHTML = `<p class="lead">This page lights up with your results as soon as you sponsor. <a href="../">Be the first</a>.</p>`;
  }
});
