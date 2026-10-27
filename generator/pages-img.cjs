const fs=require('fs');const {chromium}=require('playwright');
const lib=JSON.parse(fs.readFileSync('out/System Design Kit.excalidrawlib'));
fs.mkdirSync('out/pages/t',{recursive:true});fs.mkdirSync('out/pages/f',{recursive:true});
(async()=>{const b=await chromium.launch();
const pt=await b.newPage({viewport:{width:480,height:320},deviceScaleFactor:1.5});
const pf=await b.newPage({viewport:{width:1200,height:800},deviceScaleFactor:1});
for(const it of lib.libraryItems){ if(/ SECTION - /.test(it.name)) continue; const svg=fs.readFileSync('out/svg/'+it.id+'.svg','utf8');
 const html=(w,h,pad)=>`<style>body{margin:0;background:#fff;width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center}svg{width:${w-pad}px;height:${h-pad}px}</style>${svg}`;
 await pt.setContent(html(480,320,28)); fs.writeFileSync('out/pages/t/'+it.id+'.png',await pt.screenshot());
 await pf.setContent(html(1200,800,48)); fs.writeFileSync('out/pages/f/'+it.id+'.png',await pf.screenshot());}
await b.close()})();
