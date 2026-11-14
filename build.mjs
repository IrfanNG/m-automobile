// Builds the static site into public/. No dependencies.
// Usage: node build.mjs   (run `node fetch-assets.mjs` first if images were added)
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page } from './src/layout.mjs';
import { pages } from './src/pages.mjs';
import { site, addrLine, remoteImages, fmtHours } from './src/site.mjs';

const out = join(dirname(fileURLToPath(import.meta.url)), 'public');
const byPath = Object.fromEntries(pages.map((p) => [p.path, p]));
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');

// All CSS is inlined into each page (one small file, so no render-blocking request).
const ROOT = dirname(fileURLToPath(import.meta.url));
const minify = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const css = minify([
  readFileSync(join(ROOT, 'public/assets/fonts/fonts.css'), 'utf8'),
  readFileSync(join(ROOT, 'public/vendor/lenis.css'), 'utf8'),
  readFileSync(join(ROOT, 'src/styles.css'), 'utf8'),
].join('\n'));

// Breadcrumb chain from the URL: /services/heavy-vehicles/ -> /, /services/, /services/heavy-vehicles/
const chain = (path) => {
  const parts = path.split('/').filter(Boolean);
  return ['/', ...parts.map((_, i) => `/${parts.slice(0, i + 1).join('/')}/`)].map((p) => byPath[p]).filter(Boolean);
};

for (const p of pages) {
  const ld = [...(p.ld || [])];
  if (site.url && p.path !== '/') {
    ld.push({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: chain(p.path).map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${site.url}${c.path}` })),
    });
  }
  const file = join(out, p.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page({ ...p, ld, css }));
  console.log('built', p.path);
}

// robots.txt (sitemap line only when the domain is known)
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n${site.url ? `\nSitemap: ${site.url}/sitemap.xml\n` : ''}`);
if (site.url) {
  writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${site.url}${p.path}</loc></url>`).join('\n')}\n</urlset>\n`);
}

// llms.txt: plain summary for AI answer engines, from the same data as the pages
const link = (p) => `${site.url || ''}${p}`;
const svcPages = pages.filter((p) => p.path !== '/' && p.key !== 'legal');
writeFileSync(join(out, 'llms.txt'), `# ${site.name}

> Bengkel kenderaan berat dan ringan di ${site.address.city}, ${site.address.state}, Malaysia. Servis dan pembaikan lori, treler, kenderaan komersial, kereta, van dan pikap. Berdaftar sejak ${site.regYear} (${site.reg}).

- Alamat: ${addrLine()}
- Telefon dan WhatsApp: ${site.phones[0].display}
- Telefon: ${site.phones[1].display}
- Google Maps: ${site.maps}
- Facebook: ${site.facebook}
${site.email ? `- Email: ${site.email}\n` : ''}${site.hours ? `- Waktu operasi: ${site.hours.map((h) => `${h.day} ${fmtHours(h)}`).join('; ')}\n` : ''}- Pelanggan: ${[...site.clients.gov, ...site.clients.biz].map((c) => strip(c.name)).join(', ')}
- Terima kerja jabatan kerajaan melalui Pesanan Tempatan (LO), dan akaun syarikat untuk armada.

## Kenderaan
${Object.values(site.categories).map((c) => `- ${c.name} (${c.tonnage.toLowerCase()}): ${c.types.join(', ')}`).join('\n')}

## Servis
${site.jobs.map((j) => `- ${strip(j.t)}: ${j.d}`).join('\n')}

## Halaman
${svcPages.map((p) => `- [${p.name}](${link(p.path)}): ${strip(p.description)}`).join('\n')}

## Soalan lazim
${site.faq.map((f) => `### ${strip(f.q)}\n${strip(f.a).trim()}`).join('\n\n')}
`);

const missing = Object.keys(remoteImages).filter((l) => !existsSync(join(out, l)));
if (missing.length) console.warn(`\n${missing.length} image(s) missing. Run: node fetch-assets.mjs`);
