#!/usr/bin/env python3
"""Measure how each artwork sits in the circular accessory slot.

    python3 tools/measure-artwork.py            # report every design
    python3 tools/measure-artwork.py --fix      # also recentre the SVG viewBoxes

For each SVG in artwork/ this renders it at the frame size its design uses
(72pt minus twice the padding from components/designs.ts) and reports, in
points from the slot centre:

  bbox     centre of the ink's bounding box
  centroid alpha-weighted centre of the ink, i.e. where the visual mass is
  optical  midpoint of the two -- the target the artwork is centred on
  reach    furthest opaque pixel from the slot centre; must stay under 36

Why the midpoint: centring the bounding box ignores where the weight is
(a hooded face reads top-heavy even when its box is centred), and centring
the centroid alone over-corrects for asymmetric art (a big bow drags a whole
face sideways). Halfway between is the usual optical-centring compromise,
and it is a rule rather than a taste, so it can be re-applied when artwork
changes. Final sign-off is still by eye on the phone.

--fix shifts each viewBox origin so the optical centre lands on the slot
centre. It only touches the origin, never the size, so padding and detail
weight are unaffected. Shifts under 0.5pt are skipped as invisible. Re-run
`bun run artwork` afterwards to regenerate the PDFs and preview PNGs.

Needs rsvg-convert and ImageMagick (brew install librsvg imagemagick).
"""
import glob
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLOT = 72.0
RADIUS = SLOT / 2
RENDER = 720  # pixels per side; 10 px/pt at padding 0
MIN_SHIFT_PT = 0.5


def paddings():
    """slug -> padding, from the gallery table, which mirrors the Swift designs."""
    src = open(os.path.join(ROOT, "components/designs.ts")).read()
    out = {}
    for block in re.findall(r"\{[^{}]*\}", src, re.S):
        slug = re.search(r'slug:\s*"([^"]+)"', block)
        pad = re.search(r"padding:\s*([\d.]+)", block)
        if slug and pad:
            out[slug.group(1)] = float(pad.group(1))
    return out


def alpha(svg):
    with tempfile.TemporaryDirectory() as tmp:
        png = os.path.join(tmp, "a.png")
        subprocess.run(
            ["rsvg-convert", "-w", str(RENDER), "-h", str(RENDER), "-f", "png", "-o", png, svg],
            check=True,
        )
        raw = subprocess.run(
            ["magick", png, "-alpha", "extract", "-depth", "8", "gray:-"],
            check=True, capture_output=True,
        ).stdout
    assert len(raw) == RENDER * RENDER, "unexpected raster size"
    return raw


def measure(svg, pad):
    raw = alpha(svg)
    n = RENDER
    frame = SLOT - 2 * pad
    pt = frame / n  # points per pixel
    sx = sy = m = 0
    minx = miny = n
    maxx = maxy = -1
    reach2 = 0.0
    for y in range(n):
        row = raw[y * n:(y + 1) * n]
        for x, a in enumerate(row):
            if not a:
                continue
            m += a
            sx += a * x
            sy += a * y
            minx = min(minx, x); maxx = max(maxx, x)
            miny = min(miny, y); maxy = max(maxy, y)
            if a > 128:
                dx = (x + 0.5 - n / 2) * pt
                dy = (y + 0.5 - n / 2) * pt
                reach2 = max(reach2, dx * dx + dy * dy)
    if not m:
        raise SystemExit(f"{svg}: no ink")
    to_pt = lambda px: (px - n / 2) * pt
    bbox = (to_pt((minx + maxx + 1) / 2), to_pt((miny + maxy + 1) / 2))
    cen = (to_pt(sx / m), to_pt(sy / m))
    opt = ((bbox[0] + cen[0]) / 2, (bbox[1] + cen[1]) / 2)
    return dict(bbox=bbox, centroid=cen, optical=opt, reach=reach2 ** 0.5, frame=frame)


def viewbox(text):
    mt = re.search(r'viewBox="([^"]*)"', text)
    x, y, w, h = (float(v) for v in mt.group(1).split())
    return mt, x, y, w, h


def fmt(p):
    return f"({p[0]:+.2f}, {p[1]:+.2f})"


def main():
    fix = "--fix" in sys.argv
    pads = paddings()
    print(f"{'design':24} {'bbox':>16} {'centroid':>16} {'optical':>16} {'reach':>6}")
    for svg in sorted(glob.glob(os.path.join(ROOT, "artwork", "*.svg"))):
        slug = os.path.basename(svg)[:-4]
        if slug not in pads:
            print(f"{slug:24} (not in components/designs.ts, skipped)")
            continue
        pad = pads[slug]
        r = measure(svg, pad)
        flag = "  CLIPS" if r["reach"] > RADIUS else ""
        print(f"{slug:24} {fmt(r['bbox']):>16} {fmt(r['centroid']):>16} {fmt(r['optical']):>16} {r['reach']:6.1f}{flag}")
        if not fix:
            continue
        dx, dy = r["optical"]
        if abs(dx) < MIN_SHIFT_PT and abs(dy) < MIN_SHIFT_PT:
            continue
        text = open(svg).read()
        mt, x, y, w, h = viewbox(text)
        assert w == h, f"{slug}: viewBox is not square"
        upt = w / r["frame"]  # viewBox units per point
        nx, ny = x + dx * upt, y + dy * upt
        new = f'viewBox="{nx:.3f} {ny:.3f} {w:g} {h:g}"'
        text = text[:mt.start()] + new + text[mt.end():]
        open(svg, "w").write(text)
        print(f"{'':24} -> {new}  (shifted {dx:+.2f}, {dy:+.2f} pt)")
    if fix:
        print("\nre-run to confirm, then: bun run artwork")


if __name__ == "__main__":
    main()
