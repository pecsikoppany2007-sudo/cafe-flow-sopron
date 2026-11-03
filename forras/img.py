# Photos from cafeflow.hu -> WebP 800/1400/2000 (never upscaled). Light shared grading only.
from PIL import Image, ImageEnhance
import json
R = 'raw/cf-2024-02-'
J = {
  'pult':      (R + 'FMZ1138_full-min-scaled.jpg', None),
  'croissant': (R + 'FMZ1159_full-min-scaled.jpg', None),
  'latte':     ('raw/flow-up-latte.png', None),  # muapi 4x nagyítás (v2)
  'csiga':     (R + 'FMZ1150_full-min-scaled.jpg', None),
  'leopard':   (R + 'FMZ1148_full-min-scaled.jpg', None),
  'emelet':    (R + 'FMZ1134_full-min-scaled.jpg', None),
  'emelet2':   (R + 'FMZ1127_full-min-scaled.jpg', None),
  'kulonterem':(R + 'FUM3165__szin_full-min-min-scaled.jpeg', None),
  'falfestes': (R + 'FUM3139__szin_full-min-scaled.jpeg', None),
  'pult2':     (R + 'FUM3147__szin_full-min-min-scaled.jpeg', None),
  'vitrin':    (R + 'FMZ1142_full-min-scaled.jpg', None),
  'sarok':     (R + 'FMZ1128_full-min-scaled.jpg', None),
  'ajto':      (R + 'FMZ1153_full-min-scaled.jpg', None),
  'terasz':    (R + 'Nevtelen-terv-3-min.png', None),
  'csomagok':  (R + 'FMZ1115_full-min-1-scaled.jpg', None),
  'tukortojas':('raw/flow-up-tukortojas.png', None),  # muapi 4x
  'granola':   ('raw/flow-up-granola.png', None),  # muapi 4x
  'lepeny':    ('raw/flow-up-lepeny.png', None),  # muapi 4x
  'szendvics': (R + 'FMZ1079_full-min-scaled.jpeg', None),
  'suti':      (R + 'FMZ0974_full-min-scaled.jpg', None),
  'matcha':    (R + 'FMZ0989_full-min-scaled.jpg', None),
  'italok':    (R + 'FMZ1067_full-min-scaled.jpg', None),
  'cappuccino':(R + 'FMZ6697-min-scaled.jpeg', None),
}
meta = {}
import sys
ONLY = sys.argv[1:]
for name, (src, crop) in J.items():
    if ONLY and name not in ONLY: continue
    im = Image.open(src).convert('RGB')
    if crop: im = im.crop(crop)
    im = ImageEnhance.Contrast(im).enhance(1.03)
    w0, h0 = im.size
    sizes = [s for s in (800, 1400, 2000) if s < w0] + [min(w0, 2000)]
    sizes = sorted(set(sizes))
    for s in sizes:
        h = round(h0 * s / w0)
        im.resize((s, h), Image.LANCZOS).save(f'site/img/{name}-{s}.webp', quality=72, method=6)
    meta[name] = {'w': w0, 'h': h0, 'sizes': sizes}
old = json.load(open('forras/kepek.json')); old.update(meta)
json.dump(old, open('forras/kepek.json', 'w'), indent=1)
print(json.dumps({k: (v['w'], v['h'], v['sizes']) for k, v in meta.items()}))
