import json,re,sys,os,shutil
SP='/tmp/claude-0/-home-claude/aca6983d-08d7-5f43-8750-93c63e7f3c11/scratchpad'
lib=json.load(open('out/System Design Kit.excalidrawlib'))['libraryItems']
rep=json.load(open('out/report.json'))
thumbs={t['name']:t['img'] for t in json.load(open('out/thumbs.json'))}
secs=[];items_pages=[];items_art=[]
for it,r in zip(lib,rep):
    m=re.match(r'^sd:([a-z]+)/ (\d\d) SECTION - (.*)$',it['name'])
    if m: secs.append({'cat':m.group(1),'no':m.group(2),'title':m.group(3)}); continue
    items_pages.append({'name':it['name'],'section':r['section'],'img':f"t/{it['id']}.webp",'full':f"f/{it['id']}.webp"})
    items_art.append({'name':it['name'],'section':r['section'],'img':thumbs[it['name']]})
N=len(items_pages)
tpl=open('showcase2.tpl.html').read()
def fill(items): return tpl.replace('__ITEMS__',json.dumps(items,separators=(',',':'))).replace('__SECTIONS__',json.dumps(secs)).replace('__VERSION__','1.4.0').replace('__SIZE__',f"{os.path.getsize('out/System Design Kit.excalidrawlib')/1e6:.1f} MB").replace('__N__',str(len(items)))
art=fill(items_art); open(f'{SP}/sd-kit-showcase.html','w').write(art)
pg=fill(items_pages)
pg=pg.replace('<title>System Design Kit</title>',f'<title>System Design Kit for Excalidraw</title>\n<meta name="description" content="{N} searchable Excalidraw blocks for system design interviews and agentic AI: building blocks, agents, RAG, UI screens and 21 full designs. Free, MIT.">\n<meta property="og:title" content="System Design Kit for Excalidraw">\n<meta property="og:description" content="Draw systems by typing. {N} Excalidraw blocks for system design and AI agents.">\n<meta property="og:image" content="https://dinesh-sunny.github.io/excalidraw-system-design-kit/og.png">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="theme-color" content="#3f6c9f">',1)
pg=pg.replace('<meta name="claude:viewport-fit-sides" content="cover">\n','',1)
pg='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+pg.replace('</style>\n','</style>\n</head><body>\n',1)+'\n</body></html>\n'
open('out/pages/index.html','w').write(pg)
print(len(items_pages),len(art)//1024,'KB art',len(pg)//1024,'KB pages')

# pages-img.cjs writes PNG; convert to the webp the page loads
from PIL import Image;import glob
for d,qq in (('t',80),('f',82)):
    for p in glob.glob(f'out/pages/{d}/*.png'):
        Image.open(p).save(p[:-4]+'.webp','WEBP',quality=qq,method=4);os.remove(p)
