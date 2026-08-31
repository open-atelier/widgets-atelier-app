#!/usr/bin/env bash
# artwork/*.svg  ->  assets/previews/<name>.png
#
# The host app shows a gallery of the designs. It cannot render the real
# widgets -- those are compiled into a separate binary, the widget extension --
# so it renders the same source artwork as flat images instead. Going through
# artwork/ keeps one source of truth rather than a second copy that drifts.
#
# PNG rather than SVG so the app needs no SVG renderer, and React Native's
# built-in Image is enough. Height is fixed at 3x the 72pt accessory slot;
# width follows the viewBox, so a rectangular design comes out wider.
set -euo pipefail

# Keeps output byte-identical for unchanged artwork. See svg-to-pdf.sh.
export SOURCE_DATE_EPOCH=0

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src_dir="$repo_root/artwork"
out_dir="$repo_root/assets/previews"

# 72pt is the accessory slot height, 3x for the densest screen.
height=216

if command -v rsvg-convert >/dev/null 2>&1; then
  converter=rsvg
elif command -v cairosvg >/dev/null 2>&1; then
  converter=cairosvg
elif command -v inkscape >/dev/null 2>&1; then
  converter=inkscape
else
  echo "error: no SVG converter found." >&2
  echo "  install one of:  brew install librsvg   |   pipx install cairosvg   |   brew install --cask inkscape" >&2
  exit 1
fi
echo "==> rendering previews with $converter"

shopt -s nullglob
svgs=("$src_dir"/*.svg)
if [ ${#svgs[@]} -eq 0 ]; then
  echo "error: no SVGs in $src_dir" >&2
  exit 1
fi

mkdir -p "$out_dir"

for svg in "${svgs[@]}"; do
  name="$(basename "$svg" .svg)"
  png="$out_dir/$name.png"

  case "$converter" in
    rsvg)     rsvg-convert -h "$height" -f png -o "$png" "$svg" ;;
    cairosvg) cairosvg "$svg" -f png -o "$png" --output-height "$height" ;;
    inkscape) inkscape "$svg" --export-type=png --export-height="$height" --export-filename="$png" >/dev/null ;;
  esac

  echo "    $name.svg -> previews/$name.png"
done

echo "==> done: $out_dir"
