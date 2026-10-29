import json,re,sys,os,shutil
SP=os.environ.get('SDK_SP','/tmp')
lib=json.load(open('out/System Design Kit.excalidrawlib'))['libraryItems']
rep=json.load(open('out/report.json'))
thumbs={t['name']:t['img'] for t in json.load(open('out/thumbs.json'))}
secs=[];items_pages=[];items_art=[]
for it,r in zip(lib,rep):
    m=re.match(r'^sd:([a-z]+)/ (\d\d) SECTION - (.*)$',it['name'])
    if m: secs.append({'cat':m.group(1),'no':m.group(2),'title':m.group(3)}); continue
    items_pages.append({'id':it['id'],'name':it['name'],'section':r['section'],'img':f"t/{it['id']}.webp",'full':f"f/{it['id']}.webp"})
    items_art.append({'id':it['id'],'name':it['name'],'section':r['section'],'img':thumbs[it['name']]})
N=len(items_pages)
tpl=open('showcase2.tpl.html').read().replace('/*__LEARN_TOOLS__*/',open('learn-tools.js').read())
VERSION='1.5.0'
REPO='https://github.com/Dinesh-Sunny/excalidraw-system-design-kit'
THEMEBTN='<button class="ibtn" id="theme" type="button" aria-label="Switch theme"><svg class="i-moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 12.5A6.5 6.5 0 0 1 7.5 4a6.5 6.5 0 1 0 8.5 8.5z"/></svg><svg class="i-sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="3.4"/><path d="M10 2.5v1.6M10 15.9v1.6M2.5 10h1.6M15.9 10h1.6M4.7 4.7l1.1 1.1M14.2 14.2l1.1 1.1M4.7 15.3l1.1-1.1M14.2 5.8l1.1-1.1"/></svg></button>'
GHSVG='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z"/></svg>'
HEART='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 16.5s-6.5-3.9-6.5-8.6A3.4 3.4 0 0 1 10 5.6a3.4 3.4 0 0 1 6.5 2.3c0 4.7-6.5 8.6-6.5 8.6z"/></svg>'
IBLK='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="5.5" height="5.5" rx="1.2"/><rect x="11" y="3.5" width="5.5" height="5.5" rx="1.2"/><rect x="3.5" y="11" width="5.5" height="5.5" rx="1.2"/><rect x="11" y="11" width="5.5" height="5.5" rx="1.2"/></svg>'
IPRC='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3.5"/><circle cx="10" cy="10" r=".8" fill="currentColor"/></svg>'
SRCH='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><path d="m16.5 16.5-3.5-3.5"/></svg>'
IEXP='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="15" height="15" rx="3"/><rect x="6" y="6" width="8" height="8" rx="2"/><rect x="8.6" y="8.6" width="2.8" height="2.8" rx=".8" fill="currentColor"/></svg>'
def NAV(pre, active, spurl, kit_dialog=False, ph='Search blocks'):
    """one header for every page: Blocks | Practice switch, theme, Sponsor, Star, Get the kit"""
    cur=lambda k:' aria-current="page"' if k==active else ''
    home=pre or './'
    get=f'<a class="pill ghost getk" href="{REPO}/releases/latest" data-kit>Get the kit</a>' if kit_dialog else f'<a class="pill ghost getk" href="{pre}#get">Get the kit</a>'
    return (f'<header class="nav gut"><div class="wrap">\n'
      f'  <a class="mark" href="{home}" aria-label="System design kit, home"><span class="long">System design <i>kit</i></span><span class="short">SD <i>kit</i></span></a>\n'
      f'  <nav class="sw" aria-label="Site"><a href="{home}"{cur("blocks")}>{IBLK}<span>Blocks</span></a><a href="{pre}practice/"{cur("practice")}>{IPRC}<span>Practice</span></a><a href="{pre}explore/"{cur("explore")}>{IEXP}<span>Explore</span></a></nav>\n'
      f'  <span class="sp"></span>\n  <button class="hsk" id="hsk" type="button" data-cmdk aria-label="Search the kit">{SRCH}<span>Search</span><kbd aria-hidden="true">⌘K</kbd></button>\n  {THEMEBTN}\n'
      f'  <a class="pill ghost star" href="{REPO}" target="_blank" rel="noopener" aria-label="Star on GitHub">{GHSVG}<span class="lbl">Star</span><span class="cnt" id="stars" hidden></span></a>\n'
      f'  {get}\n'
      f'  <a class="pill primary spon" href="{spurl}" aria-label="Sponsor this kit"{cur("sponsor")}>{HEART}<span class="lbl">Sponsor</span></a>\n</div></header>\n'
      '<script>/* shared header: theme switch and the live star count, the same on every page */(()=>{const t=document.getElementById("theme");if(t)t.onclick=()=>{const d=document.documentElement,n=d.dataset.theme==="dark"?"light":"dark";d.dataset.theme=n;try{localStorage.setItem("sdk-theme",n)}catch(e){}};'
      'const show=n=>{const s=document.getElementById("stars");if(s&&n>0){s.textContent=n>=1000?(n/1000).toFixed(1)+"k":n;s.hidden=false}};let c=null;try{c=JSON.parse(sessionStorage.getItem("sdk-stars")||"null")}catch(e){}'
      '/* the Search button shows once the page search scrolls away (always on pages without one) */'
      'const nv=document.querySelector(".nav"),hq={value:""},sb=()=>document.querySelector(".hero .sbox");const vis=on=>document.body.classList.toggle("hs-on",on);'
      'const watch=()=>{const box=sb();if(box&&"IntersectionObserver"in window)new IntersectionObserver(e=>vis(!e[0].isIntersecting),{rootMargin:"-64px 0px 0px 0px"}).observe(box);else vis(true)};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",watch):watch();'
      'const k=document.querySelector("#hsk kbd");if(k&&!/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent))k.textContent="Ctrl K";'
      '/* logo: on the page it belongs to, glide to the very top and reset; elsewhere it is a normal link */'
      'document.querySelector(".nav .mark").addEventListener("click",e=>{const a=e.currentTarget,u=new URL(a.href,location.href);if(u.pathname!==location.pathname||e.metaKey||e.ctrlKey)return;e.preventDefault();dispatchEvent(new CustomEvent("sdk-home"));history.replaceState(null,"",location.pathname);scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})});'
      'if(c&&Date.now()-c.t<36e5)show(c.n);else fetch("https://api.github.com/repos/Dinesh-Sunny/excalidraw-system-design-kit").then(r=>r.ok?r.json():null).then(j=>{if(j){show(j.stargazers_count);try{sessionStorage.setItem("sdk-stars",JSON.stringify({t:Date.now(),n:j.stargazers_count}))}catch(e){}}}).catch(()=>{})})();</script>\n'
      f'<script src="{pre}search.js" defer></script>')
