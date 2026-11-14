import { site, addrLine } from './site.mjs';
import { waBtn, phero, catCards, faqList, faqLd, addressCard, hoursCard, phoneCards, ctaBand } from './layout.mjs';

const { city, state } = site.address;
const tel = site.phones[0];
const telBtn = (cls = 'btn btn-line') => `<a class="${cls}" href="tel:${tel.tel}">${tel.display}</a>`;

/* ---------- shared blocks ---------- */
const marquee = () => {
  const row = (list, dup) => list.map((c) => `<span class="mq-i${c.mono ? ' mono' : ''}${dup ? ' mq-dup' : ''}"${dup ? ' aria-hidden="true"' : ''}><b>${c.name}</b>${c.sub ? `<small>${c.sub}</small>` : ''}</span>`).join('');
  return `
  <div class="marquee" aria-label="Senarai pelanggan">
    <div class="mq-row"><div class="mq-track">${row(site.clients.gov)}${row(site.clients.gov, true)}</div></div>
    <div class="mq-row mq-rev"><div class="mq-track">${row(site.clients.biz)}${row(site.clients.biz, true)}</div></div>
  </div>`;
};

const jobsList = () => `
  <ol class="jobs" aria-label="Kerja yang kami buat">
    ${site.jobs.map((j) => `<li class="job" data-reveal>
      <span class="job-fill" aria-hidden="true"></span>
      <b class="job-t" data-scramble>${j.t}</b>
      <span class="job-d" data-scramble>${j.d}</span>
      <span class="job-imgs" aria-hidden="true">${j.imgs.map((p, k) => `<img src="${p}" srcset="${p.srcset}" sizes="(max-width: 760px) 25vw, 104px" width="${p.w}" height="${p.h}" alt="${j.alts[k]}" loading="lazy">`).join('')}</span>
    </li>`).join('\n    ')}
  </ol>`;

const chips = (name, type, items, heavy = false) => items.map((v) =>
  `<label class="chip"><input type="${type}" name="${name}" value="${v.replace(/&amp;/g, '&')}"${heavy ? ' data-heavy' : ''}><span>${v}</span></label>`).join('\n          ');

const slotBuilder = () => `
<section class="sec sec-ink" id="slot">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Semak Slot Bengkel</h2>
      <p class="lede" data-reveal>Pilih kenderaan, kerja dan hari. Mesej WhatsApp disediakan untuk anda hantar.</p>
    </div>
    <div class="enq">
      <form class="enq-steps" onsubmit="return false">
        <fieldset class="step" data-step="veh" data-reveal>
          <legend><span class="sn">01</span> Kenderaan anda <span class="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></legend>
          <p class="chip-label">Ringan · bawah 3 tan</p>
          <div class="chips">
          ${chips('veh', 'radio', site.categories.light.types)}
          </div>
          <p class="chip-label">Berat · atas 3 tan</p>
          <div class="chips">
          ${chips('veh', 'radio', site.categories.heavy.types, true)}
          </div>
          <div class="fields">
            <label class="field"><span class="sr">Model dan tahun</span><input type="text" name="model" placeholder="Model dan tahun, cth. Hilux 2018"></label>
            <label class="field field-heavy" hidden><span class="sr">Saiz kenderaan</span><input type="text" name="size" placeholder="Saiz, cth. 5 tan atau 10 tayar"></label>
          </div>
        </fieldset>
        <fieldset class="step" data-step="job" data-reveal>
          <legend><span class="sn">02</span> Apa yang perlu dibuat? <small>Boleh pilih lebih</small> <span class="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></legend>
          <div class="chips">
          ${chips('job', 'checkbox', site.jobs.map((j) => j.t))}
          </div>
          <label class="field"><span class="sr">Ceritakan masalahnya</span><textarea name="issue" rows="2" placeholder="Ceritakan masalahnya (tidak wajib)"></textarea></label>
        </fieldset>
        <fieldset class="step" data-step="when" data-reveal>
          <legend><span class="sn">03</span> Bila nak datang? <span class="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></legend>
          <div class="chips">
          ${chips('when', 'radio', ['Hari ini', 'Esok', 'Minggu ini', 'Belum pasti'])}
          </div>
        </fieldset>
      </form>
      <div class="phone-wrap" data-reveal>
        <div class="phone">
          <div class="chat-head">
            <span class="av"><img src="/assets/logo.png" width="34" height="33" alt=""></span>
            <span><b>${site.brand}</b><small>${tel.display}</small></span>
          </div>
          <div class="chat-body">
            <div class="bubble" aria-live="polite">
              <p>Salam M Automobile. Saya nak semak slot bengkel.</p>
              <p><b>Kenderaan:</b> <span class="v empty" data-out="veh">pilih kenderaan</span></p>
              <p><b>Kerja:</b> <span class="v empty" data-out="job">pilih kerja</span></p>
              <p class="issue-line" hidden><b>Masalah:</b> <span class="v" data-out="issue"></span></p>
              <p><b>Bila:</b> <span class="v empty" data-out="when">pilih hari</span></p>
            </div>
          </div>
        </div>
        <a class="btn btn-wa" id="send" href="${site.wa}">Hantar di WhatsApp</a>
        <p class="note">WhatsApp dibuka dengan mesej ini. Anda boleh ubah sebelum hantar.</p>
      </div>
    </div>
  </div>
</section>`;

