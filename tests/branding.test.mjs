import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('portal, administração e PWA exibem KL Beauty e KL Mercado',async()=>{
 const portal=await readFile(new URL('../portal.html',import.meta.url),'utf8');
 const market=await readFile(new URL('../mercado/web/index.html',import.meta.url),'utf8');
 const admin=await readFile(new URL('../admin/app.js',import.meta.url),'utf8');
 const beauty=await readFile(new URL('../beauty/index.html',import.meta.url),'utf8');
 const manifest=JSON.parse(await readFile(new URL('../pwa/manifest.webmanifest',import.meta.url),'utf8'));
 assert.match(portal,/<h2>KL Beauty<\/h2>/);
 assert.match(portal,/<h2>KL Mercado<\/h2>/);
 assert.match(market,/<title>KL Mercado · Gestão comercial<\/title>/);
 assert.match(market,/<div>KL Mercado<small/);
 assert.match(admin,/mercado:'KL Mercado'/);
 assert.match(beauty,/<title>KL Beauty \| Gestão de salões<\/title>/);
 assert.equal(manifest.shortcuts.find(x=>x.url==='/beauty/')?.name,'KL Beauty');
 assert.equal(manifest.shortcuts.find(x=>x.url==='/mercado/')?.name,'KL Mercado');
});