def FOOT(pre, spurl, mail='Help'):
    """one footer for every page"""
    home=pre or './'
    return (f'<footer class="gut"><div class="wrap"><span><a href="{REPO}/blob/main/CHANGELOG.md" target="_blank" rel="noopener">v{VERSION}</a> · MIT · free, no sign-up</span>'
      f'<span class="help">Happy to help: <a data-mail="{mail}" href="#contact">Email</a> · <a href="{REPO}/discussions/new?category=q-a" target="_blank" rel="noopener">Ask a question</a> · <a href="{REPO}/discussions/new?category=ideas" target="_blank" rel="noopener">Share an idea</a></span>'
      f'<span class="fnav"><a href="{home}">Blocks</a> · <a href="{pre}practice/">Practice</a> · <a href="{pre}explore/">Explore</a> · <a href="{REPO}/blob/main/docs/interview-playbook.md" target="_blank" rel="noopener">45-min playbook</a> · <a href="{spurl}">Sponsor</a></span></div></footer>')
# practice questions, and which questions use each block (both ways between Blocks and Practice)
from kitmap import find as kitfind
PQ={};USES={}
if os.path.exists('out/practice.json'):
    _lv={'Easy':0,'Medium':1,'Hard':2}; _pc=json.load(open('practice.data.json'))
    _by={it['name']:it['id'] for it in lib}
    for m in json.load(open('out/practice.json')):
        kid=_by.get('sd:tpl/ '+m['name']);
        if not kid: continue
        PQ[m['slug']]=[m['title'],_pc[m['slug']]['level'],kid.replace('sdk-','')]
        for n in m['nodes']:
            b=kitfind(n['title'])
            if b: USES.setdefault(b.replace('sdk-',''),[])
            if b and m['slug'] not in USES[b.replace('sdk-','')]: USES[b.replace('sdk-','')].append(m['slug'])
