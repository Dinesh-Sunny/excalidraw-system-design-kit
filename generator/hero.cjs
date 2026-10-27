const fs=require('fs');const {chromium}=require('playwright');
const S=id=>fs.readFileSync('out/svg/'+id+'.svg','utf8');
const ids=fs.readdirSync('out/svg');const f=k=>ids.find(x=>x.includes(k)).replace('.svg','');
const tiles=[f('tpl-coding-agent'),f('tpl-chat-system'),f('agentic-orchestrator-workers'),f('screen-ride-booking'),f('client-ai-clients-group'),f('tpl-rag-pipeline')];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:900}});
await p.setContent(`<style>body{margin:0;background:#f8f9fa;font-family:-apple-system,Segoe UI,sans-serif}.h{padding:28px 40px 8px}h1{margin:0;font-size:44px;color:#1e1e1e}p{margin:6px 0 0;font-size:21px;color:#495057}
.g{display:grid;grid-template-columns:1.3fr 1fr 1fr;grid-template-rows:330px 330px;gap:16px;padding:18px 40px}.t{background:#fff;border:1px solid #dee2e6;border-radius:14px;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:8px}.t svg{max-width:100%;max-height:100%;height:auto;width:auto}
.tag{display:inline-block;background:#e7f5ff;color:#1971c2;border-radius:999px;padding:3px 12px;margin-right:6px;font-size:15px}</style>
<div class=h><h1>System Design &amp; AI Architecture Kit <span style="font-size:22px;color:#868e96">for Excalidraw</span></h1><p>292 searchable items · building blocks · agents &amp; RAG · UI wireframes · 21 full interview designs &nbsp; <span class=tag>Cmd + / to insert</span><span class=tag>search "sd:"</span></p></div>
<div class=g>${tiles.map(t=>`<div class=t>${S(t)}</div>`).join('')}</div>`);
await p.waitForTimeout(500);await p.screenshot({path:require('path').join(__dirname,'..','previews','hero.png')});await b.close()})();
