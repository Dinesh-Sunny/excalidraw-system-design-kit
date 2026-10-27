"""Pull current GitHub sponsors and update the site + README automatically.
Runs in .github/workflows/sponsors.yml. Needs a token in SPONSORS_TOKEN (or GITHUB_TOKEN)."""
import json, os, subprocess, sys, urllib.request

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
sponsors.sort(key=lambda x: -x['amount'])
# only one Featured at a time: the rest drop to Gold
seen = False
for s in sponsors:
    if s['tier'] == 'featured':
        if seen: s['tier'] = 'gold'
        seen = True
for s in sponsors: s.pop('amount')

cfg = json.load(open(CFG)); cfg['sponsors'] = sponsors
json.dump(cfg, open(CFG, 'w'), indent=2, ensure_ascii=False)
json.dump({'sponsors': sponsors}, open(os.path.join(ROOT, 'docs', 'sponsors.json'), 'w'), indent=1, ensure_ascii=False)
subprocess.run([sys.executable, os.path.join(ROOT, 'generator', 'readme-sponsors.py'), ROOT], check=True)
print(len(sponsors), 'public sponsors')
