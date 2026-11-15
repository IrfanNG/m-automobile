import { site, addrLine, fmtTime, fmtHours } from './site.mjs';

const NAV = [
  { href: '/services/', label: 'Servis', key: 'services' },
  { href: '/about/', label: 'Tentang Kami', key: 'about' },
  { href: '/clients/', label: 'Pelanggan', key: 'clients' },
  { href: '/contact/', label: 'Lokasi', key: 'contact' },
  { href: '/faq/', label: 'Soalan Lazim', key: 'faq' },
];

const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');

/* ---------- small parts ---------- */
export const waBtn = (label, cls = 'btn btn-o', msg = '') =>
  `<a class="${cls}" href="${site.wa}" data-wa${msg ? `="${msg}"` : ''}>${label}</a>`;

export const crumbs = (items) => `
  <nav class="crumbs" aria-label="Laluan">
    <a href="/">Laman utama</a>${items.map(([label, href]) => ` <span aria-hidden="true">/</span> ${href ? `<a href="${href}">${label}</a>` : `<span aria-current="page">${label}</span>`}`).join('')}
  </nav>`;

// Page hero for every page except the homepage
export const phero = ({ crumbs: c, h1, sub, cta = '', image = null, alt = '', lqip = '' }) => `
  <section class="phero${image ? ' phero-has-img' : ''}">
    ${image ? `<div class="phero-media"${lqip ? ` style="background-image:url(${lqip})"` : ''}><img src="${image}" srcset="${image.srcset}" sizes="100vw" width="${image.w}" height="${image.h}" alt="${alt}" fetchpriority="high"></div>` : ''}
    <div class="phero-in wrap">
      ${crumbs(c)}
      <h1 class="hero-h1 phero-h1">${h1}</h1>
      ${sub ? `<p class="hero-sub" data-hero>${sub}</p>` : ''}
      ${cta ? `<div class="hero-cta" data-hero>${cta}</div>` : ''}
    </div>
  </section>`;

export const catCards = (eager = false) => Object.values(site.categories).map((c, i) => `
  <article class="cat" data-reveal>
    <a class="cat-img" href="/services/${c.slug}/" tabindex="-1" aria-hidden="true">
      ${((p) => `<img${eager && !i ? ' fetchpriority="high"' : ' loading="lazy"'} src="${p}" srcset="${p.srcset}" sizes="(max-width: 760px) 100vw, 50vw" width="${p.w}" height="${p.h}" alt="${i ? site.alt.light : site.alt.heavy}">`)(i ? site.img.light : site.img.heavy)}
    </a>
    <div class="cat-body">
      <p class="eyebrow">${c.tonnage}</p>
      <h3><a href="/services/${c.slug}/">${c.name}</a></h3>
      <p class="cat-types">${c.types.join(' · ')}</p>
      ${waBtn(`Tanya Servis ${c.name}`, 'btn btn-ink btn-sm', c.wa)}
    </div>
  </article>`).join('');

export const faqList = (ids) => {
  const items = ids ? ids.map((id) => site.faq.find((f) => f.id === id)) : site.faq;
  return items.map((f) => `
    <details data-reveal id="faq-${f.id}"><summary>${f.q}</summary><div class="ans"><p>${f.a}</p></div></details>`).join('');
};

export const addressCard = ({ mapBtn = true } = {}) => `
  <div class="card" data-reveal>
    <p class="eyebrow">Alamat bengkel</p>
    <p class="addr-co">${site.name}</p>
    <p class="addr-big">${site.address.street}</p>
    <p class="addr-sm">${site.address.postcode} ${site.address.city}, ${site.address.state}</p>
    ${site.landmark ? `<p class="addr-sm"><b>Panduan lokasi:</b> ${site.landmark}</p>` : ''}
    <div class="row">
      <button class="btn btn-line-dk btn-sm" data-copy="${site.name}, ${addrLine()}" type="button">Salin alamat</button>
      ${mapBtn ? `<a class="btn btn-ink btn-sm" href="${site.maps}" target="_blank" rel="noopener">Buka Google Maps</a>` : ''}
    </div>
  </div>`;