const faqSection = ({ ids, search = false, heading = 'Soalan Lazim', lede = '', more = false, h = 'h2', tone = 'sec-cream' }) => `
<section class="sec ${tone}" id="soalan">
  <div class="wrap">
    <div class="faq-head">
      <div>
        <${h} data-split>${heading}</${h}>
        ${lede ? `<p class="lede" data-reveal>${lede}</p>` : ''}
      </div>
      ${search ? `<label class="search" data-reveal><span class="sr">Cari soalan</span><input type="search" id="faq-q" placeholder="Cari, cth. kos, slot, lori, LO"></label>` : ''}
    </div>
    ${search ? `<p class="faq-count muted" id="faq-count" aria-live="polite"></p>` : ''}
    <div class="faq" id="faq">${faqList(ids)}
    </div>
    ${search ? `<div class="faq-empty" id="faq-empty" hidden>
      <p>Tiada soalan yang sepadan dengan "<span id="faq-term"></span>".</p>
      <div class="row"><a class="btn btn-wa btn-sm" id="faq-ask" href="${site.wa}" target="_blank" rel="noopener">Tanya soalan ini di WhatsApp</a><button class="btn btn-line-dk btn-sm" id="faq-clear" type="button">Kosongkan carian</button></div>
    </div>` : ''}
    <div class="faq-close" data-reveal>
      <p>${more ? '<a class="link" href="/faq/">Semua soalan lazim</a>' : '<b>Tak jumpa jawapan?</b> Tanya terus di WhatsApp.'}</p>
      ${waBtn('Tanya di WhatsApp', 'btn btn-o btn-sm')}
    </div>
  </div>
</section>`;

/* =================================================================== */

