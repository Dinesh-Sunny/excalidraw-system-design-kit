"""Pull current GitHub sponsors and update the site + README automatically.
Runs in .github/workflows/sponsors.yml. Needs a token in SPONSORS_TOKEN (or GITHUB_TOKEN)."""
import json, os, subprocess, sys, urllib.request, datetime, smtplib, ssl
from email.message import EmailMessage
EMAILS = {}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = os.path.join(ROOT, 'generator', 'sponsor.json')
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
            f = {x['key']: ((x.get('text') or {}).get('value') or '').strip() for x in (cs.get('custom_fields') or [])}
            amt = sum((it['price'].get('unit_amount') or 0) * (it.get('quantity') or 1) for it in sub['items']['data']) // 100
            org = f.get('github', '').replace('https://github.com/', '').strip('/@ ')
            site = f.get('website', '')
            if site and not site.startswith('http'): site = 'https://' + site
            host = urllib.parse.urlparse(site).netloc if site else ''
            name = f.get('company') or org or host or 'Sponsor'
            logo = f'https://github.com/{org}.png?size=128' if org else (f'https://www.google.com/s2/favicons?domain={host}&sz=128' if host else '')
            t, _ = tier_of({'tier': {'monthlyPriceInDollars': amt}})
            if (cs.get('customer_details') or {}).get('email'): EMAILS[org or host] = cs['customer_details']['email']
            sponsors.append({'name': name, 'login': org or host, 'url': site or (f'https://github.com/{org}' if org else ''), 'logo': logo, 'tier': t, 'amount': amt, 'org': True})
        if not page.get('has_more'): break
        after = page['data'][-1]['id']

sponsors.sort(key=lambda x: -x['amount'])
# only one Featured at a time: the rest drop to Gold
seen = False
for s in sponsors:
    if s['tier'] == 'featured':
        if seen: s['tier'] = 'gold'
        seen = True
for s in sponsors: s.pop('amount')

SPJ_PATH = os.path.join(ROOT, 'docs', 'sponsors.json')
prev = (json.load(open(SPJ_PATH)).get('sponsors') or []) if os.path.exists(SPJ_PATH) else []
cfg = json.load(open(CFG)); cfg['sponsors'] = sponsors
json.dump(cfg, open(CFG, 'w'), indent=2, ensure_ascii=False)
json.dump({'sponsors': sponsors}, open(os.path.join(ROOT, 'docs', 'sponsors.json'), 'w'), indent=1, ensure_ascii=False)
subprocess.run([sys.executable, os.path.join(ROOT, 'generator', 'readme-sponsors.py'), ROOT], check=True)
print(len(sponsors), 'public sponsors')
# ---------------- stats (GoatCounter) ----------------
SITE = 'https://dinesh-sunny.github.io/excalidraw-system-design-kit/'
STATS = os.path.join(ROOT, 'docs', 'stats.json')
prev_stats = json.load(open(STATS)) if os.path.exists(STATS) else {'sponsors': {}}
GC, GT = cfg.get('goatcounter'), os.environ.get('GOATCOUNTER_TOKEN')
today = datetime.date.today()
if GC and GT:
    def hits(start):
        out, page = {}, None
        while True:
            u = f'https://{GC}.goatcounter.com/api/v0/stats/hits?start={start}&limit=100' + (f'&exclude_paths={page}' if page else '')
            r = json.load(urllib.request.urlopen(urllib.request.Request(u, headers={'Authorization': f'Bearer {GT}', 'Content-Type': 'application/json'})))
            for h in r.get('hits', []): out[h['path'].lstrip('/')] = out.get(h['path'].lstrip('/'), 0) + (h.get('count') or 0)
            if not r.get('more'): return out
            page = ','.join(str(h['path_id']) for h in r['hits'])
    h30 = hits((today - datetime.timedelta(days=30)).isoformat()); hall = hits('2026-10-01')
    st = {}
    for sp in sponsors:
        k = sp['login'] or sp['name']
        st[k] = {'views30': h30.get('sponsor-view/' + k, 0), 'clicks30': h30.get('sponsor-click/' + k, 0), 'viewsAll': hall.get('sponsor-view/' + k, 0), 'clicksAll': hall.get('sponsor-click/' + k, 0)}
    if st != prev_stats.get('sponsors'): prev_stats.update({'updated': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='minutes'), 'sponsors': st})

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
    send(EMAILS.get(k), "You're live on the System Design Kit", f"""Hi {sp['name']},

Thank you for sponsoring the System Design Kit. Your logo is now live:

- Site: {SITE}
- README: https://github.com/Dinesh-Sunny/excalidraw-system-design-kit#-sponsors

Your stats (views and clicks, updated every few hours):
{stats_link}

Visits from your logo arrive tagged utm_source=system-design-kit, so they show in your own analytics too.
To change the logo, update your GitHub organisation avatar or reply to this email.

Thanks for keeping it free,
Dinesh""")
    send(GU, f"New sponsor: {sp['name']} ({sp['tier']})", f"{sp['name']} is now a {sp['tier']} sponsor.\nLink: {sp['url']}\nStats: {stats_link}")
month = today.strftime('%Y-%m')
if today.day == 1 and prev_stats.get('report_month') != month and GP:
    for sp in sponsors:
        k = sp['login'] or sp['name']; m = prev_stats.get('sponsors', {}).get(k, {})
        ctr = f"{(m.get('clicks30', 0) / m['views30'] * 100):.1f}%" if m.get('views30') else '-'
        send(EMAILS.get(k), f"Your System Design Kit results - {today.strftime('%B %Y')}", f"""Hi {sp['name']},

Last 30 days on the System Design Kit:
- Logo views: {m.get('views30', 0)}
- Clicks to your site: {m.get('clicks30', 0)}
- Click rate: {ctr}

Live stats any time: {SITE}sponsor/stats/?s={k}

Thank you for keeping the kit free,
Dinesh""")
    prev_stats['report_month'] = month
json.dump(prev_stats, open(STATS, 'w'), indent=1, ensure_ascii=False)

