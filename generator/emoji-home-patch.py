# Adds the Emoji category to the Blocks home (showcase2.tpl.html) and, with --docs, to the deployed docs/index.html the same way.
import sys
IEMO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.5c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8"/><circle cx="9.2" cy="10" r=".6" fill="currentColor"/><circle cx="14.8" cy="10" r=".6" fill="currentColor"/></svg>'
EDITS = [
 ('rail.addEventListener("click", e => { const b = e.target.closest(".cat"); if (!b) return; go(b.dataset.c); });',
  'rail.insertAdjacentHTML("beforeend", `<button class="cat" type="button" data-c="emoji" aria-pressed="${cat === "emoji"}">' + IEMO + '<span>Emoji</span></button>`);\nrail.addEventListener("click", e => { const b = e.target.closest(".cat"); if (!b) return; go(b.dataset.c); });'),
 ('if (LABEL[h]) cat = h;', 'if (LABEL[h] || h === "emoji") cat = h;'),
 ('} else if (LABEL[h] || h === "board") {', '} else if (LABEL[h] || h === "board" || h === "emoji") {'),
 ('  const pk = cat.startsWith("pack:") ? PK[cat.slice(5)] : null;\n',
  '  if (cat === "emoji") { if (window.EMO) EMO.view(rows, term); else rows.innerHTML = `<section class="row"><h2>Emoji</h2><p>Loading the emoji...</p></section>`; if (scroll) $("#main").scrollIntoView({ block: "start" }); return; }\n  const pk = cat.startsWith("pack:") ? PK[cat.slice(5)] : null;\n'),
 ('    else { const g = document.createElement("div"); g.className = "grid"; fill(g, list); sec.append(g); }\n    rows.append(sec);',
  '    else { const g = document.createElement("div"); g.className = "grid"; fill(g, list); sec.append(g); }\n    rows.append(sec); if (term && cat === "all" && window.EMO) EMO.hits(term, sec);'),
 ('</body>', '<script src="emoji/emoji.js" defer></script>\n</body>'),
]
def apply(path):
    s = open(path).read()
    if 'emoji/emoji.js' in s: print(path, 'already patched'); return
    for a, b in EDITS:
        n = s.count(a)
        if a == '</body>':
            if a in s: i = s.rindex(a); s = s[:i] + b + s[i + len(a):]
            else: s = s.rstrip('\n') + '\n' + b.replace('\n</body>', '') + '\n'
            continue
        assert n == 1, (path, n, a[:70]); s = s.replace(a, b)
    open(path, 'w').write(s); print(path, 'patched')
apply('showcase2.tpl.html')
if '--docs' in sys.argv: apply('../docs/index.html')
