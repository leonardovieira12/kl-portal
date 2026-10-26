import {readFile} from 'node:fs/promises';
import {request as httpRequest} from 'node:http';
const pwaFiles=new Map([['/manifest.webmanifest',['manifest.webmanifest','application/manifest+json']],['/sw.js',['sw.js','text/javascript; charset=utf-8']],...['icon-192.png','icon-512.png','icon-180.png','icon.svg','offline.html','install.js','install.css'].map(name=>['/pwa/'+name,[name,name.endsWith('.png')?'image/png':name.endsWith('.svg')?'image/svg+xml':name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8']])]);
export function makePortal({beauty,pool,portal,marketPort,host,admin}){return async(req,res)=>{
 let url;try{url=new URL(req.url,'http://local')}catch{res.writeHead(400);res.end();return}
 const fail=(status,msg)=>{if(res.headersSent){res.end();return}res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({error:msg}))};
 if(host&&req.headers.host!==host)return fail(403,'Host inválido. Confira APP_URL.');
 if(pwaFiles.has(url.pathname)){if(!['GET','HEAD'].includes(req.method))return fail(405,'Método não permitido.');try{const [name,type]=pwaFiles.get(url.pathname),data=await readFile(new URL('../pwa/'+name,import.meta.url));res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff',...(url.pathname==='/sw.js'?{'Service-Worker-Allowed':'/'}:{})});res.end(req.method==='HEAD'?undefined:data)}catch{return fail(503,'Aplicativo temporariamente indisponível.')}return}
 if(url.pathname==='/healthz'){try{await pool.query('SELECT 1');const r=await fetch(`http://127.0.0.1:${marketPort}/health`,{signal:AbortSignal.timeout(2000)});if(!r.ok)throw Error();res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({status:'ok',beauty:'ok',mercado:'ok'}))}catch{fail(503,'Um dos sistemas não está disponível.')}return}
 if(url.pathname==='/beauty'||url.pathname==='/mercado'||url.pathname==='/admin'){res.writeHead(308,{Location:url.pathname+'/'+url.search});res.end();return}
 if(admin&&url.pathname.startsWith('/admin/'))return admin(req,res);
 if(url.pathname.startsWith('/beauty/')){req.url=req.url.slice('/beauty'.length);return beauty(req,res)}
 if(url.pathname.startsWith('/mercado/')){
 const headers={...req.headers};delete headers.connection;delete headers['transfer-encoding'];
 const upstream=httpRequest({hostname:'127.0.0.1',port:marketPort,path:req.url.slice('/mercado'.length),method:req.method,headers,timeout:30000},response=>{res.writeHead(response.statusCode||502,response.headers);response.pipe(res)});
 upstream.on('timeout',()=>upstream.destroy());upstream.on('error',()=>fail(502,'KLSistemas indisponível. Tente novamente.'));req.on('aborted',()=>upstream.destroy());res.on('close',()=>upstream.destroy());req.pipe(upstream);return
 }
 if(url.pathname==='/'&&(req.method==='GET'||req.method==='HEAD')){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache','X-Frame-Options':'DENY','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; script-src 'self'; worker-src 'self'; manifest-src 'self'; img-src 'self'; style-src 'self' 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:portal);return}
 fail(404,'Escolha /beauty/ ou /mercado/.');
};}