export const hoursCard = () => !site.hours ? '' : `
  <div class="card" data-reveal>
    <p class="eyebrow">Waktu operasi</p>
    <p class="hours-now" data-hours-now hidden><span class="dot"></span><span></span></p>
    <ul class="hours" data-hours='${JSON.stringify(site.hours.map(({ dow, open, close, day }) => ({ dow, open, close, day, o: open && fmtTime(open), c: close && fmtTime(close) })))}'>${site.hours.map((h) => `<li data-dow="${h.dow}"><span>${h.day}</span><b>${fmtHours(h)}</b></li>`).join('')}</ul>
  </div>`;

export const phoneCards = () => `
  <div class="phones">
    ${site.phones.map((p) => `<a class="card phone-card" href="tel:${p.tel}" data-reveal><span class="eyebrow">${p.label}</span><b>${p.display}</b><span class="go">Telefon sekarang</span></a>`).join('')}
  </div>`;

export const ctaBand = (text, btn) => `
  <div class="cta-band" data-reveal>
    <p>${text}</p>
    ${btn}
  </div>`;

/* ---------- structured data ---------- */
const business = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: site.name,
  telephone: site.phones[0].tel,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    postalCode: site.address.postcode,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    addressCountry: 'MY',
  },
  areaServed: [{ '@type': 'City', name: 'Machang' }, { '@type': 'State', name: 'Kelantan' }],
  identifier: { '@type': 'PropertyValue', name: 'No. pendaftaran SSM', value: site.reg },
  foundingDate: site.regYear,
  hasMap: site.maps,
  ...(site.hours ? {
    openingHoursSpecification: Object.values(site.hours.filter((h) => h.open).reduce((g, h) => {
      const k = `${h.open}-${h.close}`; (g[k] ||= { '@type': 'OpeningHoursSpecification', dayOfWeek: [], opens: h.open, closes: h.close }).dayOfWeek.push(h.en); return g;
    }, {})),
  } : {}),
  sameAs: [site.facebook],
  ...(site.email ? { email: site.email } : {}),
  knowsAbout: [...Object.values(site.categories).flatMap((c) => c.types), ...site.jobs.map((j) => strip(j.t))],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servis bengkel',
    itemListElement: site.jobs.map((j) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: strip(j.t), description: j.d } })),
  },
  ...(site.url ? { '@id': `${site.url}/#bengkel`, url: `${site.url}/`, logo: `${site.url}/assets/logo.png`, image: `${site.url}${site.img.hero}` } : {}),
};

export const faqLd = (ids) => {
  const items = ids ? ids.map((id) => site.faq.find((f) => f.id === id)) : site.faq;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: strip(f.q), acceptedAnswer: { '@type': 'Answer', text: strip(f.a).trim() } })),
  };
};

