"""Writes the sponsor bits of the repo from sponsor.json: README block, BACKERS.md, .github/FUNDING.yml.
Usage: python3 readme-sponsors.py <repo-dir>"""
import json,sys,os,re
R=sys.argv[1] if len(sys.argv)>1 else '.'
S=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'sponsor.json')))
PAGE='https://dinesh-sunny.github.io/excalidraw-system-design-kit/sponsor/'
# FUNDING.yml - only channels that exist
f=[]
if S.get('github'): f.append(f"github: [{S['github']}]")
if S.get('kofi'): f.append(f"ko_fi: {S['kofi']}")
f.append(f"custom: ['{PAGE}']")
os.makedirs(os.path.join(R,'.github'),exist_ok=True)
open(os.path.join(R,'.github/FUNDING.yml'),'w').write('\n'.join(f)+'\n')
sp=S['sponsors']; by=lambda *t:[x for x in sp if x['tier'] in t]
def logo(x,h):
    inner=f'<img src="{x["logo"]}" alt="{x["name"]}" height="{h}">' if x.get('logo') else f'<b>{x["name"]}</b>'
    sep='&' if '?' in x['url'] else '?'
    return f'<a href="{x["url"]}{sep}utm_source=system-design-kit&utm_medium=sponsor&utm_campaign={x["tier"]}">{inner}</a>'
lines=['<!-- sponsors:start -->','<div align="center">','']
for tiers,h,label in ((('featured',),64,'Featured'),(('gold',),52,'Gold'),(('silver',),40,'Silver')):
    xs=by(*tiers)
    if xs: lines+= [f'<sub>{label.upper()}</sub><br/>',' '.join(logo(x,h) for x in xs),'<br/><br/>']
if not by('featured','gold','silver'):
    lines+=[f'<a href="{PAGE}#companies"><img src="https://img.shields.io/badge/your%20logo-here-f8f9fa?style=for-the-badge&labelColor=e9ecef" alt="Your logo here"></a>','<br/>']
names=[x['name'] for x in by('supporter')]
if names: lines+=['<br/>','Supporters: '+', '.join(names)]
lines+=['','</div>','<!-- sponsors:end -->']
block='\n'.join(lines)
def link(t,label):
    if t['per']=='once' and S.get('kofi'): return f"[{label}](https://ko-fi.com/{S['kofi']})"
    if t.get('card'): return f"[{label}]({t['card']})"
    if S.get('github') and t.get('gh_tier'): return f"[{label}](https://github.com/sponsors/{S['github']}/sponsorships?tier_id={t['gh_tier']})"
    return label
sec=f'''## 💖 Sponsors

The kit is free and MIT, and it stays that way. Sponsors pay for new blocks, new designs and updates.

{block}

| For you | For your company |
|---|---|
| {' · '.join(link(p, f"{p['name']} {p['price']}{'' if p['per']=='once' else '/mo'}") for p in S['people'])} | {' · '.join(link(c, f"{c['name']} {c['price']}/mo") for c in S['companies'])} |
| {'Pay by card above, or [sponsor on GitHub](https://github.com/sponsors/'+S['github']+')' if S.get('github') else ''}{' · ' if S.get('github') and S.get('kofi') else ''}{'[Buy me a coffee](https://ko-fi.com/'+S['kofi']+')' if S.get('kofi') else ''}{'' if (S.get('github') or S.get('kofi')) else 'Opening soon - a ⭐ helps today'} | [See tiers and perks]({PAGE}#companies) |

> [!TIP]
> Pay by card (no GitHub account needed) or on GitHub, and your logo shows up here and on the [site]({PAGE}) within a day, automatically. Sponsors get [live stats]({PAGE}stats/) and a monthly report.
'''
p=os.path.join(R,'README.md'); s=open(p).read()
if '## 💖 Sponsors' in s: s=re.sub(r'## 💖 Sponsors\n.*?(?=\n## )',sec.rstrip('\n')+'\n',s,flags=re.S)
else: s=s.replace('## 🤝 Contributing',sec+'\n## 🤝 Contributing',1)
badge=f'[![Sponsor](https://img.shields.io/badge/sponsor-%E2%99%A5-e8590c)]({PAGE})'
if badge not in s: s=s.replace('[![Stars]',badge+'\n[![Stars]',1)
ft=by('featured')
top='<!-- featured:start -->'+('\n<p align="center"><sub>FEATURED SPONSOR</sub><br/>'+' '.join(logo(x,56) for x in ft)+'</p>\n' if ft else '')+'<!-- featured:end -->'
if '<!-- featured:start -->' in s: s=re.sub(r'<!-- featured:start -->.*?<!-- featured:end -->',top,s,flags=re.S)
else: s=s.replace(badge+'\n[![Stars]'+s.split(badge+'\n[![Stars]',1)[1].split('\n',1)[0]+'\n', badge+'\n[![Stars]'+s.split(badge+'\n[![Stars]',1)[1].split('\n',1)[0]+'\n'+top+'\n',1)
open(p,'w').write(s)
# BACKERS.md
b=['# Backers','','Thank you for keeping the System Design Kit free.','',f'Want to be here? [Become a sponsor]({PAGE}).','']
for t,label in (('featured','Featured'),('gold','Gold'),('silver','Silver'),('bronze','Bronze'),('supporter','Supporters'),('backer','Backers')):
    xs=by(t)
    if xs: b+= [f'## {label}','']+[f'- [{x["name"]}]({x["url"]})' if x.get('url') else f'- {x["name"]}' for x in xs]+['']
if not sp: b+=['_No sponsors yet. Be the first._','']
open(os.path.join(R,'BACKERS.md'),'w').write('\n'.join(b))
print('ok', len(sp),'sponsors')
