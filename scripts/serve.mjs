import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const root = resolve('dist');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.avif':'image/avif','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf','.json':'application/json','.mp4':'video/mp4'};
http.createServer(async (req,res)=>{
  try {
    const requestUrl = new URL(req.url,'http://localhost');
    const pathname = decodeURIComponent(requestUrl.pathname);
    if(pathname==='/__qa/axe.min.js'||pathname==='/__qa/audit.js'){
      const auditPath=pathname.endsWith('axe.min.js')?(process.env.PORTFOLIO_AXE_PATH||'/private/tmp/portfolio-axe-audit/package/axe.min.js'):resolve('scripts/audit-browser.js');
      res.writeHead(200,{'Content-Type':'text/javascript'});res.end(await readFile(auditPath));return;
    }
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep)) throw new Error('Forbidden');
    let body = await readFile(file);
    if (pathname === '/' && requestUrl.searchParams.get('theme') === 'light') {
      const tokens = (await readFile(resolve('assets/tokens.css'),'utf8')).split('@media')[0];
      body = Buffer.from(body.toString().replace('</head>',`<style>${tokens}</style></head>`));
    }
    if(pathname==='/'&&requestUrl.searchParams.get('audit')==='1')body=Buffer.from(body.toString().replace('</head>','<script src="/__qa/axe.min.js"></script><script src="/__qa/audit.js" defer></script></head>'));
    const headers={'Content-Type':mime[extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes'};
    const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(range){
      const start=Number(range[1]);const end=range[2]?Math.min(Number(range[2]),body.length-1):body.length-1;
      if(start> end||start>=body.length){res.writeHead(416,{'Content-Range':`bytes */${body.length}`});res.end();return;}
      res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${body.length}`,'Content-Length':end-start+1});res.end(body.subarray(start,end+1));
    }else{res.writeHead(200,{...headers,'Content-Length':body.length});res.end(body);}
  } catch { res.writeHead(404);res.end('Not found'); }
}).listen(4321,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4321'));