/* ---------- page shell ---------- */
export const page = ({ key, path, title, description, body, ld = [], preload = null, css = '' }) => `<!DOCTYPE html>
<!-- Generated by build.mjs from src/. Edit src/, then run: node build.mjs -->
<html lang="ms-MY">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#131417">
<meta property="og:type" content="website">
<meta property="og:locale" content="ms_MY">
<meta property="og:site_name" content="${site.brand}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta name="twitter:card" content="summary_large_image">
${site.url ? `<link rel="canonical" href="${site.url}${path}">
<meta property="og:url" content="${site.url}${path}">
<meta property="og:image" content="${site.url}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${site.brand}: bengkel kenderaan berat dan ringan di ${site.address.city}, ${site.address.state}">
<meta name="twitter:image" content="${site.url}/og.jpg">
` : ''}
<script>
(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');try{if(sessionStorage.getItem('mt')){d.classList.add('curtain-on');sessionStorage.removeItem('mt')}}catch(e){}})();
</script>
<link rel="icon" href="/assets/logo.png">
<link rel="preload" href="/assets/fonts/HankenGrotesk-400-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/SpaceMono-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/SpaceMono-700.woff2" as="font" type="font/woff2" crossorigin>
${preload ? `<link rel="preload" as="image" href="${preload}" imagesrcset="${preload.srcset}" imagesizes="${preload.sizes || '100vw'}" fetchpriority="high">\n` : ''}<style>${css}</style>
${[business, ...ld].map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>
<body data-page="${key}">
<div class="curtain" aria-hidden="true"><span class="curtain-mark"><span class="brand-logo"><img src="/assets/logo.png" width="60" height="57" alt=""></span><span class="curtain-txt">M Automobile</span></span></div>
<a class="skip" href="#main">Langkau ke kandungan</a>

<header class="hdr" id="top">
  <div class="hdr-in wrap">
    <a href="/" class="brand" aria-label="${site.brand}, laman utama">
      <span class="brand-logo"><img src="/assets/logo.png" width="44" height="42" alt="Logo ${site.brand}"></span>
      <span class="brand-txt"><b>${site.brand}</b></span>
    </a>
    <nav class="nav" id="nav" aria-label="Utama">
      ${NAV.map((n) => `<a href="${n.href}"${n.key === key ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n      ')}
      ${waBtn('WhatsApp Bengkel', 'btn btn-o btn-sm')}
    </nav>
    <button class="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Buka menu"><span></span><span></span><span></span></button>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="ftr">
  <div class="wrap">
    <p class="ftr-big" aria-hidden="true"><span>Singgoh la demo.</span></p>
    <div class="ftr-cols">
      <div class="ftr-brand">
        <span class="brand-logo"><img src="/assets/logo.png" width="44" height="42" alt="Logo ${site.brand}"></span>
        <p><b>${site.name}</b></p>
        <p>Bengkel kenderaan berat dan ringan di ${site.address.city}, ${site.address.state}.</p>
        <p>${addrLine()}</p>
      </div>
      <nav aria-label="Servis"><p class="eyebrow">Servis</p><a href="/services/">Semua servis</a><a href="/services/heavy-vehicles/">Kenderaan Berat</a><a href="/services/light-vehicles/">Kenderaan Ringan</a><a href="/#slot">Semak Slot Bengkel</a></nav>
      <nav aria-label="Bengkel"><p class="eyebrow">Bengkel</p><a href="/about/">Tentang Kami</a><a href="/contact/">Lokasi</a><a href="/clients/">Pelanggan</a><a href="/faq/">Soalan Lazim</a><a href="${site.profilePdf.href}" download>Profil Syarikat (PDF)</a></nav>
      <div><p class="eyebrow">Hubungi</p>${site.phones.map((p) => `<a href="tel:${p.tel}">${p.display}</a>`).join('')}${waBtn('WhatsApp Bengkel', '')}${site.email ? `<a href="mailto:${site.email}">${site.email}</a>` : ''}<a href="${site.facebook}" target="_blank" rel="noopener">Facebook</a></div>
    </div>
    <div class="ftr-bot">
      <span>© ${new Date().getFullYear()} ${site.name} · ${site.reg}</span>
      <span><a href="/privacy/">Dasar Privasi</a> · <a href="/terms/">Terma Penggunaan</a></span>
      <a href="#top" class="to-top">Ke atas</a>
    </div>
  </div>
</footer>

<div class="dock" aria-label="Hubungi bengkel">
  ${waBtn('WhatsApp Bengkel')}
  <a class="btn btn-ink" href="tel:${site.phones[0].tel}">Telefon sekarang</a>
</div>

<script>addEventListener('load',function(){var s=document.createElement('script');s.src='/app.js';document.body.appendChild(s)})</script>
</body>
</html>
`;
