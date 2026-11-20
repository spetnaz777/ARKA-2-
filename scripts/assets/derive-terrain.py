"""Derive a high-key white terrain (RGBA) from the existing public/services-hero-poster.jpg.
usage: python3 derive-terrain.py <src> <out.png> x0,y0,x1,y1 [threshold]
Sky above the detected ridge becomes transparent; rock/snow are remapped to a light gray range."""
import sys, numpy as np
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
x0,y0,x1,y1 = [int(v) for v in sys.argv[3].split(',')]
thr=float(sys.argv[4]) if len(sys.argv)>4 else 0.5
im=Image.open(src).convert("L").crop((x0,y0,x1,y1))
a=np.asarray(im,dtype=np.float32)/255
sm=np.asarray(im.filter(ImageFilter.GaussianBlur(6)),dtype=np.float32)/255
H,W=a.shape
alpha=np.zeros_like(a)
ridge=np.zeros(W,int)
for x in range(W):
    col=sm[:,x]; idx=np.where(col>thr)[0]
    ridge[x]=idx[0] if len(idx) else H
# smooth ridge (min filter-ish)
r=np.array(ridge,float)
k=9; r=np.array([r[max(0,i-k):i+k+1].mean() for i in range(W)])
yy=np.arange(H)[:,None]
alpha=np.clip((yy-(r[None,:]-4))/10,0,1)
# map luminance to high-key
v=0.56+0.42*np.clip(a,0,1)**0.85
rgba=np.zeros((H,W,4),np.uint8)
g=(v*255).astype(np.uint8)
rgba[...,0]=g;rgba[...,1]=g;rgba[...,2]=g;rgba[...,3]=(alpha*255).astype(np.uint8)
Image.fromarray(rgba,"RGBA").save(out)
