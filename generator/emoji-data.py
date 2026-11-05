# Emoji data for the kit: one source (emojibase-data, pinned in package.json) -> the library items (emoji.data.json, read by src/main.js)
# and the site browser (out/pages/emoji/emoji.json). Names follow docs/naming.md: sd:emoji/ <Title Case Name> - <lowercase tags>
import json, re, os
B = 'node_modules/emojibase-data/en/'
D = json.load(open(B + 'data.json')); M = json.load(open(B + 'messages.json'))
GH = json.load(open(B + 'shortcodes/github.json'))
GROUPS = {g['order']: g for g in M['groups']}
SUBS = {s['order']: s['message'] for s in M['subgroups']}
SHORT = {'smileys-emotion': 'smileys', 'people-body': 'people', 'animals-nature': 'animals nature', 'food-drink': 'food drink', 'travel-places': 'travel places',
         'activities': 'activities', 'objects': 'objects', 'symbols': 'symbols', 'flags': 'flags'}
TITLE = {'smileys-emotion': 'Smileys & Emotion', 'people-body': 'People & Body', 'animals-nature': 'Animals & Nature', 'food-drink': 'Food & Drink',
         'travel-places': 'Travel & Places', 'activities': 'Activities', 'objects': 'Objects', 'symbols': 'Symbols', 'flags': 'Flags'}
ICON = {'smileys-emotion': '😀', 'people-body': '👋', 'animals-nature': '🐻', 'food-drink': '🍔', 'travel-places': '✈️', 'activities': '⚽', 'objects': '💡', 'symbols': '❤️', 'flags': '🏁'}
TONE = {1: 'light', 2: 'medium-light', 3: 'medium', 4: 'medium-dark', 5: 'dark'}
SYM = {'#': 'Number Sign', '*': 'Asterisk'}

def title(label):
    label = label.replace('“', '').replace('”', '').replace('"', '')
    label = re.sub(r'keycap: (.)', lambda m: 'keycap ' + SYM.get(m.group(1), m.group(1)), label)
    label = label.replace(': ', ', ')
    def cap(w):
        if any(c.isupper() for c in w) or not w: return w
        return '-'.join(p[:1].upper() + p[1:] for p in w.split('-'))
    return ' '.join(cap(w) for w in label.split(' ')).replace(' - ', ' ')

def words(s): return [w for w in re.split(r'[^a-z0-9]+', s.lower()) if w]
def tagstr(e, grp, extra=()):
    gh = GH.get(e['hexcode']) or []; gh = [gh] if isinstance(gh, str) else gh
    core = [*SHORT[grp['key']].split(), *words(SUBS.get(e.get('subgroup'), ''))]
    more = [x for t in [*e.get('tags', []), *gh] for x in words(t)]
    seen, out, name = set(), [], set(words(e['label']))
    for w in core + [m for m in more if m not in name][:8] + list(extra) + ['emoji']:
        if w not in seen and (w not in name or w in core): seen.add(w); out.append(w)
    return ' '.join(out)

items, site, used = [], [], set()
base = sorted([e for e in D if e.get('group') in GROUPS and GROUPS[e['group']]['key'] != 'component'], key=lambda e: (GROUPS[e['group']]['order'], e.get('order', 0)))
def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
def push(name, ch):
    sid = slug(name)
    if sid in used: raise SystemExit('duplicate id ' + name)
    used.add(sid); items.append([name, ch])
groups = [g for o, g in sorted(GROUPS.items()) if g['key'] != 'component']
gi = {g['order']: i for i, g in enumerate(groups)}
subs, subi = [], {}
for e in base:
    g = GROUPS[e['group']]; t = title(e['label']); tg = tagstr(e, g)
    push(f'sd:emoji/ {t} - {tg}', e['emoji'])
    sk = []
    for s in e.get('skins') or []:
        tones = s['tone'] if isinstance(s['tone'], list) else [s['tone']]
        st = title(s['label']); extra = [w for x in tones for w in TONE[x].split('-')] + ['skin', 'tone']
        push(f'sd:emoji/ {st} - {tagstr(e, g, extra)}', s['emoji'])
        sk.append([''.join(str(x) for x in tones), s['emoji'], st])
    key = (e['group'], e.get('subgroup'))
    if key not in subi: subi[key] = len(subs); subs.append([SUBS.get(e.get('subgroup'), '').capitalize(), gi[e['group']]])
    site.append([e['emoji'], t, subi[key], tg] + ([sk] if sk else []))

json.dump(items, open('emoji.data.json', 'w'), ensure_ascii=False, separators=(',', ':'))
os.makedirs('out/pages/emoji', exist_ok=True)
json.dump({'v': '18.0.0', 'groups': [[g['key'], TITLE[g['key']], ICON[g['key']]] for g in groups], 'subs': subs, 'items': site},
          open('out/pages/emoji/emoji.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('library items', len(items), 'base', len(site), 'subgroups', len(subs), 'site json', os.path.getsize('out/pages/emoji/emoji.json') // 1024, 'KB')
