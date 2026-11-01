import { readFile, stat, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile('dist/index.html','utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs');
assert.equal((html.match(/<h1\b/g)||[]).length,1,'Exactly one h1 required');
assert.equal((html.match(/<section /g)||[]).length,14,'Expected all 14 sections');
for (const [,anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(anchor),`Broken anchor: ${anchor}`);
for (const [,path] of html.matchAll(/(?:src|href)="(assets\/[^"#]+)"/g)) await stat('dist/'+path);
for (const [,path] of html.matchAll(/poster="(assets\/[^"#]+)"/g)) await stat('dist/'+path);
const tools=JSON.parse(await readFile('data/tools.json','utf8')).tools;
for (const tool of tools) {
  if(tool.status==='Prototype'&&!tool.media)continue;
  assert.ok(tool.media?.src && tool.media.alt && tool.media.source,`Missing sourced project preview: ${tool.name}`);
  // Rendered asset references below cover catalogue overrides as well as defaults.
}
for(const video of html.matchAll(/<video ([^>]+)>/g)){
  assert.ok(video[1].includes('preload="none"')&&['autoplay','muted','loop','playsinline'].every(a=>video[1].includes(a)),'Viewport loops must be silent, inline, and lazy loaded');
}
for (const [,set] of html.matchAll(/srcset="([^"]+)"/g)) for (const candidate of set.split(',')) await stat('dist/'+candidate.trim().split(' ')[0]);
const css=await readFile('dist/assets/site.css','utf8');
assert.ok(css.includes('prefers-reduced-motion'),'Reduced motion support');
assert.ok(css.includes('prefers-color-scheme:dark'),'Dark theme support');
assert.ok(!/\[TODO|\[confirm|Referees|lorem ipsum|localhost/i.test(html),'Unfinished or private content in page');
assert.ok(!css.includes('@import'),'Avoid stylesheet import chains');
assert.ok((html.match(/<video\b/g)||[]).length>=4,'Expected lazy viewport video loops');
for(const a of html.matchAll(/<a ([^>]+)>/g)){if(/href="https?:/.test(a[1]))assert.ok(a[1].includes('target="_blank"')&&a[1].includes('noopener'),'External links open safely in new tabs');if(/href="mailto:/.test(a[1]))assert.ok(!a[1].includes('target='),'Email uses the mail app');}
assert.ok(!/ADHD|motion-toggle|Pause motion/i.test(html),'No personal diagnosis or global motion control');
assert.ok(!/Cyana/i.test(html),'Correct moth names');
for(const [,path] of html.matchAll(/data-src="(assets\/[^"]+)"/g))await stat('dist/'+path);
assert.ok(!/assets\/cv\.pdf|hero-avatar|Whose World Counts/i.test(html),'Removed personal assets or concept remain in the page');
assert.ok(!(await readdir('dist/assets')).some(n=>n.endsWith('.pdf')),'No downloadable PDF in the public assets');
assert.ok(!(await readdir('dist/assets/images')).some(n=>n.startsWith('pavan-')),'No portrait in the public assets');
const js=await stat('dist/assets/site.js'); assert.ok(js.size<=16384,'JavaScript budget exceeded');
const fs = await import('node:zlib');
const gzip=fs.gzipSync(Buffer.concat([Buffer.from(html),Buffer.from(css),await readFile('dist/assets/site.js')]));
assert.ok(gzip.length < 100000,'Initial transfer budget exceeded');
const hero=await stat('dist/assets/images/hero-landscape-hq.avif'); assert.ok(hero.size<=163840,'Hero image budget exceeded');
let total=0;async function walk(path){for(const entry of await readdir(path,{withFileTypes:true})){const file=path+'/'+entry.name;if(entry.isDirectory())await walk(file);else total+=(await stat(file)).size}}await walk('dist');
console.log(JSON.stringify({sections:14,anchors:ids.length,clientJavaScriptBytes:js.size,initialGzipBytes:gzip.length,heroAvifBytes:hero.size,totalStaticBytes:total,checks:'passed'},null,2));