PRACTICE=json.dumps({'q':PQ,'u':USES},separators=(',',':'),ensure_ascii=False)
# learning layer: hand-written deep dives (learn/<slug>.json) + "In real systems" for every block, built from the practice designs
import glob as _g
LEARN={'L':{},'R':{}}
for f in sorted(_g.glob('learn/*.json')): LEARN['L'][os.path.basename(f)[:-5]]=json.load(open(f))
if os.path.exists('out/practice.json'):
    _pc=json.load(open('practice.data.json')); _R={}
    for m in json.load(open('out/practice.json')):
        kk={n['id']:(kitfind(n['title']) or '').replace('sdk-','') for n in m['nodes']}
        for n in m['nodes']:
            k=kk[n['id']]
            if not k: continue
            r=_R.setdefault(k,{'roles':[],'up':{},'down':{}})
            if not any(x[0]==m['slug'] for x in r['roles']): r['roles'].append([m['slug'],n['title'],_pc[m['slug']]['blocks'].get(n['id'],'')])
        for e in m.get('edges',[]):
            a,b=kk.get(e[0]),kk.get(e[1])
            if a and b and a!=b:
                _R[a]['down'][b]=_R[a]['down'].get(b,0)+1; _R[b]['up'][a]=_R[b]['up'].get(a,0)+1
    for k,r in _R.items():
        LEARN['R'][k]={'roles':r['roles'],'up':sorted(r['up'],key=lambda x:-r['up'][x])[:4],'down':sorted(r['down'],key=lambda x:-r['down'][x])[:4]}
LEARNJ=json.dumps(LEARN,separators=(',',':'),ensure_ascii=False)
# real tools per block + example stack per design (stack.json); keys are slug prefixes so tag edits never break them
_SJ=json.load(open('stack.json')); _slugs=[it['id'].replace('sdk-','') for it in lib]
STACKB={}
for _k,_v in _SJ['blocks'].items():
    for _s in _slugs:
        if _s.startswith(_k): STACKB[_s]=_v
STACKD={}
if os.path.exists('out/practice.json'):
    for m in json.load(open('out/practice.json')):
        dd=_SJ['designs'].get(m['slug'])
        if not dd: continue
        kid=next((it['id'] for it in lib if it['name']=='sd:tpl/ '+m['name']),None)
        if kid: STACKD[kid.replace('sdk-','')]=[[n['title'].replace('\n',' '),dd[n['id']]] for n in m['nodes'] if n['id'] in dd]
STACKJ=json.dumps({'b':STACKB,'d':STACKD},separators=(',',':'),ensure_ascii=False)
# one search for every page: blocks, designs, practice questions, starter packs, sections
_t=open('showcase2.tpl.html').read()
_lab=dict(re.findall(r'(\w+): "([^"]+)"', _t[_t.index('const LABEL = {'):_t.index('};',_t.index('const LABEL = {'))]))
_packs=[]
for m in re.finditer(r'\{ id: "([^"]+)", title: "([^"]+)", desc: "([^"]+)", keys: \[([^\]]*)\] \}', _t):
    keys=re.findall(r'"([^"]+)"',m.group(4)); first=None
    for k in keys:
        c,ti=k.split('/',1)
        for it in lib:
            mm=re.match(r'^sd:([a-z]+)/\s(.*)$',it['name'])
            if mm and mm.group(1)==c and mm.group(2).split(' - ')[0]==ti: first=first or it['id']; break
    _packs.append({'id':m.group(1),'t':m.group(2),'d':m.group(3),'n':len(keys),'img':first})
