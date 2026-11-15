# M Automobile Service Sdn. Bhd. — laman web

Laman web statik (Bahasa Melayu) untuk **M Automobile Service Sdn. Bhd.** (SSM 202201015380 / 1461077-M),
bengkel kenderaan berat dan ringan di Lot 1306, Kampung Kemuning, 18500 Machang, Kelantan.

- **Live:** https://m-automobile-mockup.mnifanmohdariff.workers.dev
- **Hosting:** Cloudflare Workers (static assets), worker `m-automobile-mockup`
- **Tiada framework, tiada dependency npm.** HTML dijana oleh skrip Node dari data dalam `src/`.

---

## Mula cepat

Keperluan: **Node.js 20+**. Untuk proses gambar sahaja: **Python 3 + Pillow** (`pip install pillow`).

```bash
node build.mjs                                   # jana semua halaman ke public/
cd public && python3 -m http.server 4173         # preview di http://127.0.0.1:4173
npx wrangler login                               # sekali sahaja, akaun Cloudflare pemilik
npx wrangler deploy                              # deploy folder public/
```

> `public/` **ialah output build dan juga yang di-deploy**, dan ia di-commit ke git.
> Jangan edit HTML dalam `public/` secara terus; edit `src/` kemudian `node build.mjs`.
> (Pengecualian: `public/app.js`, `public/_headers`, fail gambar/fon/vendor ditulis terus.)

---

## Struktur

```
src/
  site.mjs        Semua data bisnes: nama, alamat, telefon, WhatsApp, waktu operasi, MOF,
                  klien, servis, FAQ, teks "Tentang Kami", senarai gambar Unsplash/Pexels.
  pages.mjs       Kandungan setiap halaman (+ senarai `pages` di hujung fail).
  layout.mjs      Kerangka halaman: <head>, navbar (NAV), footer, dock telefon, JSON-LD.
  gallery.mjs     Album galeri (nama agensi) dan kapsyen setiap gambar.
  gallery.json    Dijana oleh process-gallery.py (saiz fail, warna placeholder). Jangan edit.
  styles.css      Semua CSS. Di-minify dan di-inline ke setiap halaman semasa build.
build.mjs         Jana public/**/index.html, sitemap.xml, robots.txt, llms.txt.
fetch-assets.mjs  Muat turun gambar Unsplash, GSAP/Lenis dan fon ke public/ (skip yang dah ada).
process-gallery.py  Tukar originals/galeri/*.jpg ke WebP untuk halaman Galeri.
make-og.mjs       Jana public/og.jpg (gambar share 1200x630) guna Chrome headless.
public/
  app.js          Semua JavaScript: menu, WhatsApp, slot builder, FAQ, galeri, lightbox, animasi.
  _headers        Header Cloudflare (keselamatan, cache, PDF sebagai muat turun).
  assets/         Logo, fon, gambar (img/), logo klien (clients/), galeri (galeri/).
  files/          Profil syarikat PDF (versi yang dah dihitamkan).
  vendor/         GSAP, ScrollTrigger, SplitText, Lenis (self-hosted).
wrangler.jsonc    Konfigurasi Cloudflare Worker.
```

### Halaman

| URL | Kandungan |
|---|---|
| `/` | Laman utama: hero, kategori, senarai kerja, pembina mesej "Semak Slot Bengkel", klien, FAQ |
| `/services/`, `/services/heavy-vehicles/`, `/services/light-vehicles/` | Servis |
| `/about/` | Tentang Kami: maklumat syarikat, visi, polisi kualiti, nilai, muat turun profil PDF |
| `/galeri/` | 45 gambar sebenar, tapis ikut agensi, lightbox. `?a=tudm` buka terus album TUDM |
| `/clients/` | Pelanggan (swasta sahaja) dan MOF |
| `/contact/` | Lokasi, waktu operasi, telefon, peta |
| `/faq/` | Soalan lazim dengan carian |
| `/privacy/`, `/terms/` | Dasar privasi, terma |

Tiada borang dan tiada backend. Semua pertanyaan pergi ke WhatsApp dengan mesej yang diisi awal.

---

## Tugasan biasa

