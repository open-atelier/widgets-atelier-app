#!/usr/bin/env bash
# artwork/*.svg  ->  targets/widgets/Assets.xcassets/<name>.imageset/<name>.pdf
#
# WidgetKit cannot render SVG, so the source art is converted to vector PDF and
# placed in the widget target's asset catalog. The SVGs stay the source of
# truth in the repo; the PDFs and Contents.json are generated and committed so
# that a clean-clone prebuild works whether or not a converter is installed.
set -euo pipefail

# Cairo stamps a /CreationDate into every PDF it writes, which makes the
# committed output differ on each run for artwork that has not changed.
# Pinning the epoch makes conversion reproducible, so `git diff` over the
# asset catalog means "the artwork actually changed" and CI can rely on it.
export SOURCE_DATE_EPOCH=0

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src_dir="$repo_root/artwork"
out_root="$repo_root/targets/widgets/Assets.xcassets"

# rsvg-convert (brew install librsvg) is preferred: it is the fastest and emits
# a clean vector PDF. The others are accepted so nobody is blocked on it.
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
echo "==> converting with $converter"

shopt -s nullglob
svgs=("$src_dir"/*.svg)
if [ ${#svgs[@]} -eq 0 ]; then
  echo "error: no SVGs in $src_dir" >&2
  exit 1
fi

mkdir -p "$out_root"
cat > "$out_root/Contents.json" <<'JSON'
{
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
JSON

for svg in "${svgs[@]}"; do
  name="$(basename "$svg" .svg)"
  imageset="$out_root/$name.imageset"
  mkdir -p "$imageset"
  pdf="$imageset/$name.pdf"

  case "$converter" in
    rsvg)     rsvg-convert -f pdf -o "$pdf" "$svg" ;;
    cairosvg) cairosvg "$svg" -f pdf -o "$pdf" ;;
    inkscape) inkscape "$svg" --export-type=pdf --export-filename="$pdf" >/dev/null ;;
  esac

  # preserves-vector-representation keeps the PDF as vector rather than letting
  # Xcode rasterise it at build time, so it stays sharp at any accessory size.
  # template-rendering-intent discards colour and keeps alpha, which is what
  # the Lock Screen's vibrant rendering mode consumes anyway.
  cat > "$imageset/Contents.json" <<JSON
{
  "images" : [
    {
      "filename" : "$name.pdf",
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  },
  "properties" : {
    "preserves-vector-representation" : true,
    "template-rendering-intent" : "template"
  }
}
JSON
  echo "    $name.svg -> $name.imageset"
done

echo "==> done: $out_root"