const home = {
  path: '/',
  key: 'home',
  name: 'Laman utama',
  title: `Bengkel Lori &amp; Kereta di ${city}, ${state} | ${site.short}`,
  description: `Bengkel kenderaan berat dan ringan di ${city}, ${state}. Servis dan pembaikan lori, treler, kenderaan komersial, kereta, van dan pikap. WhatsApp 013-207 8119.`,
  preload: site.img.hero,
  ld: [faqLd(['kos', 'sebut-harga', 'slot', 'gambar'])],
  body: `
<section class="hero">
  <div class="hero-media" style="background-image:url(${site.lqip.hero})">
    <img src="${site.img.hero}" srcset="${site.img.hero.srcset}" sizes="100vw" width="${site.img.hero.w}" height="${site.img.hero.h}" alt="Pikap merah di dalam bengkel" fetchpriority="high">
  </div>
  <div class="hero-in wrap">
    <h1 class="hero-h1">
      <span class="l">Bengkel Kenderaan</span>
      <span class="l">Berat <em>&amp;</em> Ringan</span>
      <span class="l l-sm">di ${city}, ${state}.</span>
    </h1>
    <div class="hero-foot">
      <p class="hero-sub" data-hero>Servis dan pembaikan lori, treler, kenderaan komersial, kereta, van dan pikap. WhatsApp model kenderaan dan masalahnya untuk tanya anggaran atau semak slot.</p>
      <div class="hero-cta" data-hero>
        ${waBtn('WhatsApp Bengkel')}
        ${telBtn()}
      </div>
    </div>
  </div>
</section>

<section class="sec sec-cream" id="tentang">
  <div class="wrap">
    <p class="statement" data-words>Kami servis dan baiki kenderaan berat dan ringan untuk jabatan kerajaan, syarikat dan pemilik persendirian di ${city} dan sekitar ${state}.</p>
    <ul class="stats stats-txt">
      <li data-reveal><b>${site.regYear}</b><span>Berdaftar sebagai Sdn. Bhd.<br><small>${site.reg}</small></span></li>
      <li data-reveal><b>Berat</b><span>${site.categories.heavy.tonnage}<br><small>${site.categories.heavy.types.join(', ')}</small></span></li>
      <li data-reveal><b>Ringan</b><span>${site.categories.light.tonnage}<br><small>${site.categories.light.types.join(', ')}</small></span></li>
      <li data-reveal><b>LO</b><span>Terima Pesanan Tempatan<br><small>Jabatan dan agensi kerajaan</small></span></li>
    </ul>
  </div>
</section>

<section class="sec" id="servis">
  <div class="wrap">
    <div class="sec-head sec-head-row">
      <div>
        <h2 data-split>Servis Kenderaan Berat dan Ringan</h2>
      </div>
      <a class="link" href="/services/" data-reveal>Semua kerja yang kami buat</a>
    </div>
    <div class="cats">${catCards()}
    </div>
  </div>
</section>

<section class="sec sec-cream sec-clients" id="pelanggan">
  <div class="wrap center">
    <h2 data-split>Bengkel untuk Jabatan Kerajaan dan Syarikat</h2>
    <p class="lede" data-reveal>Jabatan kerajaan, syarikat logistik dan perniagaan tempatan yang menghantar kenderaan ke bengkel ini.</p>
  </div>
  ${marquee()}
  <div class="wrap center">
    <a class="link" href="/clients/">Kerja jabatan dan akaun syarikat</a>
  </div>
  ${site.google ? `<figure class="review wrap center" data-reveal>
    <p class="review-stars" aria-label="${site.google.rating} bintang di Google"><span aria-hidden="true">★★★★★</span> ${site.google.rating} di Google · ${site.google.count} ulasan</p>
    <blockquote lang="ms">“${site.google.quote.text}”</blockquote>
    <figcaption>${site.google.quote.name}, ulasan Google · <a class="link" href="${site.maps}" target="_blank" rel="noopener">Baca ulasan di Google</a></figcaption>
  </figure>` : ''}
</section>

${slotBuilder()}

<section class="sec" id="lokasi">
  <div class="wrap">
    <div class="sec-head sec-head-row">
      <div>
        <h2 data-split>Lokasi Bengkel di ${city}</h2>
      </div>
      <a class="link" href="/contact/" data-reveal>Peta dan arah</a>
    </div>
    <div class="loc-mini">
      ${addressCard()}
      ${hoursCard()}
      ${phoneCards()}
    </div>
  </div>
</section>

${faqSection({ ids: ['kos', 'sebut-harga', 'slot', 'gambar'], more: true })}
`,
};

