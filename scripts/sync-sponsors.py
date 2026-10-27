"""Pull current GitHub sponsors and update the site + README automatically.
Runs in .github/workflows/sponsors.yml. Needs a token in SPONSORS_TOKEN (or GITHUB_TOKEN)."""
import json, os, subprocess, sys, urllib.request, datetime, smtplib, ssl
from email.message import EmailMessage
EMAILS = {}
SOURCES = {}  # private: where each card sponsor came from (sp_<variant>_<tier>) + billing interval

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = os.path.join(ROOT, 'generator', 'sponsor.json')
cfg0 = json.load(open(CFG)) if os.path.exists(CFG) else {}
LOGIN = json.load(open(CFG)).get('github') or 'Dinesh-Sunny'
TOKEN = os.environ.get('SPONSORS_TOKEN') or os.environ.get('GITHUB_TOKEN')
Q = '''query($login:String!,$after:String){ user(login:$login){ sponsorshipsAsMaintainer(first:100, after:$after, activeOnly:true){
  pageInfo{hasNextPage endCursor}
  nodes{ isOneTimePayment privacyLevel tier{monthlyPriceInDollars isOneTime}
    sponsorEntity{ __typename ... on User{login name avatarUrl websiteUrl url} ... on Organization{login name avatarUrl websiteUrl url} } } } } }'''

def gql(after=None):
    req = urllib.request.Request('https://api.github.com/graphql', method='POST',
        data=json.dumps({'query': Q, 'variables': {'login': LOGIN, 'after': after}}).encode(),
        headers={'Authorization': f'bearer {TOKEN}', 'Content-Type': 'application/json', 'User-Agent': 'sponsors-sync'})
    return json.load(urllib.request.urlopen(req))

def tier_of(n):
    amt = (n.get('tier') or {}).get('monthlyPriceInDollars') or 0
    if n.get('isOneTimePayment') or (n.get('tier') or {}).get('isOneTime'): return ('backer' if amt >= 25 else 'coffee'), amt
    for t, floor in (('featured', 600), ('gold', 300), ('silver', 150), ('bronze', 50), ('supporter', 15)):
        if amt >= floor: return t, amt
    return 'backer', amt

nodes, after = [], None
while True:
    r = gql(after)
    if 'errors' in r: print('GraphQL errors:', r['errors']); sys.exit(1)
    page = r['data']['user']['sponsorshipsAsMaintainer']; nodes += page['nodes']
    if not page['pageInfo']['hasNextPage']: break
    after = page['pageInfo']['endCursor']

sponsors = []
for n in nodes:
    e = n.get('sponsorEntity')
    if not e or n.get('privacyLevel') == 'PRIVATE': continue
    t, amt = tier_of(n)
    sponsors.append({'name': e.get('name') or e['login'], 'login': e['login'], 'url': e.get('websiteUrl') or e['url'],
                     'logo': e['avatarUrl'], 'tier': t, 'amount': amt, 'org': e['__typename'] == 'Organization'})
# ---- card sponsors (Stripe Payment Links), only when STRIPE_KEY is set ----
SK = os.environ.get('STRIPE_KEY')
if SK:
    import urllib.parse, base64
    def stripe(path, params):
        q = urllib.parse.urlencode(params, doseq=True)
        req = urllib.request.Request(f'https://api.stripe.com/v1/{path}?{q}', headers={'Authorization': 'Basic ' + base64.b64encode((SK + ':').encode()).decode()})
        return json.load(urllib.request.urlopen(req))
    after = None
    while True:
        params = {'limit': 100, 'status': 'complete', 'expand[]': ['data.subscription']}
        if after: params['starting_after'] = after
        page = stripe('checkout/sessions', params)
        for cs in page['data']:
            sub = cs.get('subscription')
            if cs.get('mode') != 'subscription' or not isinstance(sub, dict) or sub.get('status') not in ('active', 'trialing', 'past_due'): continue
            items = sub['items']['data']
            keys = [(it['price'].get('lookup_key') or '') for it in items]
            if any(keys) and not any(k.startswith('sdkit_') for k in keys): continue  # another project on the same Stripe account
            raw = {x['key']: ((x.get('text') or {}).get('value') or '').strip() for x in (cs.get('custom_fields') or [])}
            f = {want: next((v for k, v in raw.items() if want in k.lower()), '') for want in ('company', 'website', 'github', 'name')}
            # monthly equivalent: yearly prices are 10 months (2 free)
            amt = sum((it['price'].get('unit_amount') or 0) * (it.get('quantity') or 1) / (10 if ((it['price'].get('recurring') or {}).get('interval') == 'year') else 1) for it in items) // 100
            lk = next((k for k in keys if k.startswith('sdkit_')), '')
            org = f.get('github', '').replace('https://github.com/', '').strip('/@ ')
            site = f.get('website', '')
            if site and not site.startswith('http'): site = 'https://' + site
            host = urllib.parse.urlparse(site).netloc if site else ''
            co = amt >= 50  # company tiers carry a logo; people tiers carry a name
            who = (cs.get('customer_details') or {}).get('name') or ''
            name = (f.get('company') or org or host or 'Sponsor') if co else (f.get('name') or org or who.split(' ')[0] or 'Backer')
            # best logo: GitHub org avatar, else unavatar.io (finds the site's real logo), falling back to the site icon
            logo = f'https://github.com/{org}.png?size=128' if org else (f'https://unavatar.io/{host}?fallback=https://www.google.com/s2/favicons%3Fdomain%3D{host}%26sz%3D128' if host else '')
            t, _ = tier_of({'tier': {'monthlyPriceInDollars': amt}})
            if lk.split('_')[1:2] and lk.split('_')[1] in ('featured', 'gold', 'silver', 'bronze', 'supporter', 'backer'): t = lk.split('_')[1]
            k = org or host or name
            if (cs.get('customer_details') or {}).get('email'): EMAILS[k] = cs['customer_details']['email']
            SOURCES[k] = f"{cs.get('client_reference_id') or 'direct'}, {'yearly' if any(((it['price'].get('recurring') or {}).get('interval') == 'year') for it in items) else 'monthly'}"
            sponsors.append({'name': name, 'login': k, 'url': site or (f'https://github.com/{org}' if org else ''), 'logo': logo, 'tier': t, 'amount': amt, 'org': co, 'since': sub.get('start_date') or 0})
        if not page.get('has_more'): break
        after = page['data'][-1]['id']

