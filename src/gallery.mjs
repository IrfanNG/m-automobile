// Galeri: the client's own workshop photos. Files and sizes come from src/gallery.json,
// written by process-gallery.py. Album = the file name up to the first dash.
import { readFileSync } from 'node:fs';

const raw = JSON.parse(readFileSync(new URL('./gallery.json', import.meta.url), 'utf8'));

// Filter order on the page. `full` is shown in the lightbox and as the chip's title.
export const albums = [
  { key: 'bengkel', label: 'Bengkel', full: 'Premis bengkel di Kampung Kemuning, Machang' },
  { key: 'tudm', label: 'TUDM', full: 'Tentera Udara Diraja Malaysia' },
  { key: 'atm', label: 'ATM', full: 'Angkatan Tentera Malaysia' },
  { key: 'apm', label: 'APM', full: 'Angkatan Pertahanan Awam Malaysia' },
  { key: 'mdm', label: 'MDM', full: 'Majlis Daerah Machang' },
  { key: 'penjara', label: 'Penjara', full: 'Jabatan Penjara Malaysia' },
  { key: 'pdrm', label: 'PDRM', full: 'Polis Diraja Malaysia' },
  { key: 'aadk', label: 'AADK', full: 'Agensi Antidadah Kebangsaan' },
  { key: 'swasta', label: 'Swasta', full: 'Syarikat swasta' },
];

// Caption per photo: also the image alt text.
const captions = {
  'aadk-01': 'SUV AADK, roda depan dibuka untuk kerja suspensi',
  'apm-01': 'Servis penghawa dingin, tolok tekanan disambung',
  'apm-02': 'Lori APM dicat semula, badan ditutup kertas',
  'apm-04': 'Trak penyelamat Pertahanan Awam',
  'apm-05': 'Lori kargo APM, kerja pada casis',
  'apm-06': 'Van Pertahanan Awam di halaman bengkel',
  'atm-02': 'Lori tentera, komponen enjin dibuka dan disusun',
  'atm-03': 'Lori tentera celoreng di halaman bengkel',
  'atm-04': 'Trak penunda tentera, kerja pada kren',
  'atm-05': 'Pikap tentera selepas servis',
  'bengkel-01': 'Halaman depan bengkel',
  'bengkel-02': 'Kenderaan menunggu giliran di bawah bumbung',
  'bengkel-03': 'Bas ekspres di bengkel',
  'bengkel-04': 'Ruang kerja di bawah bumbung bengkel',
  'bengkel-05': 'Halaman bengkel dengan lori dan pikap',
  'bengkel-06': 'Kereta, SUV dan lori di halaman bengkel',
  'bengkel-07': 'Pintu masuk bengkel',
  'bengkel-08': 'Bas ekspres, kerja di bahagian bawah',
  'bengkel-09': 'Mekanik membaiki enjin bas',
  'bengkel-10': 'Kawasan kerja dan stor alat ganti',
  'bengkel-11': 'Kawasan kerja bengkel',
  'bengkel-12': 'Lori di hadapan stor bengkel',
  'bengkel-13': 'Lori sampah, kabin diangkat untuk kerja enjin',
  'bengkel-14': 'Kabin lori sampah diangkat',
  'bengkel-15': 'Bas dan lori sampah di ruang kerja',
  'mdm-01': 'Mencuci enjin lori sampah sebelum dibaiki',
  'mdm-02': 'Lori sampah, kabin diangkat untuk kerja enjin',
  'mdm-06': 'Jentera backhoe di bengkel',
  'mdm-07': 'Membaiki sistem hidraulik backhoe',
  'mdm-08': 'Membaiki enjin backhoe',
  'pdrm-02': 'Kerja hab dan brek roda',
  'penjara-03': 'Van Penjara, servis enjin',
  'penjara-04': 'Bas Penjara, mekanik di bawah casis',
  'swasta-citylink-2': 'Lori City-Link Express',
  'swasta-rotisedap-1': 'Lori Roti Sedap',
  'swasta-xend-1': 'Lori XEND',
  'tudm-01': 'Lori Iveco TUDM',
  'tudm-02': 'Lori TUDM, kabin diangkat untuk kerja enjin',
  'tudm-03': 'Pam bahan api diesel diuji di mesin ujian',
  'tudm-05': 'Mekanik di bawah bas TUDM',
  'tudm-10': 'Lori TUDM di bengkel',
  'tudm-11': 'Kenderaan TUDM di garaj',
  'tudm-12': 'Lori Volvo TUDM di garaj',
  'tudm-13': 'Bas TUDM selepas servis',
  'tudm-16': 'Peralatan sokongan darat TUDM',
};

const byAlbum = Object.fromEntries(albums.map((a) => [a.key, []]));
for (const p of raw) {
  const album = p.name.split('-')[0];
  if (!byAlbum[album]) throw new Error(`Unknown album for ${p.name}`);
  if (!captions[p.name]) throw new Error(`No caption for ${p.name}`);
  byAlbum[album].push({
    ...p,
    album,
    caption: captions[p.name],
    src: p.files[0][0],
    srcset: p.files.map(([f, w]) => `${f} ${w}w`).join(', '),
    big: p.files[p.files.length - 1][0],
  });
}

// "Semua" order: take one photo from each album in turn, so agencies are mixed through the grid.
export const photos = [];
for (let i = 0; photos.length < raw.length; i++) {
  for (const a of albums) if (byAlbum[a.key][i]) photos.push(byAlbum[a.key][i]);
}
export const count = (key) => byAlbum[key].length;
