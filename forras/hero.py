# Hero: three layers from FMZ1155 (night facade). off = lights off, sign = neon only (alpha), on = full photo.
import sys
from PIL import Image, ImageFilter, ImageChops, ImageEnhance
import numpy as np
src = Image.open('raw/cf-2024-02-FMZ1155_full-min-scaled.jpg').convert('RGB')
W, H = src.size
a = np.asarray(src).astype(np.float32) / 255
lum = a @ np.array([.2126, .7152, .0722], dtype=np.float32)

def box_mask(x0, y0, x1, y1, blur):
    m = Image.new('L', (W, H), 0)
    m.paste(255, (int(x0*W), int(y0*H), int(x1*W), int(y1*H)))
    return np.asarray(m.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32) / 255

# the whole sign panel with its blue halo; switched off, only the cold tubes stay faintly visible
glow = box_mask(.415, 0, .815, .262, 14)
tube = np.clip((lum - .25) / .5, 0, 1)

# lit doors / windows
door_box = box_mask(.305, .255, .865, .82, 18)
door = door_box

night = a * np.array([.10, .12, .18], dtype=np.float32) + np.array([.012, .016, .03], dtype=np.float32)
dark_sign = a * .05 + (tube * .12)[..., None] * np.array([.75, .78, .85], dtype=np.float32)
off = a * (1 - glow[..., None]) + dark_sign * glow[..., None]
off = off * (1 - door[..., None]) + night * door[..., None]
# the light that falls on the pavement and the furniture also drops
spill = box_mask(.0, .55, 1, 1, 60) * .45 + box_mask(.25, .2, .9, .9, 80) * .25
off = off * (1 - spill[..., None] * .55)
off_img = Image.fromarray((np.clip(off, 0, 1) * 255).astype(np.uint8))

sign_rgba = np.dstack([a, glow]).clip(0, 1)
sign_img = Image.fromarray((sign_rgba * 255).astype(np.uint8), 'RGBA')

# v7: a kép fölé sötét falat toldunk (a felső sor színéből, lefelé varrat nélkül), hogy a fotó
# a menüsor alá is benyúljon, és a cégtábla C betűje ne a kép szélén üljön (nincs sáv, nincs vágás)
E = round(.14 * H)
DARK = np.array([1, 1.2, 2.2], dtype=np.float32) / 255
def gx(row, sig):
    k = np.exp(-.5 * (np.arange(-3 * sig, 3 * sig + 1) / sig) ** 2); k /= k.sum()
    pad = np.pad(row, ((3 * sig, 3 * sig), (0, 0)), mode='edge')
    return np.stack([np.convolve(pad[:, c], k, mode='valid') for c in range(row.shape[1])], 1)
def ss(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)
def extend(X, dark=True):
    r0 = X[0]; B = gx(X[:6].mean(0), 40)
    rows = []
    for d in range(E, 0, -1):
        r = r0 * (1 - ss(0, 28, d)) + B * ss(0, 28, d)
        if dark: f = ss(0, E * 1.1, d); r = r * (1 - f) + (B * .45 + DARK[:r.shape[1]] * .55) * f
        rows.append(r)
    ext = np.stack(rows, 0)
    rng = np.random.default_rng(7)
    ext = ext + (rng.random(ext.shape, dtype=np.float32) - .5) / 255
    return np.concatenate([ext, X], 0)
src = Image.fromarray((np.clip(extend(a), 0, 1) * 255 + .5).astype(np.uint8))
off_img = Image.fromarray((np.clip(extend(np.clip(off, 0, 1)), 0, 1) * 255 + .5).astype(np.uint8))
sig_rgb = extend(a)
sig_a = np.concatenate([np.repeat(glow[:1], E, 0), glow], 0)[..., None]
sign_img = Image.fromarray((np.dstack([sig_rgb, sig_a]).clip(0, 1) * 255 + .5).astype(np.uint8), 'RGBA')
H = H + E

for w in (1000, 1600, 2400):
    h = round(H * w / W)
    for name, im, q in (('on', src, 74), ('off', off_img, 70)):
        im.resize((w, h), Image.LANCZOS).save(f'site/img/hero-{name}-{w}.webp', quality=q, method=6)
    sign_img.resize((w, h), Image.LANCZOS).save(f'site/img/hero-sign-{w}.webp', quality=80, method=6)
off_img.resize((1000, round(H*1000/W))).save('/tmp/claude-0/-home-claude/e3f0d62b-c561-5e49-a9aa-09921a6f53ff/scratchpad/off.jpg')
Image.alpha_composite(off_img.convert('RGBA'), sign_img).convert('RGB').resize((1000, round(H*1000/W))).save('/tmp/claude-0/-home-claude/e3f0d62b-c561-5e49-a9aa-09921a6f53ff/scratchpad/signon.jpg')

# mélységtérkép: ugyanannyi sor fölé, a felső sor elmosott értékével (a fal távol van)
dm = np.asarray(Image.open('forras/hero-depth-v6.webp').convert('L')).astype(np.float32) / 255
Ed = round(dm.shape[1] * H / W) - dm.shape[0]
top = gx(dm[:4].mean(0)[:, None], 24)[:, 0]
dm2 = np.concatenate([np.repeat(top[None], Ed, 0), dm], 0)
Image.fromarray((dm2 * 255 + .5).astype(np.uint8)).save('site/img/hero-depth.webp', quality=80, method=6)
print('kész', W, H, E, Ed)