sponsors.sort(key=lambda x: (-x['amount'], x.get('since', 0)))
# only one Featured at a time: the earliest keeps it, the rest show as Gold (terms: refund the difference)
seen, bumped = False, []
for s in sponsors:
    if s['tier'] == 'featured':
        if seen: s['tier'] = 'gold'; bumped.append(s['name'])
        seen = True
for s in sponsors: s.pop('amount'); s.pop('since', None)
# manual logo fixes (sponsor replied with a better logo): sponsor.json "logos": {"<login>": "https://..."}
for s in sponsors:
    if (cfg0.get('logos') or {}).get(s['login']): s['logo'] = cfg0['logos'][s['login']]

SPJ_PATH = os.path.join(ROOT, 'docs', 'sponsors.json')
prev = (json.load(open(SPJ_PATH)).get('sponsors') or []) if os.path.exists(SPJ_PATH) else []
cfg = json.load(open(CFG)); cfg['sponsors'] = sponsors
json.dump(cfg, open(CFG, 'w'), indent=2, ensure_ascii=False)
json.dump({'sponsors': sponsors}, open(os.path.join(ROOT, 'docs', 'sponsors.json'), 'w'), indent=1, ensure_ascii=False)
subprocess.run([sys.executable, os.path.join(ROOT, 'generator', 'readme-sponsors.py'), ROOT], check=True)
print(len(sponsors), 'public sponsors')
# ---------------- stats (GoatCounter) ----------------
SITE = 'https://dinesh-sunny.github.io/excalidraw-system-design-kit/'
PORTAL = 'https://billing.stripe.com/p/login/14A28qgzU3mMf5E68RgjC00'
# next tier up: what it adds, used in welcome + monthly emails (Featured only when free)
UP = {'backer': ('Supporter', 10, 'your name in the README and new packs first'),
      'supporter': ('Bronze', 35, 'your company logo in the README'),
      'bronze': ('Silver', 100, 'your logo on the kit homepage too'),
      'silver': ('Gold', 150, 'a bigger logo on the homepage and README'),
      'gold': ('Featured', 300, 'the spot under the homepage search and top of the README')}
def nudge(sp):
    u = UP.get(sp['tier'])
    if not u or (u[0] == 'Featured' and any(x['tier'] == 'featured' for x in sponsors)): return ''
    return f"\nWant more reach? {u[0]} adds {u[2]}, for ${u[1]} more a month. Switch in one click: {PORTAL}\n"
STATS = os.path.join(ROOT, 'docs', 'stats.json')
prev_stats = json.load(open(STATS)) if os.path.exists(STATS) else {'sponsors': {}}
GC, GT = cfg.get('goatcounter'), os.environ.get('GOATCOUNTER_TOKEN')
today = datetime.date.today()
if GC and GT:
    def hits(start):
        out, seen_ids = {}, []
        while True:
            u = f'https://{GC}.goatcounter.com/api/v0/stats/hits?start={start}T00:00:00Z&limit=100' + ''.join(f'&exclude_paths={i}' for i in seen_ids)
            r = json.load(urllib.request.urlopen(urllib.request.Request(u, headers={'Authorization': f'Bearer {GT}', 'Content-Type': 'application/json'})))
            for h in r.get('hits', []):
                p = h['path'].lstrip('/'); out[p] = out.get(p, 0) + (h.get('count') or 0); seen_ids.append(h['path_id'])
            if not r.get('more') or not r.get('hits'): return out
    try:
        h30 = hits((today - datetime.timedelta(days=30)).isoformat()); hall = hits('2026-10-01')
        st = {}
        for sp in sponsors:
            k = sp['login'] or sp['name']
            st[k] = {'views30': h30.get('sponsor-view/' + k, 0), 'clicks30': h30.get('sponsor-click/' + k, 0), 'viewsAll': hall.get('sponsor-view/' + k, 0), 'clicksAll': hall.get('sponsor-click/' + k, 0)}
        if st != prev_stats.get('sponsors'): prev_stats.update({'updated': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='minutes'), 'sponsors': st})
        print('stats ok,', len(h30), 'paths in 30 days')
    except Exception as e:  # analytics must never block sponsor placement or emails
        body = ''
        try: body = e.read().decode()[:200]
        except Exception: pass
        print('::warning::GoatCounter stats skipped:', e, body)

