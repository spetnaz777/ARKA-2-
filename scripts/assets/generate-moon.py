"""Procedural grayscale moon for the ARKA white design.

No external imagery: a seeded fractal-noise + crater heightmap is generated in
equirectangular space, projected onto a sphere and bump-shaded with a soft
upper-left light. Output: RGBA PNG (transparent outside the disc).

usage: python3 generate-moon.py out.png [size]
"""
import sys
import numpy as np
from PIL import Image

out = sys.argv[1]
N = int(sys.argv[2]) if len(sys.argv) > 2 else 1600
rng = np.random.default_rng(7)
TW, TH = 2048, 1024


def fractal(w, h, octaves=6, persistence=0.55):
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        f = np.fft.fft2(rng.standard_normal((h, w)))
        ky = np.fft.fftfreq(h)[:, None]
        kx = np.fft.fftfreq(w)[None, :]
        k = np.sqrt(kx * kx + ky * ky)
        band = 2.0 ** o / 512
        filt = np.exp(-((k - band) ** 2) / (2 * (band * 0.6) ** 2))
        layer = np.real(np.fft.ifft2(f * filt))
        layer /= layer.std() + 1e-9
        acc += amp * layer
        tot += amp
        amp *= persistence
    return acc / tot


height = fractal(TW, TH) * 0.035
albedo = fractal(TW, TH, octaves=4, persistence=0.7)
# maria-like broad dark patches
albedo = 0.5 * albedo + 0.5 * np.tanh(fractal(TW, TH, octaves=2, persistence=0.9) * 1.4)

yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32)
lat = (0.5 - yy / TH) * np.pi
coslat = np.cos(lat)

# craters: power-law radii, placed on the sphere
n_craters = 3200
radii = 0.004 * (1 + rng.pareto(1.6, n_craters))  # radians
radii = np.clip(radii, 0.004, 0.16)
for r in radii:
    clon = rng.uniform(-np.pi, np.pi)
    clat = np.arcsin(rng.uniform(-1, 1))
    # bounding box in texture space
    cy = (0.5 - clat / np.pi) * TH
    cx = (clon / (2 * np.pi) + 0.5) * TW
    ry = r / np.pi * TH * 1.6
    rx = ry * 2 / max(np.cos(clat), 0.2)
    y0, y1 = int(max(cy - ry, 0)), int(min(cy + ry, TH))
    x0, x1 = int(cx - rx), int(cx + rx)
    if y1 <= y0:
        continue
    xs = np.arange(x0, x1) % TW
    sub_lat = lat[y0:y1, :][:, xs]
    sub_lon = (xs / TW - 0.5) * 2 * np.pi
    # great-circle distance
    d = np.arccos(np.clip(np.sin(sub_lat) * np.sin(clat) + np.cos(sub_lat) * np.cos(clat) * np.cos(sub_lon[None, :] - clon), -1, 1))
    t = d / r
    bowl = np.where(t < 1, -(1 - t * t) * 0.9, 0)
    rim = 0.35 * np.exp(-((t - 1.0) ** 2) / 0.02)
    ejecta = 0.06 * np.exp(-(t - 1) * 2.5) * (t > 1)
    depth = r * 2.2
    height[y0:y1, :][:, xs] += (bowl + rim + ejecta) * depth
    albedo[y0:y1, :][:, xs] += np.where(t < 1.6, 0.25 * np.exp(-((t - 1.05) ** 2) / 0.08) * min(1, r * 40), 0)

# soften the heightmap slightly so rims read as relief, not cut-outs
_ky = np.fft.fftfreq(TH)[:, None]
_kx = np.fft.fftfreq(TW)[None, :]
height = np.real(np.fft.ifft2(np.fft.fft2(height) * np.exp(-(_kx ** 2 + _ky ** 2) * (2 * np.pi * 1.6) ** 2 / 2)))

# project onto sphere
R = N / 2
y, x = np.mgrid[0:N, 0:N].astype(np.float32)
nx = (x + 0.5 - R) / R
ny = -(y + 0.5 - R) / R
rr = nx * nx + ny * ny
m = rr <= 1
nz = np.sqrt(np.clip(1 - rr, 0, 1))
plat = np.arcsin(np.clip(ny, -1, 1))
plon = np.arctan2(nx, nz)
u = (plon / (2 * np.pi) + 0.5) % 1
v = 0.5 - plat / np.pi


def samp(img):
    H, W = img.shape
    return img[np.clip((v * H).astype(int), 0, H - 1), np.clip((u * W).astype(int), 0, W - 1)]


gy, gx = np.gradient(height)
du, dv = samp(gx) * TW / 6, samp(gy) * TH / 6
L = np.array([-0.74, 0.42, 0.52])
L /= np.linalg.norm(L)
pX, pY, pZ = nx - du * 0.45, ny + dv * 0.45, nz
n = np.sqrt(pX ** 2 + pY ** 2 + pZ ** 2) + 1e-6
lam = np.clip((pX * L[0] + pY * L[1] + pZ * L[2]) / n, 0, 1)
shade = 0.34 + 0.66 * lam ** 0.85
a = samp(albedo)
a = (a - a[m].mean()) / (a[m].std() + 1e-6)
val = np.clip((0.80 + 0.028 * a) * (0.55 + 0.45 * shade) + 0.08, 0, 1)
edge = np.clip((1 - np.sqrt(rr)) * R / 2.0, 0, 1)
img = np.zeros((N, N, 4), np.uint8)
g = (val * 255).astype(np.uint8)
img[..., 0] = img[..., 1] = img[..., 2] = g
img[..., 3] = (m * edge * 255).astype(np.uint8)
Image.fromarray(img, "RGBA").save(out)
print("wrote", out)
