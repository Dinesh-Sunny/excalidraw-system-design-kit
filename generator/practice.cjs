// exports step-by-step SVGs for practice mode into out/pages/p/<slug>/<k>.svg + out/practice.json
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const FONTS=path.resolve('node_modules/@excalidraw/excalidraw/dist/prod');
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=p.startsWith('/fonts/')?path.join(FONTS,p):path.join(__dirname,'www',p==='/'?'index.html':p);
 if(!fs.existsSync(f)){r.writeHead(404);return r.end()} r.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':'font/woff2'});fs.createReadStream(f).pipe(r)}).listen(8766);
const slug=s=>s.toLowerCase().split(' - ')[0].replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
(async()=>{const b=await chromium.launch();const pg=await b.newPage();pg.on('pageerror',e=>console.log('PAGEERR',e.message));
await pg.goto('http://localhost:8766/');await pg.waitForFunction(()=>window.PRACTICE&&window.__fontsReady,null,{timeout:60000});
const res=await pg.evaluate(()=>window.PRACTICE());
fs.rmSync('out/pages/p',{recursive:true,force:true});const man=[];
for(const t of res){const s=slug(t.name);fs.mkdirSync('out/pages/p/'+s,{recursive:true});t.steps.forEach((svg,k)=>fs.writeFileSync(`out/pages/p/${s}/${k+1}.svg`,svg.replace(/<style class="style-fonts">[\s\S]*?<\/style>/,'')));man.push({slug:s,boxes:t.boxes,size:t.size,name:t.name,title:t.title,nodes:t.nodes,edges:t.edges,notes:t.notes,n:t.steps.length});}
fs.writeFileSync('out/practice.json',JSON.stringify(man,null,1));console.log('practice designs',man.length,'svgs',man.reduce((a,m)=>a+m.n,0));
await b.close();srv.close()})().catch(e=>{console.error(e);process.exit(1)});