/* ---------- /services/ ---------- */
const services = {
  path: '/services/',
  key: 'services',
  name: 'Servis',
  preload: { ...site.img.heavy, sizes: '(max-width: 760px) 100vw, 50vw' },
  ld: [faqLd(['kenderaan', 'scan', 'enjin', 'gambar', 'tempoh'])],
  title: `Servis Kenderaan Berat &amp; Ringan di ${city} | ${site.short}`,
  description: `Servis berkala, scan enjin, overhaul, brek, absorber, alignment dan elektrikal untuk lori, treler, kereta, van dan pikap di ${city}, ${state}.`,
  body: `
${phero({
  crumbs: [['Servis']],
  h1: `Servis Kenderaan Berat dan Ringan di ${city}, ${state}`,
  sub: 'Lori, treler, kenderaan komersial, kereta, van dan pikap. Pilih kategori kenderaan anda atau lihat senarai kerja di bawah.',
  cta: `${waBtn('WhatsApp Bengkel')} ${telBtn()}`,
})}

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Kenderaan Berat dan Kenderaan Ringan</h2>
    </div>
    <div class="cats">${catCards(true)}
    </div>
  </div>
</section>

<section class="sec sec-cream">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Servis, Overhaul, Brek dan Elektrikal</h2>
      <p class="lede" data-reveal>Semua kerja di bawah dibuat untuk kenderaan berat dan ringan. Scan komputer dibuat dulu untuk cari punca masalah, kemudian sebut harga diberi sebelum pembaikan dimulakan.</p>
    </div>
    ${jobsList()}
    ${ctaBand('<b>Tak pasti apa masalahnya?</b> Hantar gambar, video atau rakaman bunyi kerosakan di WhatsApp.', waBtn('Hantar di WhatsApp', 'btn btn-o btn-sm', 'Salam M Automobile. Saya nak tanya tentang kerosakan kenderaan saya. Model kenderaan _____. Saya lampirkan gambar/video.'))}
  </div>
</section>

${faqSection({ ids: ['kenderaan', 'scan', 'enjin', 'gambar', 'tempoh'], heading: `Soalan Lazim Servis Kenderaan di ${city}`, more: true, tone: '' })}
`,
};

/* ---------- /services/heavy-vehicles/ and /light-vehicles/ ---------- */
const catPage = (k) => {
  const c = site.categories[k];
  const other = site.categories[k === 'heavy' ? 'light' : 'heavy'];
  const faqIds = k === 'heavy' ? ['berat-jenis', 'berat-scan', 'berat-jabatan', 'sebut-harga', 'tempoh'] : ['ringan-jenis', 'ringan-baiki-besar', 'scan', 'sebut-harga', 'tempoh'];
  return {
    path: `/services/${c.slug}/`,
    key: 'services',
    name: c.name,
    preload: k === 'heavy' ? site.img.heavy : site.img.light,
    title: `${c.title} | ${site.short}`,
    description: `${c.types.join(', ')} (${c.tonnage.toLowerCase()}). Servis, scan enjin, overhaul, brek, absorber dan alignment di ${site.short}, ${city}, ${state}.`,
    ld: [faqLd(faqIds)],
    body: `
${phero({
  crumbs: [['Servis', '/services/'], [c.name]],
  h1: c.h1,
  sub: c.sub,
  cta: `${waBtn(`Tanya Servis ${c.name}`, 'btn btn-o', c.wa)} <a class="btn btn-line" href="/contact/">Lokasi bengkel</a>`,
  image: k === 'heavy' ? site.img.heavy : site.img.light,
  lqip: site.lqip[k],
  alt: site.alt[k],
})}

<section class="sec">
  <div class="wrap">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">Kenderaan yang kami terima</p>
        <p class="split-big">${c.tonnage}</p>
        <ul class="tags">${c.types.map((t) => `<li>${t}</li>`).join('')}</ul>
      </div>
      <div data-reveal>
        <p class="eyebrow">Kerja yang kami buat</p>
        <ol class="worklist">${c.work.map((w, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span>${w}</li>`).join('')}</ol>
      </div>
    </div>
  </div>
