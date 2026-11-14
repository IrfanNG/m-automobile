// Downloads third-party assets once so the live site loads nothing from other servers
// (except the Google Map on the Lokasi page). Safe to re-run: existing files are skipped.
// Usage: node fetch-assets.mjs
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { remoteImages } from './src/site.mjs';

const pub = join(dirname(fileURLToPath(import.meta.url)), 'public');
const save = async (url, file, headers = {}) => {
  const dest = join(pub, file);
  if (existsSync(dest)) return false;
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
  console.log('saved', file);
  return true;
};

// 1. Images
for (const [local, remote] of Object.entries(remoteImages)) await save(remote, local);

// 2. Scripts
const VENDOR = {
  'gsap.min.js': 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',
  'ScrollTrigger.min.js': 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
  'SplitText.min.js': 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js',
  'lenis.min.js': 'https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js',
  'lenis.css': 'https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.css',
};
for (const [f, u] of Object.entries(VENDOR)) await save(u, `vendor/${f}`);

// 3. Fonts: latin subset only, rewritten to local woff2 files
const fontsCss = join(pub, 'assets/fonts/fonts.css');
if (!existsSync(fontsCss)) {
  const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36' };
  const css = await (await fetch('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400..800&family=Space+Mono:wght@400;700&display=swap', { headers: UA })).text();
  const blocks = css.split('/* ').filter((b) => b.startsWith('latin */'));
  let local = '';
  for (const b of blocks) {
    const fam = b.match(/font-family: '([^']+)'/)[1].replace(/\s+/g, '');
    const wt = b.match(/font-weight: ([^;]+);/)[1].replace(/\s+/g, '-');
    const url = b.match(/url\((https:[^)]+)\)/)[1];
    const name = `${fam}-${wt}.woff2`;
    await save(url, `assets/fonts/${name}`);
    local += '/* ' + b.replace(url, `/assets/fonts/${name}`);
  }
  mkdirSync(dirname(fontsCss), { recursive: true });
  writeFileSync(fontsCss, local);
  console.log('saved assets/fonts/fonts.css');
}
console.log('done');
