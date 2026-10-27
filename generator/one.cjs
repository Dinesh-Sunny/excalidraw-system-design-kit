const fs=require('fs');const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1500,height:900}});
for(const id of process.argv.slice(2)){await pg.setContent(`<body style="margin:0">${fs.readFileSync('out/svg/'+id+'.svg','utf8')}</body>`);
const el=await pg.$('svg');await el.screenshot({path:'out/one-'+id+'.png'});}await b.close()})();