_blocks=[];_count={}
for it in lib:
    mm=re.match(r'^sd:([a-z]+)/\s(.*)$',it['name'])
    if not mm or ' SECTION - ' in it['name']: continue
    c=mm.group(1); rest=mm.group(2); ti=rest.split(' - ')[0]; tags=rest.split(' - ',1)[1] if ' - ' in rest else ''
    _count[c]=_count.get(c,0)+1; _blocks.append({'id':it['id'],'t':ti,'c':c,'k':(tags+' '+' '.join(x[0] for x in STACKB.get(it['id'].replace('sdk-',''),[]))).strip()})
_pq=[]
if os.path.exists('out/practice.json'):
    _pcd=json.load(open('practice.data.json'))
    for m in json.load(open('out/practice.json')):
        if m['slug'] not in PQ: continue
        _pq.append({'s':m['slug'],'t':m['title'],'l':_pcd[m['slug']]['level'],'co':_pcd[m['slug']]['companies'],'tr':_pcd[m['slug']]['track'],'n':' '.join(n['title'] for n in m['nodes']),'kit':PQ[m['slug']][2]})
os.makedirs('out/pages',exist_ok=True)
json.dump({'b':_blocks,'p':_pq,'k':_packs,'cats':{k:v for k,v in _lab.items()},'count':_count},open('out/pages/search-index.json','w'),separators=(',',':'),ensure_ascii=False)
shutil.copy('search.js','out/pages/search.js')
NEWS='Copy any block into Excalidraw, Figma or Docs, plus 12 starter packs'
def fill(items): return tpl.replace('__NAV__',NAV('','blocks','__SPURL__',True,ph=f'Search {N} blocks')).replace('__FOOT__',FOOT('','__SPURL__')).replace('__PRACTICE__',PRACTICE).replace('__LEARN__',LEARNJ).replace('__STACK__',STACKJ).replace('__NEWS__',NEWS).replace('__ITEMS__',json.dumps(items,separators=(',',':'))).replace('__SECTIONS__',json.dumps(secs)).replace('__VERSION__',VERSION).replace('__SIZE__',f"{os.path.getsize('out/System Design Kit.excalidrawlib')/1e6:.1f} MB").replace('__N__',str(len(items)))
art=fill(items_art).replace('__DATA__','https://dinesh-sunny.github.io/excalidraw-system-design-kit/'); open(f'{SP}/sd-kit-showcase.html','w').write(art)
pg=fill(items_pages).replace('__DATA__','')
pg=pg.replace('<title>System Design Kit</title>',f'<title>System Design Kit for Excalidraw</title>\n<meta name="description" content="{N} searchable Excalidraw blocks for system design interviews and agentic AI: building blocks, agents, RAG, UI screens and {sum(1 for x in items_pages if x['name'].startswith('sd:tpl/'))} full designs. Free, MIT.">\n<meta property="og:title" content="System Design Kit for Excalidraw">\n<meta property="og:description" content="Draw systems by typing. {N} Excalidraw blocks for system design and AI agents.">\n<meta property="og:image" content="https://dinesh-sunny.github.io/excalidraw-system-design-kit/og.png">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="theme-color" content="#3f6c9f">\n<script type="application/ld+json">'+json.dumps({"@context":"https://schema.org","@type":"SoftwareApplication","name":"System Design Kit for Excalidraw","applicationCategory":"DesignApplication","operatingSystem":"Web","url":"https://dinesh-sunny.github.io/excalidraw-system-design-kit/","description":f"{N} Excalidraw blocks for system design interviews and agentic AI architecture.","license":"https://opensource.org/licenses/MIT","isAccessibleForFree":True,"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"author":{"@type":"Person","name":"Dinesh Sunny","url":"https://github.com/Dinesh-Sunny"},"softwareVersion":VERSION,"codeRepository":"https://github.com/Dinesh-Sunny/excalidraw-system-design-kit"})+'</script>',1)
pg=pg.replace('<meta name="claude:viewport-fit-sides" content="cover">\n','',1)
pg='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+pg.replace('</style>\n','</style>\n</head><body>\n',1)+'\n</body></html>\n'
open('out/pages/index.html','w').write(pg)
print(len(items_pages),len(art)//1024,'KB art',len(pg)//1024,'KB pages')

# per-item data for copy / paste / download: elements (e/) and SVG (s/)
for d in ('e','s'): shutil.rmtree(f'out/pages/{d}',ignore_errors=True); os.makedirs(f'out/pages/{d}')
KEEP=('id','type','x','y','width','height','angle','strokeColor','backgroundColor','fillStyle','strokeWidth','strokeStyle','roughness','opacity','groupIds','frameId','roundness','seed','version','versionNonce','isDeleted','boundElements','updated','link','locked','text','fontSize','fontFamily','textAlign','verticalAlign','containerId','originalText','autoResize','lineHeight','points','lastCommittedPoint','startBinding','endBinding','startArrowhead','endArrowhead','elbowed','fixedSegments','startIsSpecial','endIsSpecial','polygon','status','fileId','scale','crop','baseline','index')
for it in lib:
    if re.match(r'^sd:[a-z]+/ \d\d SECTION - ',it['name']): continue
    json.dump(it['elements'],open(f"out/pages/e/{it['id']}.json",'w'),separators=(',',':'))
    shutil.copy(f"out/svg/{it['id']}.svg",f"out/pages/s/{it['id']}.svg")

# pages-img.cjs writes PNG; convert to the webp the page loads
from PIL import Image;import glob
for d,qq in (('t',80),('f',82)):
    for p in glob.glob(f'out/pages/{d}/*.png'):
        Image.open(p).save(p[:-4]+'.webp','WEBP',quality=qq,method=4);os.remove(p)

# ---- sponsor flow ----
SPN=json.load(open('sponsor.json'))
SPJ=json.dumps({k:v for k,v in SPN.items() if not k.startswith('_')},separators=(',',':'))
PAGES='https://dinesh-sunny.github.io/excalidraw-system-design-kit/'
for path,spurl in ((f'{SP}/sd-kit-showcase.html',PAGES+'sponsor/'),('out/pages/index.html','sponsor/')):
    t=open(path).read().replace('__SPURL__',spurl).replace('__SPONSOR__',SPJ).replace('__SPJSON__',PAGES+'sponsors.json' if path.startswith(SP) else 'sponsors.json'); open(path,'w').write(t)
src=open('showcase2.tpl.html').read()
base=src[src.index('<style>')+7:src.index('</style>')].replace('url(fonts/','url(../fonts/')
headinit=src[:src.index('<style>')].split('\n',2)[2].replace('href="fonts/','href="../fonts/')  # drop <title> + claude meta lines
themebtn=THEMEBTN; ghsvg=GHSVG; heart=HEART
sp=open('sponsor.tpl.html').read()
sp=sp.replace('__NAV__',NAV('../','sponsor','./')).replace('__FOOT__',FOOT('../','./','Sponsorship'))
for k,v in (('__BASECSS__',base),('__HEADINIT__',headinit),('__THEMEBTN__',themebtn),('__GH__',ghsvg),('__HEART__',heart.replace("'","\\'")),('__SPONSOR__',SPJ),('__SPJSON__','../sponsors.json'),('__N__',str(N))): sp=sp.replace(k,v)
json.dump({'sponsors':SPN['sponsors']},open('out/pages/sponsors.json','w'),indent=1,ensure_ascii=False)
os.makedirs('out/pages/sponsor',exist_ok=True); open('out/pages/sponsor/index.html','w').write(sp)
print('sponsor page',len(sp)//1024,'KB')

# ---- thank-you + stats pages (share the site CSS) ----
ptpl=open('page.tpl.html').read()
for slug,title,robots,body,js in (('thanks','Thank you - System Design Kit','noindex','thanks.body.html','thanks.js'),('stats','Sponsor stats - System Design Kit','index','stats.body.html','stats.js'),('terms','Sponsor terms - System Design Kit','index','terms.body.html',None)):
    t=ptpl.replace('__NAV__',NAV('../../','sponsor','../')).replace('__FOOT__',FOOT('../../','../','Sponsorship')).replace('__BASECSS__',base.replace('url(../fonts/','url(../../fonts/')).replace('__HEADINIT__',headinit.replace('href="../fonts/','href="../../fonts/')).replace('__THEMEBTN__',themebtn).replace('__SPONSOR__',SPJ).replace('__TITLE__',title).replace('__ROBOTS__',robots).replace('__BODY__',open(body).read()).replace('__SCRIPT__',open(js).read() if js else '')
    os.makedirs(f'out/pages/sponsor/{slug}',exist_ok=True); open(f'out/pages/sponsor/{slug}/index.html','w').write(t)
if not os.path.exists('out/pages/love.json'): json.dump([],open('out/pages/love.json','w'))
if not os.path.exists('out/pages/stats.json'): json.dump({'sponsors':{}},open('out/pages/stats.json','w'))
print('thanks + stats pages')

# ---- practice mode (step-by-step interview) ----
if os.path.exists('out/practice.json'):
    PM=json.load(open('out/practice.json')); PC=json.load(open('practice.data.json')); V2=json.load(open('practice.v2.json'))
    byname={it['name']:it['id'] for it in lib}
    order={'Easy':0,'Medium':1,'Hard':2}
    P=[]
    for m in PM:
        kid=byname.get('sd:tpl/ '+m['name'])
        c=PC[m['slug']]
        P.append({'slug':m['slug'],'title':m['title'],'edges':m.get('edges',[]),'boxes':m.get('boxes',{}),'size':m.get('size'),'level':c['level'],'track':c['track'],'companies':c['companies'],'nodes':[{'id':n['id'],'title':n['title'],'k':(kitfind(n['title']) or '').replace('sdk-',''),'sd':bool(_SJ['designs'].get(m['slug'],{}).get(n['id'])),'st':_SJ['designs'].get(m['slug'],{}).get(n['id']) or ', '.join(x[0] for x in STACKB.get((kitfind(n['title']) or '').replace('sdk-',''),[])[:3])} for n in m['nodes']],
                  'c':{k:c[k] for k in ('reqF','reqN','est','api','data','blocks','dives','wrap')},'v2':V2.get(m['slug'],{}),'variants':{vk:{**vv,'nodes':[{**n,'k':(kitfind(n['title']) or '').replace('sdk-','')} for n in vv.get('nodes',[])]} for vk,vv in m.get('variants',{}).items()},'kitId':kid,'kit':kid.replace('sdk-',''),'thumb':f"t/{kid}.webp"})
    P.sort(key=lambda d:(d['track']!='Classic',order[d['level']]))
    t=open('practice.tpl.html').read().replace('/*__DRILLCSS__*/',open('drill.css').read()).replace('/*__DRILLJS__*/',open('drill.js').read())
    t=t.replace('__NAV__',NAV('../','practice','../sponsor/',ph='Search questions')).replace('__FOOT__',FOOT('../','../sponsor/','Practice'))
    for k,v in (('__HEADINIT__',headinit),('__BASECSS__',base),('__THEMEBTN__',themebtn),('__SPONSOR__',SPJ),('__PDATA__',json.dumps(P,separators=(',',':'),ensure_ascii=False)),('__LENSES__',json.dumps(V2['_lenses'],separators=(',',':'),ensure_ascii=False))): t=t.replace(k,v)
    os.makedirs('out/pages/practice',exist_ok=True); open('out/pages/practice/index.html','w').write(t)
    print('practice page',len(t)//1024,'KB',len(P),'questions')


# ---- Explore: one tree of ideas, any depth (section -> block -> concept -> explanation) ----
import re as _re
def _sid(t, used):
    b=_re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-')[:40] or 'x'; i=b; n=2
    while i in used: i=f'{b}-{n}'; n+=1
    used.add(i); return i
def _kids(items):
    used=set(); out=[]
    for it in items:
        if not it: continue
        x={'id':_sid(it['t'],used),'t':it['t']}
        for k in ('s','d','img','l','sl','r'):
            if it.get(k): x[k]=it[k]
        if not x.get('s') and x.get('d'): x['s']=x['d'][:150]
        if it.get('k'): x['k']=_kids(it['k'])
        out.append(x)
    return out
_CON=json.load(open('concepts.json')) if os.path.exists('concepts.json') else {}
_PCD=json.load(open('practice.data.json')); _PMs={m['slug']:m for m in json.load(open('out/practice.json'))} if os.path.exists('out/practice.json') else {}
_kit2q={v[2]:k for k,v in PQ.items()}
def _block(it):
    mm=_re.match(r'^sd:([a-z]+)/\s(.*)$',it['name']); ti=mm.group(2).split(' - ')[0].replace('\n',' '); tags=mm.group(2).split(' - ',1)[1] if ' - ' in mm.group(2) else ''
    sl=it['id'].replace('sdk-',''); L=LEARN['L'].get(sl); kids=[]
    for k,v in _CON.items():
        if k!='_what' and sl.startswith(k): kids+=v
    wh=next((v for k,v in _CON.get('_what',{}).items() if sl.startswith(k)),None)
    if L:
        if L.get('inside',{}).get('steps'): kids.append({'t':'How it works inside','s':f"{len(L['inside']['steps'])} steps",'k':[{'t':x['t'],'d':x['d']} for x in L['inside']['steps']]})
        if L.get('choices'): kids.append({'t':"Choices you'll make",'k':[{'t':x['t'],'d':x['d']} for x in L['choices']]})
        if L.get('breaks'): kids.append({'t':'When it breaks','k':[{'t':x['t'],'d':x['d'],'s':'Fix: '+x.get('fix','')} for x in L['breaks']]})
        iv=[{'t':'Say it like this','d':x} for x in L.get('say',[])][:1]+[{'t':f['q'],'d':f['a']} for f in L.get('followups',[])]
        if iv: kids.append({'t':'In the interview','k':iv})
    tb=STACKB.get(sl)
    if tb: kids.append({'t':'Tools you will meet','k':[{'t':x[0],'l':[['Official site',x[1]]]} for x in tb]})
    q=_kit2q.get(sl)
    if q and q in _PMs:
        m=_PMs[q]; c=_PCD[q]; dd=_SJ['designs'].get(q,{})
        kids.append({'t':'Blocks in this design','s':f"{len(m['nodes'])} blocks, in build order",'k':[{'t':n['title'].replace('\n',' '),'d':c['blocks'].get(n['id'],''),'s':('Built with: '+dd[n['id']]) if n['id'] in dd else '','r':(kitfind(n['title']) or '').replace('sdk-','')} for n in m['nodes']]})
        kids.append({'t':'Deep dives','k':[{'t':a,'d':b} for a,b in c['dives']]})
    links=[['Open in blocks','../#i='+sl]]+([['Practise it','../practice/#q='+q]] if q else [])
    return {'t':ti,'sl':sl,'s':(L['what'] if L else wh or tags),'img':'t/'+it['id']+'.webp','l':links,'k':kids}
_secs=[]
for c,lab in _lab.items():
    if c in ('zone','link','frame','note','guide','ui'): continue
    its=[it for it in lib if it['name'].startswith('sd:'+c+'/ ') and ' SECTION - ' not in it['name']]
    if not its: continue
    _secs.append({'t':lab,'s':', '.join(_re.match(r'^sd:[a-z]+/\s(.*?)( - |$)',x['name']).group(1).replace('\n',' ') for x in its[:4])+(' and more' if len(its)>4 else ''),'k':[_block(it) for it in its]})
TREE={'id':'root','t':'Everything','d':'Pick an area to go in. Each card opens into the ideas inside it, down to plain explanations.','k':_kids(_secs)}
os.makedirs('out/pages/explore',exist_ok=True)
json.dump(TREE,open('out/pages/explore/tree.json','w'),separators=(',',':'),ensure_ascii=False)
t=ptpl.replace('__NAV__',NAV('../','explore','../sponsor/')).replace('__FOOT__',FOOT('../','../sponsor/','Explore')).replace('__BASECSS__',base).replace('__HEADINIT__',headinit).replace('__THEMEBTN__',themebtn).replace('__SPONSOR__',SPJ).replace('__TITLE__','Explore - System Design Kit').replace('__ROBOTS__','index').replace('__BODY__',open('explore.body.html').read().replace('/*__DRILLCSS__*/',open('drill.css').read())).replace('__SCRIPT__',open('explore.js').read().replace('/*__DRILLJS__*/',open('drill.js').read()))
open('out/pages/explore/index.html','w').write(t)
print('explore', os.path.getsize('out/pages/explore/tree.json')//1024,'KB tree', len(_secs),'sections')