### Tukar telefon / WhatsApp
1. `src/site.mjs`: `phones` dan `wa`.
2. `public/app.js` baris atas: `const WA = 'https://wa.me/...'` (**ditulis terus, mesti sama** dengan `site.wa`).
3. Cari nombor lama dalam `src/` (contoh dalam `description` laman utama dan FAQ `telefon`).
4. `node build.mjs`, `node make-og.mjs` (nombor juga ada dalam gambar share), deploy.

### Tukar alamat, waktu operasi, FAQ, klien, servis, teks Tentang Kami
Semua dalam `src/site.mjs`. Kemudian `node build.mjs` dan deploy.

### Tambah gambar galeri
1. Letak JPG asal dalam `originals/galeri/` dengan nama `<album>-<nombor>.jpg`,
   contoh `tudm-17.jpg`, `bengkel-16.jpg`, `swasta-namasyarikat-1.jpg`.
   Album = perkataan sebelum `-` pertama, mesti salah satu `key` dalam `albums` di `src/gallery.mjs`.
2. Tambah kapsyen dalam `captions` di `src/gallery.mjs` (kapsyen juga alt text; build gagal jika tiada).
3. `python3 process-gallery.py` → `node build.mjs` → deploy.

Agensi baru: tambah entri dalam `albums` (`key`, `label`, `full`).

### Tukar logo, gambar atau fail lain dalam `/assets/` atau `/vendor/`
**Penting:** `_headers` set `/assets/*` dan `/vendor/*` sebagai `immutable` selama setahun.
Jika kandungan fail berubah, **guna nama fail baru** (contoh `logo-round.png` → `logo-v3.png`)
dan kemas kini rujukan; jika tidak, pelawat lama akan terus nampak fail lama.

### Gambar share (og.jpg)
`node make-og.mjs` selepas tukar nombor, waktu operasi atau hero. Perlukan Google Chrome
(laluan dalam `CHROME` di atas fail, atau set env `CHROME`). WhatsApp/Facebook cache preview beberapa hari.

### Gambar stok
Gambar Unsplash disenaraikan melalui `pic()`/`thumb()` dalam `src/site.mjs`; jalankan
`node fetch-assets.mjs` untuk muat turun yang baru. Gambar Pexels (hero, kategori) diproses oleh
`process-photos.py` dari `originals/` (kedua-duanya tidak dalam git).

---

## Domain sendiri

1. Beli domain (contoh `.com.my`) dan tambah ke Cloudflare.
2. Cloudflare → Workers & Pages → worker → **Settings → Domains & Routes → Add custom domain**.
3. `src/site.mjs`: tukar `url` ke domain baru (digunakan untuk canonical, sitemap, og:image, JSON-LD, llms.txt).
4. `node build.mjs`, `node make-og.mjs`, deploy.

Untuk tukar nama worker (URL `workers.dev` akan berubah), edit `name` dalam `wrangler.jsonc`.

## Pindah ke akaun Cloudflare lain

```bash
npx wrangler logout && npx wrangler login     # log masuk akaun baru
npx wrangler deploy
```
Kemudian set domain (di atas) dan padam worker lama di akaun asal.

---

## Data sensitif

- `public/files/profil-syarikat-m-automobile.pdf` ialah profil syarikat 54 muka surat yang **telah
  dihitamkan**: nombor IC, telefon/emel/alamat setiausaha syarikat dan tarikh lahir pengarah.
- PDF asal (`PROFILE SYARIKAT*.pdf`) **tidak** dalam git (`.gitignore`). Jangan commit atau upload.
  Jika profil dikemas kini, hitamkan semula sebelum ganti fail dalam `public/files/`.
- `originals/` (gambar asal, logo asal) juga tidak dalam git; minta daripada pemilik projek.

## Untuk disahkan oleh client

- "Pengalaman lebih 9 tahun" dalam `site.about.intro`.
- Kapsyen 45 gambar galeri dan nama penuh MDM (diandaikan Majlis Daerah Machang) dalam `src/gallery.mjs`.
- MOF sah hingga **30/07/2028** (`site.mof`). Kemas kini selepas pembaharuan.

## Nota teknikal

- Animasi (GSAP, ScrollTrigger, SplitText, Lenis) dimuat selepas interaksi pertama; halaman berfungsi
  tanpa JavaScript dan menghormati `prefers-reduced-motion`.
- CSS di-inline; fon self-hosted; tiada request ke pihak ketiga kecuali Google Maps di `/contact/`.
- `/files/*` dihantar dengan `Content-Disposition: attachment` supaya PDF dimuat turun.
