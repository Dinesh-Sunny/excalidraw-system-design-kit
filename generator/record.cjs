const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const FONTS='/home/claude/demoapp/node_modules/@excalidraw/excalidraw/dist/prod';
const theme=process.argv[2]||'light';
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=p.startsWith('/fonts/')?path.join(FONTS,p):path.join(__dirname,'www',p);
 if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end()} const t=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':f.endsWith('.json')?'application/json':'font/woff2';r.writeHead(200,{'content-type':t});fs.createReadStream(f).pipe(r)}).listen(8792);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:720},recordVideo:{dir:'out/video',size:{width:1280,height:720}}});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.addInitScript(t=>{window.__THEME=t},theme);
await p.goto('http://localhost:8792/demo.html');await p.waitForSelector('canvas.interactive',{timeout:30000});await p.waitForTimeout(2500);
const W=ms=>p.waitForTimeout(ms);global.__p=p;process.on('exit',()=>{});
const palette=async(txt)=>{await p.mouse.click(640,600);await p.keyboard.press('Escape');await p.keyboard.press('Control+Shift+P');await W(500);await p.keyboard.type(txt,{delay:85});await W(900);await p.keyboard.press('Enter');await W(700);};
// 1. starter
await palette('first request - ai');await p.mouse.click(1210,650);await W(150);await p.keyboard.press('Shift+1');await W(2600);
// 2. library search
await p.locator('.sidebar-trigger').first().click({force:true});await W(900);
await p.click('.library-menu-items-container__search input, input[placeholder="Search library"]');await p.keyboard.type('sd:agent/',{delay:110});await W(2600);
await W(300);await p.locator('.sidebar-trigger').first().click({force:true});await W(500);
// 3. clear and insert a full design
await p.evaluate(()=>window.__api.updateScene({elements:[]}));await W(500);
await palette('tpl/ rag pipeline');await p.mouse.click(1210,650);await W(150);await p.keyboard.press('Shift+1');await W(3200);
await ctx.close();const v=fs.readdirSync('out/video').map(f=>'out/video/'+f).sort((a,c)=>fs.statSync(c).mtimeMs-fs.statSync(a).mtimeMs)[0];fs.renameSync(v,'out/demo-'+theme+'.webm');console.log('saved');await b.close();srv.close()})().catch(async e=>{console.error(String(e).slice(0,400));process.exit(1)});
