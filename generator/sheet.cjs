const fs=require('fs');const {chromium}=require('playwright');
const lib=JSON.parse(fs.readFileSync('out/System Design Kit.excalidrawlib'));const rep=JSON.parse(fs.readFileSync('out/report.json'));
const secs={};lib.libraryItems.forEach((it,i)=>{const s=rep[i].section;(secs[s]=secs[s]||[]).push(it)});
const only=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1600,height:900}});
for(const [s,its] of Object.entries(secs)){ if(only.length&&!only.includes(s))continue;
 const big=['tpl','screen','pattern','frame'].includes(s);
 const cells=its.map(it=>`<div class=c><div class=im>${fs.readFileSync('out/svg/'+it.id+'.svg','utf8')}</div><div class=n>${it.name}</div></div>`).join('');
 await pg.setContent(`<style>body{margin:0;font:13px sans-serif;background:#ddd}.g{display:grid;grid-template-columns:repeat(${big?(s==='tpl'?2:4):6},1fr);gap:8px;padding:8px}.c{background:#fff;padding:6px}.im svg{width:100%;height:auto;max-height:${big?900:260}px}.n{color:#333;margin-top:4px}</style><div class=g>${cells}</div>`);
 await pg.waitForTimeout(400);await pg.screenshot({path:`out/sheet-${s}.png`,fullPage:true});}
await b.close()})();
