const {chromium}=require('playwright');
const path=require('node:path');
const fs=require('node:fs');
const http=require('node:http');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{
 const server=http.createServer((req,res)=>{
  const missing=req.url.startsWith('/no-manifest/');
  const p=req.url.split('?')[0].replace(/^\/(the-things-we-left-behind|no-manifest)\//,'/');
  const name=p==='/'?'index.html':decodeURIComponent(p.slice(1));
  if(name==='assets/manifest.json' && missing){res.writeHead(404);res.end();return}
  fs.readFile(path.join(root,name),(e,d)=>{if(e){res.writeHead(404);res.end();return}res.end(d)});
 }).listen(8767,'127.0.0.1');
 const browser=await chromium.launch({executablePath:process.env.MOBILE_TEST_BROWSER || undefined});
 for(const url of ['file:///'+path.join(root,'index.html').replaceAll('\\','/'),'http://127.0.0.1:8767/the-things-we-left-behind/','http://127.0.0.1:8767/no-manifest/']){
  const page=await browser.newPage();
  await page.goto(url);
  const result=await page.evaluate(async()=>{
   await new Promise(done=>TL.Images.warm([0,1,2,3].map(n=>({key:'sc:'+n,base:'assets/cinematic/',file:'scene'+(n+1)})),done));
   await Promise.all(TL.Epilogue.photos.map(i=>i.decode()));
   return {protocol:location.protocol,manifest:TL.Images.MAN,scenes:[0,1,2,3].map(n=>TL.Images.scene(n)?.naturalWidth||0),outro:TL.Epilogue.photos.map(i=>i.complete&&i.naturalWidth>0)};
  });
  assert(result.scenes.every(Boolean),JSON.stringify(result));
  assert(result.outro.every(Boolean),JSON.stringify(result));
  console.log('PASS images',result.protocol,result.scenes,result.outro);
  await page.close();
 }
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
