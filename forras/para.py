# Párás ablak réteg a nyitóképhez: csak az üvegtáblákon, a felkapcsolt képből elmosva, cseppekkel.
# Kimenet: site/img/hero-fog.webp (1000x760, átlátszó), a hero-* rétegekkel azonos méretarány.
import random, numpy as np
from PIL import Image, ImageFilter, ImageDraw
random.seed(7); np.random.seed(7)
W, H = 1000, 760
on = Image.open('site/img/hero-on-2400.webp').convert('RGB').resize((W, H), Image.LANCZOS)
# üvegtáblák (x0, y0, x1, y1) a 1000x760-as képen
PANES = [(323, 283, 440, 578), (475, 307, 610, 585), (641, 317, 755, 600), (783, 312, 855, 615)]
m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
for x0, y0, x1, y1 in PANES: d.rectangle((x0 + 2, y0 + 2, x1 - 2, y1 - 2), fill=255)
m = m.filter(ImageFilter.GaussianBlur(2.2))
M = np.asarray(m, np.float32) / 255
yy = np.arange(H)[:, None].astype(np.float32)
M *= np.clip((592 - yy) / 40, 0, 1)            # a kinti székek és asztalok elé ne kerüljön pára
b = np.asarray(on.filter(ImageFilter.GaussianBlur(13)), np.float32) / 255
lum = b.mean(2, keepdims=True)
glow = np.asarray(on.convert('L').filter(ImageFilter.GaussianBlur(45)), np.float32)[..., None] / 255
milk = np.array([.80, .84, .90], np.float32) * (.35 + .9 * glow)
fog = np.clip(b * .78 + milk * .26, 0, 1)
# lassú, felhős sűrűség: lent sűrűbb a pára
n = np.asarray(Image.fromarray((np.random.rand(H // 8, W // 8) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10)), np.float32) / 255
dens = .56 + .14 * n + .30 * np.clip((yy - 330) / 260, 0, 1)
A = M * np.clip(dens, 0, .96)
rgb = fog.copy()
# cseppek: tisztább kör, fent világos csillanás, lent sötétebb perem
cl = Image.new('L', (W, H), 0); dc = ImageDraw.Draw(cl)
hi = Image.new('L', (W, H), 0); dh = ImageDraw.Draw(hi)
for x0, y0, x1, y1 in PANES:
    area = (x1 - x0) * (y1 - y0)
    for _ in range(int(area / 900)):
        x = random.uniform(x0 + 4, x1 - 4); y = y0 + (y1 - y0) * (random.random() ** .7)
        r = random.choice([.7, .8, 1, 1.2, 1.5, 1.9]) * (1.25 if y > (y0 + y1) / 2 else 1)
        dc.ellipse((x - r, y - r * 1.1, x + r, y + r * 1.1), fill=235)
        if r > 1.4: dh.ellipse((x - r * .55, y - r * .8, x - r * .05, y - r * .3), fill=110)
cl = np.asarray(cl.filter(ImageFilter.GaussianBlur(.6)), np.float32) / 255
hi = np.asarray(hi.filter(ImageFilter.GaussianBlur(.5)), np.float32)[..., None] / 255
A = A * (1 - cl * .45)
rgb = np.clip(rgb * (1 - hi) + hi * .92, 0, 1)
A = np.maximum(A, hi[..., 0] * M * .9)
out = np.dstack([rgb, A[..., None]])
Image.fromarray((out * 255 + .5).astype(np.uint8), 'RGBA').save('site/img/hero-fog.webp', quality=84, method=6)
print('ok')
