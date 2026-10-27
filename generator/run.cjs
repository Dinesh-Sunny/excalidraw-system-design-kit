const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const FONTS=path.resolve('node_modules/@excalidraw/excalidraw/dist/prod');
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=p.startsWith('/fonts/')?path.join(FONTS,p):path.join(__dirname,'www',p==='/'?'index.html':p);
 if(!fs.existsSync(f)){r.writeHead(404);return r.end()} r.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':'font/woff2'});fs.createReadStream(f).pipe(r)}).listen(8765);
(async()=>{const b=await chromium.launch();const pg=await b.newPage();pg.on('pageerror',e=>console.log('PAGEERR',e.message));
await pg.goto('http://localhost:8765/');await pg.waitForFunction(()=>window.BUILD&&window.__fontsReady,null,{timeout:60000});
const res=await pg.evaluate(()=>window.BUILD());
fs.writeFileSync('out/System Design Kit.excalidrawlib',JSON.stringify(res.lib));
const errs=res.report.filter(r=>r.error);console.log('items',res.report.length,'errors',errs.length);errs.slice(0,5).forEach(e=>console.log(e.name,e.error.slice(0,400)));
fs.writeFileSync('out/report.json',JSON.stringify(res.report,null,0));
if(process.argv[2]!=='nosvg'){fs.mkdirSync('out/svg',{recursive:true});
 for(const it of res.lib.libraryItems){const svg=await pg.evaluate(e=>window.SVG(e),it.elements);fs.writeFileSync('out/svg/'+it.id+'.svg',svg)}}
await b.close();srv.close()})().catch(e=>{console.error(e);process.exit(1)});
