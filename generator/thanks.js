let tierId = "";
try { tierId = new URLSearchParams(location.search).get("tier") || ""; const c = SP.companies.find(x => x.id === tierId) || SP.people.find(x => x.id === tierId); if (c) $("#tl").textContent = `You're now a ${c.name} sponsor. Here's what happens next. You don't need to do anything.`; } catch (e) {}
/* conversion event for the sponsor funnel (GoatCounter, no cookies) */
if (SP.goatcounter) {
  let ab = "a"; try { ab = localStorage.getItem("sdk-ab-hero") || "a"; } catch (e) {}
  const s = document.createElement("script"); s.async = true; s.src = "https://gc.zgo.at/count.js"; s.dataset.goatcounter = `https://${SP.goatcounter}.goatcounter.com/count`;
  s.onload = () => setTimeout(() => { try { goatcounter.count({ path: `sp-paid/${ab}/${tierId || "unknown"}`, title: "sponsor paid", event: true }); } catch (e) {} }, 300);
  document.head.append(s);
}