</section>

<section class="sec sec-ink">
  <div class="wrap">
    <div class="split">
      <div>
        <h2 data-split>Cara Semak Slot Servis ${c.short}</h2>
        <p class="lede" data-reveal>Maklumat ini membantu kami semak sama ada kami boleh bantu dan bila ada slot.</p>
      </div>
      <div data-reveal>
        <ol class="worklist worklist-dk">${c.send.map((w, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span>${w}</li>`).join('')}</ol>
        <div class="row">${waBtn(`Tanya Servis ${c.name}`, 'btn btn-wa', c.wa)}</div>
      </div>
    </div>
  </div>
</section>

${faqSection({ ids: faqIds, heading: `Soalan Lazim Servis ${c.short}`, more: true })}

<section class="sec sec-tight">
  <div class="wrap">
    <a class="see-also" href="/services/${other.slug}/" data-reveal>
      <span class="eyebrow">Lihat juga · ${other.tonnage}</span>
      <b>${other.name}</b>
      <span class="muted">${other.types.join(' · ')}</span>
    </a>
  </div>
</section>
`,
  };
};

/* ---------- /clients/ ---------- */
const clientList = (list) => `<ul class="clist">${list.map((c) => `<li data-reveal><b>${c.name}</b>${c.sub ? `<small>${c.sub}</small>` : ''}</li>`).join('')}</ul>`;

const clients = {
  path: '/clients/',
  key: 'clients',
  name: 'Pelanggan',
  title: `Bengkel Kenderaan Jabatan (LO) &amp; Syarikat | ${site.short}`,
  description: `Bengkel di ${city} untuk kenderaan jabatan kerajaan dan syarikat. Terima LO, dengan sebut harga, invois, delivery order dan akaun syarikat.`,
  ld: [faqLd(['agensi', 'dokumen-jabatan', 'armada', 'persendirian'])],
  body: `
${phero({
  crumbs: [['Pelanggan']],
  h1: `Pelanggan Bengkel ${site.short}, ${city}`,
  sub: 'Jabatan kerajaan, syarikat logistik dan perniagaan tempatan menghantar kenderaan mereka ke bengkel ini. Kami juga terima pemilik persendirian.',
  cta: waBtn('WhatsApp Bengkel'),
})}

<section class="sec">
  <div class="wrap">
    <div class="split">
      <div>
        <h2 data-split>Jabatan dan Agensi Kerajaan</h2>
        ${clientList(site.clients.gov)}
      </div>
      <div>
        <h2 data-split>Syarikat dan Perniagaan</h2>
        ${clientList(site.clients.biz)}
      </div>
    </div>
  </div>
</section>

<section class="sec sec-cream" id="cara">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Kerja Jabatan Melalui LO dan Akaun Syarikat</h2>
    </div>
    <div class="ways">
      <article class="way" data-reveal>
        <p class="eyebrow">Jabatan kerajaan</p>
        <h3>Kerja melalui LO</h3>
        <ul class="checks">
          <li>Terima Pesanan Tempatan (LO)</li>
          <li>Sebut harga bertulis sebelum kerja dimulakan</li>
          <li>Invois, delivery order dan resit untuk rekod jabatan</li>
        </ul>
        ${waBtn('Tanya kerja jabatan', 'btn btn-ink btn-sm', 'Salam M Automobile. Saya dari jabatan _____. Saya nak tanya tentang servis kenderaan jabatan melalui LO. Kenderaan _____.')}
      </article>
      <article class="way" data-reveal>
        <p class="eyebrow">Syarikat dan armada</p>
        <h3>Akaun syarikat</h3>
        <ul class="checks">
          <li>Buka satu akaun untuk syarikat anda</li>
          <li>Setiap kenderaan direkodkan ikut nombor plat</li>
          <li>Sejarah servis dan invois di bawah satu akaun</li>
        </ul>
        ${waBtn('Tanya akaun syarikat', 'btn btn-ink btn-sm', 'Salam M Automobile. Saya dari syarikat _____. Saya nak tanya tentang buka akaun untuk kenderaan syarikat. Bilangan dan jenis kenderaan _____.')}
      </article>
    </div>
  </div>
</section>

${faqSection({ ids: ['agensi', 'dokumen-jabatan', 'armada', 'persendirian'], heading: 'Soalan Lazim Kerja Jabatan dan Syarikat', more: true, tone: '' })}
`,
};

/* ---------- /contact/ ---------- */
const contact = {
  path: '/contact/',
  key: 'contact',
  name: 'Lokasi',
  title: `Lokasi Bengkel di ${city}, ${state} | ${site.short}`,
  description: `Bengkel ${site.short} di ${addrLine()}. Telefon atau WhatsApp ${site.phones[0].display}. Peta dan arah ke bengkel.`,
  ld: [faqLd(['waktu', 'telefon', 'arah', 'slot'])],
  body: `
${phero({
  crumbs: [['Lokasi']],
  h1: `Lokasi Bengkel ${site.short} di ${city}, ${state}`,
  sub: addrLine(),
  cta: `<a class="btn btn-o" href="${site.maps}" target="_blank" rel="noopener">Buka Google Maps</a> ${telBtn()}`,
})}

<section class="sec">
  <div class="wrap">
    <div class="loc">
      <div class="loc-info">
        ${addressCard({ mapBtn: false })}
        ${hoursCard()}
        ${phoneCards()}
        ${site.email ? `<a class="card phone-card" href="mailto:${site.email}" data-reveal><span class="eyebrow">Email</span><b class="fb">${site.email}</b><span class="go">Hantar email</span></a>` : ''}
        <a class="card phone-card" href="${site.facebook}" target="_blank" rel="noopener" data-reveal><span class="eyebrow">Facebook</span><b class="fb">${site.name}</b><span class="go">Buka Facebook</span></a>
      </div>
      <div class="loc-map" data-reveal>
        <iframe title="Peta lokasi ${site.brand}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-src="${site.mapEmbed}"></iframe>
        <noscript><iframe title="Peta lokasi ${site.brand}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${site.mapEmbed}"></iframe></noscript>
        <p class="dialect">Singgoh la <em>demo.</em></p>
        <p class="muted">Lori, treler, kenderaan komersial, kereta, van dan pikap · ${city}, ${state}</p>
      </div>
    </div>
  </div>
</section>

${faqSection({ ids: ['waktu', 'telefon', 'arah', 'slot'], heading: `Soalan Lazim Lokasi Bengkel ${city}`, more: true })}
`,
};

/* ---------- /faq/ ---------- */
const faq = {
  path: '/faq/',
  key: 'faq',
  name: 'Soalan Lazim',
  title: `Soalan Lazim Bengkel Kenderaan ${city} | ${site.short}`,
  description: `Jawapan tentang kos, sebut harga, slot bengkel, jenis kenderaan dan kerja jabatan kerajaan di ${site.short}, ${city}.`,
  ld: [faqLd()],
  body: `
${phero({
  crumbs: [['Soalan Lazim']],
  h1: `Soalan Lazim Bengkel ${site.short}, ${city}`,
  sub: 'Jawapan tentang kos, sebut harga, slot bengkel, jenis kenderaan dan kerja jabatan kerajaan.',
})}
${faqSection({ search: true, heading: 'Kos, Slot dan Servis Kenderaan', h: 'h2' })}
`,
};

/* ---------- legal ---------- */
const legal = ({ path, title, h1, intro, sections }) => ({
  path,
  key: 'legal',
  name: h1,
  title: `${h1} | ${site.short}`,
  description: `${h1} laman web ${site.name}, bengkel kenderaan berat dan ringan di ${city}, ${state}.`,
  body: `
${phero({ crumbs: [[h1]], h1, sub: 'Kemas kini terakhir: 14 November 2026' })}
<section class="sec">
  <div class="wrap prose">
    <p>${intro}</p>
    ${sections.map(([h, p]) => `<h2>${h}</h2><p>${p}</p>`).join('\n    ')}
    <h2>Hubungi kami</h2>
    <p>${site.name}<br>${addrLine()}<br><a class="link" href="tel:${tel.tel}">${tel.display}</a></p>
  </div>
</section>
`,
});

const privacy = legal({
  path: '/privacy/',
  h1: 'Dasar Privasi',
  intro: `Notis ini menerangkan maklumat yang dikumpul apabila anda menggunakan laman web ${site.name}.`,
  sections: [
    ['Maklumat yang laman ini kumpul', 'Laman ini tidak mempunyai borang yang menghantar data, tidak memasang kuki sendiri dan tidak menggunakan alat penjejakan.'],
    ['Apabila anda menghubungi kami', 'Butang WhatsApp membuka aplikasi WhatsApp dengan mesej yang anda boleh ubah sebelum hantar. Mesej, nombor telefon dan maklumat kenderaan yang anda hantar digunakan untuk menjawab pertanyaan dan menguruskan kerja bengkel.'],
    ['Rekod bengkel', 'Untuk kerja yang dibuat, kami menyimpan rekod seperti nama, nombor telefon, nombor plat, sebut harga dan invois.'],
    ['Peta Google dan pautan luar', 'Halaman Lokasi memaparkan Peta Google. Google mungkin mengumpul data mengikut dasar privasinya sendiri. Pautan ke WhatsApp, Google Maps dan Facebook tertakluk pada dasar privasi pihak tersebut.'],
    ['Perkongsian maklumat', 'Kami tidak menjual maklumat anda. Maklumat hanya dikongsi apabila diperlukan untuk kerja bengkel atau oleh undang-undang.'],
    ['Hak anda', 'Anda boleh minta untuk melihat, membetulkan atau memadam maklumat anda dengan menghubungi kami.'],
    ['Perubahan pada notis ini', 'Notis ini mungkin dikemas kini. Tarikh di atas menunjukkan kemas kini terakhir.'],
  ],
});

const terms = legal({
  path: '/terms/',
  h1: 'Terma Penggunaan',
  intro: `Dengan menggunakan laman web ${site.name}, anda bersetuju dengan terma berikut.`,
  sections: [
    ['Maklumat am', 'Maklumat di laman ini adalah untuk rujukan umum tentang servis bengkel dan boleh berubah tanpa notis.'],
    ['Kos, tempoh dan slot', 'Laman ini tidak memaparkan harga atau tempoh kerja. Kos dan tempoh disahkan selepas pemeriksaan kenderaan. Slot bengkel tertakluk pada pengesahan bengkel.'],
    ['Nama dan tanda dagang', 'Nama agensi dan syarikat yang disenaraikan sebagai pelanggan adalah milik pemilik masing-masing.'],
    ['Pautan pihak ketiga', 'Laman ini memaut ke WhatsApp, Google Maps dan Facebook. Kami tidak bertanggungjawab atas kandungan laman pihak ketiga.'],
    ['Had tanggungjawab', 'Kami tidak bertanggungjawab atas kerugian akibat penggunaan maklumat di laman ini.'],
    ['Undang-undang', 'Terma ini tertakluk pada undang-undang Malaysia.'],
  ],
});

export const pages = [home, services, catPage('heavy'), catPage('light'), clients, contact, faq, privacy, terms];
