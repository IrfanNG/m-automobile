// Single source for business data. Every page reads from here.
// Optional fields: set to null and the block that uses them is not rendered.

// Images are self-hosted. pic() returns local paths and records the sources;
// `node fetch-assets.mjs` downloads any that are missing into public/assets/img/.
export const remoteImages = {};
// pic(id, widths, ratio) -> { src, srcset, w, h }; in a template string it prints the largest src.
// ratio = height / width for a crop (e.g. .75 for 4:3); omit to keep the photo's own shape (3:2 assumed for width/height attrs).
const pic = (id, widths, ratio, q = 68, aspect = 2 / 3) => {
  const files = widths.map((w) => {
    const h = ratio ? Math.round(w * ratio) : 0;
    const local = `/assets/img/${id}-${w}${h ? `x${h}` : ''}-q${q}.webp`;
    remoteImages[local] = `https://images.unsplash.com/${id}?fm=webp&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=${q}`;
    return { local, w };
  });
  const top = widths[widths.length - 1];
  return { src: files[files.length - 1].local, srcset: files.map((f) => `${f.local} ${f.w}w`).join(', '), w: top, h: Math.round(top * (ratio || aspect)), toString() { return this.src; } };
};
const thumb = (id) => pic(id, [220, 420], 0.75, 62);
// Photos processed locally by process-photos.py (not fetched): same shape as pic().
const localPic = (name, widths, ratio, q, aspect = 1) => {
  const files = widths.map((w) => ({ local: `/assets/img/${name}-${w}${ratio ? `x${Math.round(w * ratio)}` : ''}-q${q}.webp`, w }));
  const top = widths[widths.length - 1];
  return { src: files[files.length - 1].local, srcset: files.map((f) => `${f.local} ${f.w}w`).join(', '), w: top, h: Math.round(top * (ratio || aspect)), toString() { return this.src; } };
};

