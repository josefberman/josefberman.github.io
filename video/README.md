# Hero background (legacy video assets)

The **homepage hero** now uses a **Three.js** scene (`js/heroSwarmLandscape.js`): a procedural **periodic height field** and **swarm rovers**—not this MP4.

These files are kept if you want to switch back to a video hero:

**`hero-bg.mp4`** — Mandelbrot zoom clip (720p, ~4MB).

**`hero-poster.jpg`** — Still frame from that clip.

## Regenerate the clip (full quality source, then compress)

High-quality source (slow; ~1080p, larger file):

```bash
ffmpeg -y -f lavfi -i "mandelbrot=s=1920x1080:r=24:start_scale=3.2:end_scale=0.08:end_pts=600:morphamp=0.035:morphxf=0.008:morphyf=0.011:start_x=-0.743643887037151:start_y=-0.131825904205330" \
  -t 14 -vf "hue=h='mod(12*t,360)':s=0.85,eq=contrast=1.08:saturation=1.15,colorchannelmixer=.9:.15:.05:0:.1:.85:.12:0:.08:.2:.95:0" \
  -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart -an hero-src.mp4

ffmpeg -y -i hero-src.mp4 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -crf 26 -preset medium -movflags +faststart -an hero-bg.mp4
```

Poster:

```bash
ffmpeg -y -ss 4 -i hero-bg.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
```

## Use stock footage instead

Replace `hero-bg.mp4` with your own MP4 (e.g. from [Pexels](https://www.pexels.com/search/videos/abstract/) or [Pixabay](https://pixabay.com/videos/search/technology/)), then regenerate `hero-poster.jpg` as above.