# ---------------- emails (Gmail app password) ----------------
GU, GP = 'dineshiitb.ae18@gmail.com', os.environ.get('GMAIL_APP_PASSWORD')
def send(to, subject, body):
    if not (GP and to): return
    m = EmailMessage(); m['From'] = f'Dinesh Sunny <{GU}>'; m['To'] = to; m['Subject'] = subject; m.set_content(body)
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=ssl.create_default_context()) as s:
        s.login(GU, GP); s.send_message(m)
    print('emailed', to.split('@')[-1], '-', subject)
prev_logins = {x.get('login') or x.get('name') for x in prev}
for sp in sponsors:
    k = sp['login'] or sp['name']
    if k in prev_logins: continue
    stats_link = f'{SITE}sponsor/stats/?s={k}'
    if sp['org']:
        send(EMAILS.get(k), "You're live on the System Design Kit", f"""Hi {sp['name']},

Thank you for sponsoring the System Design Kit. Your logo is now live in the {sp['tier'].title()} spot:

- Site: {SITE}
- README: https://github.com/Dinesh-Sunny/excalidraw-system-design-kit#-sponsors

Your stats (views and clicks, updated every few hours):
{stats_link}

Visits from your logo arrive tagged utm_source=system-design-kit, so they show in your own analytics too.
You'll get a short results email on the 1st of each month. Invoices and receipts come from Stripe.
Change tier, switch to yearly or update your card any time: {PORTAL}
{nudge(sp)}
To change the logo or link, reply to this email.

Thanks for keeping it free,
Dinesh""")
    else:
        extra = '\nAs a supporter you also get new packs early - they arrive by email before release.\n' if sp['tier'] == 'supporter' else ''
        send(EMAILS.get(k), "Thank you for backing the System Design Kit", f"""Hi {sp['name']},

Thank you for backing the System Design Kit. Your name is now in the credits:
https://github.com/Dinesh-Sunny/excalidraw-system-design-kit/blob/main/BACKERS.md
{extra}
{nudge(sp)}To change how your name shows, reply to this email. Receipts come from Stripe; manage or cancel any time: {PORTAL}

Thanks for keeping it free,
Dinesh""")
    send(GU, f"New sponsor: {sp['name']} ({sp['tier']})", f"{sp['name']} is now a {sp['tier']} sponsor.\nLink: {sp['url']}\nSource: {SOURCES.get(k, 'GitHub Sponsors')}\nStats: {stats_link}" + ("\nTo do: thank them in the next release note and on LinkedIn (Featured perk)." if sp['tier'] == 'featured' else ""))
# changes since last run: cancellations and tier moves (portal switches) -> notice to Dinesh
now = {(x.get('login') or x.get('name')): x for x in sponsors}
for x in prev:
    k = x.get('login') or x.get('name')
    if k not in now: send(GU, f"Sponsor ended: {x['name']} ({x['tier']})", f"{x['name']} is no longer an active sponsor, so their {'logo' if x.get('org') else 'name'} was removed from the site, README and BACKERS.md.")
    elif now[k]['tier'] != x['tier']: send(GU, f"Sponsor changed tier: {x['name']} {x['tier']} -> {now[k]['tier']}", f"{x['name']} moved from {x['tier']} to {now[k]['tier']}. Placement updated automatically.")
if bumped and prev_stats.get('bumped') != bumped:
    send(GU, 'Featured clash: refund the difference', 'Featured is already taken, so these show as Gold until it frees up: ' + ', '.join(bumped) + '. Refund the Featured - Gold difference in Stripe (Payments > the payment > Refund), or move them to Gold in the billing portal.')
prev_stats['bumped'] = bumped
month = today.strftime('%Y-%m')
if today.day == 1 and prev_stats.get('report_month') != month and GP:
    for sp in [x for x in sponsors if x['org']]:
        k = sp['login'] or sp['name']; m = prev_stats.get('sponsors', {}).get(k, {})
        ctr = f"{(m.get('clicks30', 0) / m['views30'] * 100):.1f}%" if m.get('views30') else '-'
        send(EMAILS.get(k), f"Your System Design Kit results - {today.strftime('%B %Y')}", f"""Hi {sp['name']},

Last 30 days on the System Design Kit:
- Logo views: {m.get('views30', 0)}
- Clicks to your site: {m.get('clicks30', 0)}
- Click rate: {ctr}

Live stats any time: {SITE}sponsor/stats/?s={k}
{nudge(sp)}

Thank you for keeping the kit free,
Dinesh""")
    prev_stats['report_month'] = month
json.dump(prev_stats, open(STATS, 'w'), indent=1, ensure_ascii=False)

