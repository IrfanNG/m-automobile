#!/usr/bin/env python3
"""Turn original photos into the responsive WebP files the site uses.

For photos that are not on Unsplash (e.g. Pexels), download the original once into
originals/ (not deployed) and list it below. Then run:  python3 process-photos.py
Needs Pillow (pip install pillow). Prints the blurred-preview data URI for each photo.

Photos (all free to use, Pexels licence; taken in Ipoh, Perak, Malaysia):
  pexels-37154110  prime mover at a container port, reflection  https://www.pexels.com/photo/black-and-white-truck-reflection-in-ipoh-37154110/
  pexels-37186960  container lorry, KA plate, in a yard          https://www.pexels.com/photo/black-and-white-truck-at-shipping-yard-in-malaysia-37186960/
  pexels-29874357  car on a lift in a workshop                    https://www.pexels.com/photo/monochrome-vehicle-maintenance-workshop-in-ipoh-29874357/
"""
import base64, io, os
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'public/assets/img')

# name, source file, widths, crop ratio (h/w) or None to keep shape, crop anchor y (0 top .. 1 bottom), quality, sharpen (0 = none)
PHOTOS = [
    ('pexels-37154110', 'originals/pexels-37154110.jpg', [640, 960, 1280, 1600, 1920], None, .5, 74, 1),
    ('pexels-37186960', 'originals/pexels-37186960.jpg', [480, 800, 1200], .75, 1.0, 60, 0),
    ('pexels-29874357', 'originals/pexels-29874357.jpg', [480, 800, 1200], .75, .5, 60, 0),
]

for name, src, widths, ratio, anchor, q, sharpen in PHOTOS:
    im = Image.open(os.path.join(ROOT, src)).convert('RGB')
    if ratio:  # crop to the ratio, keeping the anchor
        W, H = im.size
        ch = round(W * ratio)
        if ch <= H:
            top = round((H - ch) * anchor)
            im = im.crop((0, top, W, top + ch))
    for w in widths:
        h = round(w * im.height / im.width)
        out = im.resize((w, h), Image.LANCZOS)
        if sharpen:  # downscaling softens detail; a light unsharp mask brings it back
            out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=int(70 * sharpen), threshold=2))
        fn = f'{name}-{w}{f"x{h}" if ratio else ""}-q{q}.webp'
        out.save(os.path.join(OUT, fn), 'WEBP', quality=q, method=6)
        print(f'{fn:44} {os.path.getsize(os.path.join(OUT, fn)):>8}')
    tiny = im.resize((20, round(20 * im.height / im.width)), Image.LANCZOS)
    b = io.BytesIO(); tiny.save(b, 'WEBP', quality=40)
    print(f'  lqip {name}: data:image/webp;base64,{base64.b64encode(b.getvalue()).decode()}')