export const site = {
  // Live domain, e.g. 'https://mautomobile.my' (no trailing slash). Unknown for now.
  // When set: canonical, og:url, og:image, BreadcrumbList, sitemap.xml and the robots.txt sitemap line are generated.
  // Cloudflare address for now; change to the real domain when it exists.
  url: 'https://m-automobile-mockup.mnifanmohdariff.workers.dev',
  name: 'M Automobile Service Sdn. Bhd.',
  brand: 'M Automobile Service',
  short: 'M Automobile',
  reg: '202201015380 (1461077-M)',
  regYear: '2022',
  address: {
    street: 'Lot 1306, Kampung Kemuning',
    postcode: '18500',
    city: 'Machang',
    state: 'Kelantan',
  },
  phones: [
    { label: 'Telefon &amp; WhatsApp', display: '013-207 8119', tel: '+60132078119' },
    { label: 'Telefon', display: '017-946 8119', tel: '+60179468119' },
  ],
  wa: 'https://wa.me/60132078119',
  waDefault: 'Salam M Automobile. Saya nak bertanya tentang servis kenderaan.',
  // Google Business Profile share link (opens Google Maps on phones)
  maps: 'https://share.google/wVdMZot1FgRkjnZRT',
  mapEmbed: 'https://www.google.com/maps?q=M+Automobile+Service+Sdn+Bhd,+Kampung+Kemuning,+18500+Machang,+Kelantan&output=embed',
  facebook: 'https://www.facebook.com/p/M-Automobile-Service-Sdn-Bhd-61572429508459/',
  // Published on the Facebook page
  email: 'mautomobile2u@gmail.com',
  // Google Business Profile. Shown on the page only; never put in JSON-LD
  // (Google does not allow a business to mark up reviews of itself).
  google: {
    rating: '5.0',
    count: 4,
    quote: { text: 'Kemah bengkel ni buat lori ambo. Recommend mano nok baiki lori.', name: 'Muhammad Alif' },
  },

  // From the Google Business Profile. dow: 0 = Ahad ... 6 = Sabtu. open/close null = closed.
  hours: [
    { day: 'Isnin', en: 'Monday', dow: 1, open: '09:00', close: '18:00' },
    { day: 'Selasa', en: 'Tuesday', dow: 2, open: '09:00', close: '18:00' },
    { day: 'Rabu', en: 'Wednesday', dow: 3, open: '09:00', close: '18:00' },
    { day: 'Khamis', en: 'Thursday', dow: 4, open: '09:00', close: '18:00' },
    { day: 'Jumaat', en: 'Friday', dow: 5, open: null, close: null },
    { day: 'Sabtu', en: 'Saturday', dow: 6, open: '09:00', close: '18:00' },
    { day: 'Ahad', en: 'Sunday', dow: 0, open: '09:00', close: '18:00' },
  ],
  landmark: null,

  img: {
    // Malaysian photos (Pexels, Ipoh, Perak); see process-photos.py for sources and processing.
    hero: localPic('pexels-37154110', [640, 960, 1280, 1600, 1920], 0, 74, 1),
    heavy: localPic('pexels-37186960', [480, 800, 1200], 0.75, 60),
    light: localPic('pexels-29874357', [480, 800, 1200], 0.75, 60),
  },
  // Tiny blurred previews (about 240 bytes) painted behind each hero photo until it arrives.
  lqip: {
    hero: 'data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAADwBACdASoUABQAPu1ur1KppiQiqAgBMB2JaQAALq8Y9qXxex/7LicjMxc1FiyeuAAA/udmR1rz4d547ee8tAzyhbZqojmLEWoW7Xdm91JpogKVOJ/XLSjhMg+Gg6t+2U/xatGO4042ubu2MccIs3ghRw7aTYNvRUdK6aIu5D/+2G1dWc1W1T7gKd8SgYnpaOhC7XH72wAAAA==',
    heavy: 'data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAABQAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JaQAAL0+j0rYLwAD+2tYxmK2hjrYdTGD1ypvpJrrszfUFwLLoTII5rxXtc/xDyWTJRGsmM8a3kuGZ33qToezEmhGh3NUfLrpmoJeHeqLjGgqWAD/pSaGnZA8BsJJEtMCbVYMAAAA=',
    light: 'data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAAAwBACdASoUAA8APu1iqU2ppaOiMAgBMB2JaQAAXpKE1/FwJzCSpNbxVAAA/r2SGMbLtIVvATAXrq9+flLGPZLl1u0GEgrlRWmUGutQ5JuKeE13LVYVHY8OANaFOicwPE46wY5cmtgE5DPCzPoQCxHwXQx5IAWbtp42Wv972XMyegAA',
  },
  alt: {
    hero: 'Lori prime mover di pelabuhan kontena di Ipoh, dengan pantulan dalam lopak air',
    heavy: 'Lori kontena berplat KA di halaman kontena di Ipoh',
    light: 'Kereta MPV di atas lif dalam bengkel kereta di Ipoh',
  },

  categories: {
    heavy: {
      slug: 'heavy-vehicles',
      name: 'Kenderaan Berat',
      short: 'Lori dan Treler',
      title: 'Servis Lori, Treler &amp; Kenderaan Berat di Machang',
      tonnage: 'Atas 3 tan',
      types: ['Lori', 'Treler', 'Kenderaan komersial'],
      work: [
        'Servis dan pembaikan lori',
        'Penyelenggaraan treler dan kenderaan komersial',
        'Scan komputer dan diagnosis enjin',
        'Overhaul enjin, sistem penyejukan dan elektrikal',
        'Brek, absorber, alignment dan balancing tayar',
      ],
      send: [
        'Jenis kenderaan, model dan tahun',
        'Saiz kenderaan, cth. 5 tan atau 10 tayar',
        'Masalah atau servis yang diperlukan',
        'Gambar, video atau rakaman bunyi kerosakan, jika ada',
      ],
      wa: 'Salam M Automobile. Saya nak tanya tentang servis kenderaan berat. Model kenderaan saya _____. Saiz _____. Masalah atau servis yang diperlukan _____.',
      h1: 'Servis dan Pembaikan Kenderaan Berat di Machang, Kelantan',
      sub: 'Lori, treler dan kenderaan komersial atas 3 tan. Hantar jenis, model dan saiz kenderaan di WhatsApp untuk semak sama ada kami boleh bantu dan bila ada slot.',
    },
    light: {
      slug: 'light-vehicles',
      name: 'Kenderaan Ringan',
      short: 'Kereta, Van dan Pikap',
      title: 'Servis Kereta, Van &amp; Pikap di Machang, Kelantan',
      tonnage: 'Bawah 3 tan',
      types: ['Kereta', 'Van', 'Pikap'],
      work: [
        'Servis berkala kereta, van dan pikap',
        'Baiki besar',
        'Scan komputer dan diagnosis enjin',
        'Overhaul enjin, sistem penyejukan dan elektrikal',
        'Brek, absorber, alignment dan balancing tayar',
      ],
      send: [
        'Model dan tahun kenderaan',
        'Masalah atau servis yang diperlukan',
        'Hari anda bercadang datang',
        'Gambar, video atau rakaman bunyi kerosakan, jika ada',
      ],
      wa: 'Salam M Automobile. Saya nak tanya tentang servis kenderaan ringan. Model kenderaan saya _____. Masalah atau servis yang diperlukan _____.',
      h1: 'Servis dan Pembaikan Kenderaan Ringan di Machang, Kelantan',
      sub: 'Kereta, van dan pikap bawah 3 tan. Hantar model kenderaan dan kerja yang diperlukan di WhatsApp untuk semak sama ada kami boleh bantu dan bila ada slot.',
    },
  },

  jobs: [
    { t: 'Servis berkala', d: 'Lori, treler, kereta, van dan pikap', alts: ['Mekanik menuang minyak enjin ke dalam kereta', 'Mekanik menuang minyak ke dalam enjin kereta', 'Mekanik berbaju kelabu memeriksa enjin kereta', 'Mekanik membaiki komponen enjin kereta'], imgs: [thumb('photo-1642075223291-f9ec545889fa'), thumb('photo-1771340742493-52fbd5476ccb'), thumb('photo-1625047509248-ec889cbff17f'), thumb('photo-1747511578112-3d21e8b3d5d7')] },
    { t: 'Scan &amp; diagnosis enjin', d: 'Scan komputer sebelum pembaikan', alts: ['Telefon memaparkan aplikasi diagnostik kereta di papan pemuka', 'Telefon di atas kotak alatan', 'Komputer riba dan peralatan di bengkel', 'Lelaki di dalam kereta menggunakan komputer riba'], imgs: [thumb('photo-1758411898566-5d58679c6c03'), thumb('photo-1681083465785-2c31e4bc27dd'), thumb('photo-1658351354155-e854d19233e0'), thumb('photo-1727893380169-4dda123e19f7')] },
    { t: 'Overhaul enjin', d: 'Kenderaan berat dan ringan', alts: ['Blok enjin di atas meja', 'Kepala silinder yang digilap', 'Timbunan enjin dan alat ganti lama', 'Komponen enjin hitam dan perak'], imgs: [thumb('photo-1720244253125-f39d7aeccccf'), thumb('photo-1784332307265-2f3bd31d0dd9'), thumb('photo-1767340078222-98633f3ffd27'), thumb('photo-1595787142842-7404bc60470d')] },
    { t: 'Brek &amp; absorber', d: 'Pemeriksaan dan penggantian', alts: ['Brek kenderaan dari dekat', 'Cakera dan kaliper brek kereta', 'Sistem brek kereta dari dekat', 'Cakera brek'], imgs: [thumb('photo-1696494561430-de087dd0bd69'), thumb('photo-1760317890314-e964ffd7e6a6'), thumb('photo-1760317890322-364a810cd4da'), thumb('photo-1588017530244-c57df911f73b')] },
    { t: 'Alignment &amp; balancing', d: 'Tayar kenderaan berat dan ringan', alts: ['Rim dan tayar kenderaan', 'Tayar kereta dari dekat', 'Tayar pada kereta', 'Roda kenderaan dari dekat'], imgs: [thumb('photo-1444947295498-07f60c19a4ff'), thumb('photo-1656232976683-7b688560e427'), thumb('photo-1637087867437-5a1898610adf'), thumb('photo-1682189165011-d4305d2b0ced')] },
    { t: 'Sistem penyejukan', d: 'Radiator, hos dan kipas', alts: ['Enjin kereta dengan hos dan komponen mekanikal', 'Enjin kereta dengan pelbagai komponen', 'Enjin kereta', 'Ruang enjin kereta'], imgs: [thumb('photo-1779263569870-e7a0fbc25686'), thumb('photo-1781454278699-684ec678944d'), thumb('photo-1666148647370-8730124d1376'), thumb('photo-1695159861109-4dd63fa83d0a')] },
    { t: 'Elektrikal', d: 'Pendawaian, bateri dan lampu', alts: ['Bateri kereta dengan wayar bersambung', 'Bateri dengan playar', 'Bateri di atas meja', 'Bateri dan pengecas di atas bangku kerja'], imgs: [thumb('photo-1765211003026-f7666ea3a948'), thumb('photo-1676337167752-2062c6ca7366'), thumb('photo-1676337167629-d896b3ed5724'), thumb('photo-1676337167498-ceac1d6dafba')] },
  ],

  clients: {
    gov: [
      { name: 'PDRM', sub: 'Kontinjen Kelantan' },
      { name: 'TUDM', sub: 'Pangkalan Udara Gong Kedak' },
      { name: 'AADK', sub: 'Agensi Antidadah Kebangsaan' },
      { name: 'APM', sub: 'Angkatan Pertahanan Awam' },
      { name: 'Majlis Daerah Machang' },
      { name: 'Jabatan Penjara', sub: 'Pusat Pemulihan Akhlak Machang' },
    ],
    biz: [
      { name: 'City-Link Express', mono: true },
      { name: 'J&amp;T Express' },
      { name: 'XEND', mono: true },
      { name: 'Roti Sedap' },
      { name: 'Zafir Ais', mono: true },
      { name: 'Cendana Auto' },
    ],
  },

  // a: answer HTML. Links use site paths.
  faq: [
    { id: 'kos', q: 'Berapa kos servis atau pembaikan?', a: 'Kos bergantung pada jenis kenderaan dan kerja yang diperlukan. Hantar model kenderaan dan masalahnya di WhatsApp untuk tanya anggaran. Jika pemeriksaan diperlukan, tanya caj pemeriksaan sebelum datang.' },
    { id: 'sebut-harga', q: 'Boleh dapat sebut harga sebelum kerja dimulakan?', a: 'Boleh. Selepas kenderaan diperiksa, kami sediakan sebut harga bertulis untuk kerja dan spare parts yang diperlukan. Anda tahu kosnya sebelum kerja dimulakan.' },
    { id: 'invois', q: 'Adakah invois dan resit rasmi diberikan?', a: 'Ya. Setiap kerja disertakan invois bercetak atas nama syarikat, dan resit apabila bayaran dibuat.' },
    { id: 'slot', q: 'Bagaimana cara semak slot bengkel?', a: 'WhatsApp kami dengan jenis dan model kenderaan, kerja yang diperlukan dan hari anda bercadang datang. Untuk kenderaan berat, sertakan saiz kenderaan. <a class="link" href="/#slot">Borang Semak Slot Bengkel</a>' },
    { id: 'tempoh', q: 'Berapa lama servis atau pembaikan mengambil masa?', a: 'Bergantung pada kerja dan ketersediaan spare parts. Jika anda perlukan kenderaan semula pada waktu tertentu, beritahu kami semasa semak slot.' },
    { id: 'gambar', q: 'Boleh hantar gambar atau video kerosakan dahulu?', a: 'Boleh. Hantar gambar, video atau rakaman bunyi di WhatsApp supaya kami nampak masalahnya sebelum anda datang.' },
    { id: 'lokasi', q: 'Di mana lokasi M Automobile?', a: 'Lot 1306, Kampung Kemuning, 18500 Machang, Kelantan. <a class="link" href="/contact/">Lokasi dan peta bengkel</a>' },
    { id: 'kenderaan', q: 'Kenderaan apa yang dibaiki di bengkel ini?', a: '<b>Kenderaan berat (atas 3 tan):</b> lori, treler dan kenderaan komersial. <b>Kenderaan ringan (bawah 3 tan):</b> kereta, van dan pikap.' },
    { id: 'scan', q: 'Ada scan komputer dan diagnosis enjin?', a: 'Ada, untuk kenderaan berat dan ringan. Scan komputer dibuat untuk cari punca masalah enjin sebelum pembaikan.' },
    { id: 'enjin', q: 'Boleh baiki enjin, sistem penyejukan dan elektrikal?', a: 'Boleh. Kami buat overhaul enjin, pembaikan sistem penyejukan dan kerja elektrikal untuk kenderaan berat dan ringan.' },
    { id: 'agensi', q: 'Adakah bengkel menerima kerja jabatan dan agensi kerajaan?', a: 'Ya, termasuk melalui Pesanan Tempatan (LO). Kami sediakan sebut harga, invois dan delivery order untuk rekod jabatan. <a class="link" href="/clients/">Kerja jabatan dan syarikat</a>' },
    // Heavy vehicles page
    { id: 'berat-jenis', q: 'Kenderaan berat jenis apa yang diterima?', a: 'Lori, treler dan kenderaan komersial atas 3 tan. Hantar jenis, model dan saiz kenderaan (cth. 5 tan atau 10 tayar) di WhatsApp untuk semak sama ada kami boleh bantu.' },
    { id: 'berat-scan', q: 'Boleh scan dan diagnosis enjin lori?', a: 'Boleh. Scan komputer dan diagnosis enjin dibuat untuk lori, treler dan kenderaan komersial sebelum pembaikan dimulakan.' },
    { id: 'berat-jabatan', q: 'Lori jabatan atau syarikat boleh dihantar ke bengkel ini?', a: 'Boleh. Kami terima kerja jabatan kerajaan melalui Pesanan Tempatan (LO), dan syarikat boleh buka akaun untuk kenderaan armada. <a class="link" href="/clients/">Kerja jabatan dan syarikat</a>' },
    // Light vehicles page
    { id: 'ringan-jenis', q: 'Kenderaan ringan jenis apa yang diterima?', a: 'Kereta, van dan pikap bawah 3 tan. Hantar model dan tahun kenderaan serta masalahnya di WhatsApp untuk semak sama ada kami boleh bantu.' },
    { id: 'ringan-baiki-besar', q: 'Ada buat baiki besar untuk kereta, van dan pikap?', a: 'Ada. Selain servis berkala, kami buat baiki besar termasuk overhaul enjin, sistem penyejukan dan kerja elektrikal.' },
    // Clients page
    { id: 'dokumen-jabatan', q: 'Dokumen apa yang disediakan untuk jabatan kerajaan?', a: 'Sebut harga sebelum kerja dimulakan, kemudian invois, delivery order dan resit untuk rekod jabatan.' },
    { id: 'persendirian', q: 'Adakah bengkel ini menerima pemilik persendirian?', a: 'Ya. Selain jabatan kerajaan dan syarikat, kami terima kenderaan pemilik persendirian.' },
    // Contact page
    { id: 'telefon', q: 'Berapa nombor telefon bengkel?', a: '013-207 8119 untuk telefon dan WhatsApp, atau 017-946 8119 untuk telefon.' },
    { id: 'waktu', q: 'Bila waktu operasi bengkel?', a: 'Sabtu hingga Khamis, 9.00 pagi hingga 6.00 petang. Jumaat tutup.' },
    { id: 'arah', q: 'Bagaimana nak dapatkan arah ke bengkel?', a: 'Tekan butang Buka Google Maps di halaman Lokasi untuk arah ke Lot 1306, Kampung Kemuning, 18500 Machang, Kelantan. Anda juga boleh salin alamat atau telefon kami.' },
    { id: 'armada', q: 'Boleh uruskan kenderaan syarikat atau armada?', a: 'Boleh. Syarikat boleh buka akaun dengan kami. Setiap kenderaan direkodkan ikut nombor plat, dengan sejarah servis dan invois di bawah satu akaun.' },
  ],
};

export const addrLine = (a = site.address) => `${a.street}, ${a.postcode} ${a.city}, ${a.state}`;

// '18:00' -> '6.00 petang'
export const fmtTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  const part = h < 12 ? 'pagi' : h < 14 ? 'tengah hari' : h < 19 ? 'petang' : 'malam';
  return `${h % 12 || 12}.${String(m).padStart(2, '0')} ${part}`;
};
export const fmtHours = (h) => (h.open ? `${fmtTime(h.open)} – ${fmtTime(h.close)}` : 'Tutup');
