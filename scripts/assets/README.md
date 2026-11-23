# Asset derivation (run from repo root)

Pale stills (grayscale, raised exposure):

    for f in img-space img-monolith img-corridor img-hall img-concrete rocket-hangar deep-black-hero; do
      for w in 1200 640; do
        magick public/$f.jpg -colorspace gray -auto-level +level 54%,99% -resize ${w}x -quality 52 public/media/pale-$f-$w.avif
        magick public/$f.jpg -colorspace gray -auto-level +level 54%,99% -resize ${w}x -quality 68 public/media/pale-$f-$w.webp
      done
    done

Video loops (muted, gray, lifted):

    ffmpeg -i public/services-hero-mobile.mp4 -an -vf "scale=960:-2,format=gray,lutyuv=y='158+val*0.38':u=128:v=128,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 48 public/media/terrain-loop.webm
    ffmpeg -i public/landing-bg.mp4 -an -vf "crop=1280:470:0:80,scale=960:-2,format=gray,lutyuv=y='136+val*0.46':u=128:v=128,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 46 public/media/horizon-loop.webm
    (mp4/h264 fallbacks: same filters + format=yuv420p, -c:v libx264 -crf 32 -movflags +faststart)

`landing-bg.mp4` itself is git-ignored (only its derivative is committed). Moon: `generate-moon.py`; white terrain: `derive-terrain.py`.

## Stock imagery (v6)

Sources, photographers and licences: `public/media/CREDITS.md`. Grading/export:

    curl -sSL -o full.jpg "https://images.unsplash.com/photo-<id>?w=2600&q=90&fm=jpg"
    for w in 1600 800; do
      magick full.jpg -colorspace gray -auto-level -sigmoidal-contrast 3,50% -resize ${w}x -quality 54 public/media/stock-<key>-$w.avif
      magick full.jpg -colorspace gray -auto-level -sigmoidal-contrast 3,50% -resize ${w}x -quality 72 public/media/stock-<key>-$w.webp
    done

NASA originals come from `https://images-assets.nasa.gov/image/<nasa_id>/collection.json` (~orig.jpg); the
full moon is cut to alpha from its black sky (luminance > 14, feathered).
