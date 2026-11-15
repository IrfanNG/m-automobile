// Renders the social share image (public/og.jpg, 1200x630) with headless Chrome,
// from the same data, fonts and hero photo as the site.
// Usage: node make-og.mjs   (re-run after changing the hero photo or business details)
import { writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { site, fmtTime } from './src/site.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const pub = (p) => pathToFileURL(join(ROOT, 'public', p)).href;
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const open = site.hours ? site.hours.filter((h) => h.open) : [];
const closed = site.hours ? site.hours.filter((h) => !h.open).map((h) => h.day) : [];
const hoursLine = open.length ? `${fmtTime(open[0].open)} – ${fmtTime(open[0].close)}${closed.length ? ` · ${closed.join(', ')} tutup` : ''}` : '';
const hero = site.img.hero.srcset.split(', ').map((s) => s.split(' ')[0]).find((p) => p.includes('-1280')) || site.img.hero.src;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face { font-family: H; src: url(${pub('assets/fonts/HankenGrotesk-400-800.woff2')}) format('woff2'); font-weight: 400 800; }
@font-face { font-family: M; src: url(${pub('assets/fonts/SpaceMono-700.woff2')}) format('woff2'); font-weight: 700; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body { position: relative; overflow: hidden; background: #131417; color: #fff; font-family: H, sans-serif; }
.bg { position: absolute; inset: 0; background: url(${pub(hero.replace(/^\//, ''))}) 50% 32% / cover no-repeat; }
.bg::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(10,11,13,.94) 0%, rgba(10,11,13,.82) 48%, rgba(10,11,13,.25) 100%); }
.in { position: absolute; inset: 64px 72px; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 18px; }
.logo { width: 76px; height: 76px; border-radius: 50%; background: #fff; display: grid; place-items: center; }
.logo img { width: 100%; height: 100%; border-radius: 50%; }
.brand b { font-size: 28px; font-weight: 700; letter-spacing: -.01em; }
.brand small { display: block; font: 700 15px M, monospace; letter-spacing: .08em; opacity: .7; margin-top: 4px; }
h1 { margin-top: auto; font-size: 88px; line-height: .92; font-weight: 800; letter-spacing: -.045em; }
h1 em { font-style: normal; color: #E85D1B; }
.place { margin-top: 18px; font-size: 34px; font-weight: 600; color: rgba(255,255,255,.88); letter-spacing: -.02em; }
.foot { margin-top: 34px; display: flex; gap: 14px; align-items: center; }
.pill { padding: 14px 24px; border-radius: 999px; font: 700 22px M, monospace; letter-spacing: -.01em; }
.wa { background: #C94A10; }
.hrs { border: 2px solid rgba(255,255,255,.4); font-size: 18px; }
</style></head><body>
<div class="bg"></div>
<div class="in">
  <div class="brand"><span class="logo"><img src="${pub('assets/logo-round.png')}"></span><span><b>${site.brand}</b><small>SDN. BHD.</small></span></div>
  <h1>Bengkel Kenderaan<br>Berat <em>&amp;</em> Ringan</h1>
  <p class="place">di ${site.address.city}, ${site.address.state}.</p>
  <div class="foot"><span class="pill wa">WhatsApp ${site.phones[0].display}</span>${hoursLine ? `<span class="pill hrs">${hoursLine}</span>` : ''}</div>
</div>
</body></html>`;

const dir = mkdtempSync(join(tmpdir(), 'og-'));
const file = join(dir, 'og.html');
writeFileSync(file, html);
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--allow-file-access-from-files',
  '--window-size=1200,630', '--virtual-time-budget=3000', `--screenshot=${join(ROOT, 'public/og.jpg')}`, pathToFileURL(file).href], { stdio: 'ignore' });
console.log('saved public/og.jpg');
