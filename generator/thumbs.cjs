const fs=require('fs');const {chromium}=require('playwright');
const lib=JSON.parse(fs.readFileSync('out/System Design Kit.excalidrawlib'));const rep=JSON.parse(fs.readFileSync('out/report.json'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:420,height:280}});const out=[];
for(const [i,it] of lib.libraryItems.entries()){const svg=fs.readFileSync('out/svg/'+it.id+'.svg','utf8');
 await p.setContent(`<style>body{margin:0;background:#fff;width:420px;height:280px;display:flex;align-items:center;justify-content:center}svg{max-width:396px;max-height:256px;width:auto;height:auto}</style>${svg}`);
 const buf=await p.screenshot({type:'jpeg',quality:68});
 out.push({id:it.id,name:it.name,section:rep[i].section,img:'data:image/jpeg;base64,'+buf.toString('base64')});}
fs.writeFileSync('out/thumbs.json',JSON.stringify(out));await b.close()})();
