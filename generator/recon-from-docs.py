# Fast page rebuild: recreate generator/out/ inputs from the deployed docs so build-showcase.py can run without the heavy render step
# Use it when only the page templates changed: python3 recon-from-docs.py && python3 build-showcase.py, then copy out/pages html into docs/.
import json,os,shutil,re,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); O=R+'/generator/out'
def grab(path,var):
    s=open(path).read(); i=s.index('const '+var+' = ')+len('const '+var+' = '); return json.loads(s[i:s.index(';\n',i)])
os.makedirs(O+'/pages',exist_ok=True); os.makedirs(O+'/svg',exist_ok=True)
shutil.copy(R+'/library/system-design-ai-kit.excalidrawlib',O+'/System Design Kit.excalidrawlib')
lib=json.load(open(O+'/System Design Kit.excalidrawlib'))['libraryItems']
I={x['id']:x for x in grab(R+'/docs/index.html','ITEMS')}
json.dump([{'section':I.get(it['id'],{}).get('section','')} for it in lib],open(O+'/report.json','w'))
json.dump([{'name':it['name'],'img':'t/'+it['id']+'.webp'} for it in lib],open(O+'/thumbs.json','w'))
for it in lib:
    p=R+'/docs/s/'+it['id']+'.svg'
    if os.path.exists(p): shutil.copy(p,O+'/svg/'+it['id']+'.svg')
names={it['id']:it['name'] for it in lib}
D=grab(R+'/docs/practice/index.html','D')
json.dump([{'slug':d['slug'],'title':d['title'],'name':names[d['kitId']][len('sd:tpl/ '):],'edges':d['edges'],'boxes':d['boxes'],'size':d['size'],'nodes':d['nodes'],'variants':d['variants']} for d in D],open(O+'/practice.json','w'))
print('ok',len(lib),len(D))
