import {gzip as compress} from 'node:zlib';
import {promisify} from 'node:util';
const gzip=promisify(compress);
export function acceptsGzip(header=''){return header.split(',').some(part=>{const [name,...params]=part.trim().split(';');if(name.toLowerCase()!=='gzip')return false;const q=params.find(p=>p.trim().startsWith('q='));return !q||Number(q.trim().slice(2))>0})}
// Compress asynchronously; never cache authenticated tenant responses.
export async function sendJSON(res,status,body,extra={}){let data=Buffer.from(JSON.stringify(body));const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Accept-Encoding',...extra};if(data.length>=1024&&acceptsGzip(res.req?.headers['accept-encoding'])){data=await gzip(data,{level:4});headers['Content-Encoding']='gzip'}if(res.destroyed)return;headers['Content-Length']=data.length;res.writeHead(status,headers);res.end(data)}
