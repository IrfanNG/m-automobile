#!/usr/bin/env python3
"""Turn the client's workshop photos into the WebP files the Galeri page uses.

Originals live in originals/galeri/ (not deployed, not committed), named <album>-<n>.jpg,
e.g. tudm-03.jpg or swasta-xend-1.jpg. The album is the part before the first dash.
Run:  python3 process-gallery.py   (needs Pillow), then  node build.mjs

Writes public/assets/galeri/<name>-<width>.webp and src/gallery.json (sizes and a
placeholder colour per photo). Captions and album names are in src/gallery.mjs.
"""
import json, os
from PIL import Image, ImageOps, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'originals/galeri')
OUT = os.path.join(ROOT, 'public/assets/galeri')
WIDTHS = [480, 960, 1600]  # grid tiles use 480/960; the lightbox uses the largest
Q = 70

os.makedirs(OUT, exist_ok=True)
photos = []
for fn in sorted(os.listdir(SRC)):
    if not fn.lower().endswith(('.jpg', '.jpeg')):
        continue
    name = os.path.splitext(fn)[0]
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, fn))).convert('RGB')
    widths = [w for w in WIDTHS if w < im.width] + [min(im.width, WIDTHS[-1])]
    files = []
    for w in widths:
        h = round(w * im.height / im.width)
        out = im.resize((w, h), Image.LANCZOS)
        if w < im.width:
            out = out.filter(ImageFilter.UnsharpMask(radius=1, percent=60, threshold=2))
        f = f'{name}-{w}.webp'
        out.save(os.path.join(OUT, f), 'WEBP', quality=Q, method=6)
        files.append([f'/assets/galeri/{f}', w])
    r, g, b = im.resize((1, 1), Image.LANCZOS).getpixel((0, 0))
    top = files[-1][1]
    photos.append({'name': name, 'w': top, 'h': round(top * im.height / im.width), 'color': f'#{r:02x}{g:02x}{b:02x}', 'files': files})
    print(f'{name:24} {im.width}x{im.height} -> {", ".join(str(w) for _, w in files)}')

with open(os.path.join(ROOT, 'src/gallery.json'), 'w') as fh:
    json.dump(photos, fh, indent=1)
print(len(photos), 'photos')
