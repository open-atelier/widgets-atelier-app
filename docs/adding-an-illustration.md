# Adding an illustration

Three files to touch, one command to run. This walks through it with a worked
example, then covers the rules the artwork has to follow and the failures that
are easy to hit.

## Quickstart

```sh
cp ~/Desktop/moon.svg artwork/moon.svg   # 1. drop the SVG in
bun run artwork                          # 2. convert it
$EDITOR targets/widgets/Designs/MoonCircular.swift          # 3. add a design
$EDITOR targets/widgets/WidgetsAtelierBundle.swift          # 4. register it
bun run ios                              # 5. build to the device
```

You do **not** need to re-run `expo prebuild`. The widget target is wired into
Xcode as a synchronized folder, so anything you add under `targets/widgets/`
is picked up on the next build. Prebuild is only needed if you change
`app.json` or `targets/widgets/expo-target.config.js`, or if `ios/` does not
exist yet.

## 1. Drop the SVG in

Put it in `artwork/`. The filename becomes the image name you reference from
Swift, so `artwork/moon.svg` is `Image("moon")`. Use kebab-case.

`artwork/` is the source of truth. Never edit the asset catalog by hand.

## 2. Convert it

```sh
bun run artwork
```

This runs `tools/svg-to-pdf.sh` over every file in `artwork/` and writes
`targets/widgets/Assets.xcassets/<name>.imageset/` containing the PDF and a
`Contents.json`.

WidgetKit cannot render SVG, which is why the conversion exists at all. The
generated PDF is vector, and `Contents.json` sets:

- `preserves-vector-representation` — keeps it vector instead of letting Xcode
  rasterise at build time, so it stays sharp at any accessory size.
- `template-rendering-intent: template` — discards colour and keeps alpha,
  which is all the Lock Screen's vibrant rendering mode consumes anyway.

The script needs a converter. In preference order:

```sh
brew install librsvg          # rsvg-convert, fastest and cleanest
pipx install cairosvg         # or
brew install --cask inkscape  # or
```

**Commit the generated PDF along with the SVG.** Conversion pins
`SOURCE_DATE_EPOCH`, so unchanged artwork converts to byte-identical output —
which means a diff over the asset catalog genuinely indicates the artwork
changed. CI reconverts before every build and warns if the committed PDFs were
stale.

## 3. Add a design

One file per artwork in `targets/widgets/Designs/`, holding **two** `Widget`
structs: plain, and with the backing plate. Every design ships both, because
which one reads better depends on the wallpaper, so it is the user's choice
rather than yours.

```swift
import SwiftUI
import WidgetKit

struct MoonCircular: Widget {
    let kind = "MoonCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "moon", padding: 8)
        }
        .configurationDisplayName("Moon")
        .description("A crescent moon.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}

struct MoonCircularPlate: Widget {
    let kind = "MoonCircularPlate"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "moon", padding: 8, showsBackground: true)
        }
        .configurationDisplayName("Moon, plate")
        .description("A crescent moon, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
```

Convention: the plain variant carries the bare name, the plated one gets a
`Plate` suffix on its `kind` and `, plate` on its display name.

`StaticProvider` is shared and needs no thought — one entry, `.never` refresh
policy, since nothing here ever changes.

`AccessoryArt` (`../targets/widgets/Shared/AccessoryArt.swift`) does the
rendering. It centralises `.containerBackground(.clear, for: .widget)`, which
is mandatory against the iOS 17+ SDK and produces a blank widget rather than a
build error when missing — so don't hand-roll a design that bypasses it. It
also handles always-on display by fading the art to 60%.

You choose three things:

| Parameter | What it does |
| --- | --- |
| `imageName` | The SVG filename without its extension. |
| `padding` | Insets the art. `0–2` rectangular, `8–10` circular. |
| `showsBackground` | Draws `AccessoryWidgetBackground()` behind the art. |

Without the plate, the artwork alone becomes the vibrant material — the
"floating art, no backing" look. The plate helps line art hold up over busy
wallpaper and tends to read as noise behind bold solid fills. On
`accessoryRectangular` it is a large slab, so it is the less common choice
there.

What the existing designs use, as a calibration:

| Design | Family | Padding |
| --- | --- | --- |
| `CatCircular` | circular | 4 |
| `SparkleCircular` | circular | 10 |

Both ship plain and plated, so the plate is not a per-design property.

Use the plate for line art and for anything competing with a busy wallpaper.
Skip it behind bold solid fills, where it usually just reads as noise.

### Picking padding for a circular slot

A circular slot is about 72pt across and clips to a circle, so the corners of a
square image are cut off. The largest square that fits inside a 72pt circle is
about 51pt.

With `padding: 8` the art gets 56pt, and if the SVG already has its own margin
you are comfortably inside the safe area.

Better than reasoning about it: render the SVG at the frame size and measure the
furthest opaque pixel from the slot centre. `cat.svg` reaches only 30.4pt at
`padding: 4`, against a 36pt radius — which is why it can afford to render
larger than the others. A bounding-box check would have wrongly said it clips.

If your SVG is tightly cropped and reaches its corners, use `padding: 11`. That
is the first value whose frame corners (35.4pt) stay inside the 36pt radius —
`padding: 10` still clips, by 0.8pt.

AGENTS.md has the full table, plus the minimum detail thresholds.

## 4. Register it

Add **both** variants to `targets/widgets/WidgetsAtelierBundle.swift`:

```swift
@main
struct WidgetsAtelierBundle: WidgetBundle {
    var body: some Widget {
        // ... existing entries
        MoonCircular()        // ← each entry is one row in the iOS picker
        MoonCircularPlate()
    }
}
```

**Skipping this compiles cleanly and the widget simply never appears.** It is
the most common reason a new design does not show up.

Since every design ships twice, each new artwork adds two picker rows. Six to
eight rows is comfortable; past that the picker gets tedious to scroll, and the
answer is fewer designs rather than dropping a variant.

There is a tidier alternative if this ever gets unwieldy: `AppIntentConfiguration`
(iOS 17) would make the plate a toggle in the widget's own edit menu, halving
the row count. It needs no entitlement, so it is compatible with a free
account, but it does add AppIntents to the extension and a new framework in
`expo-target.config.js`, which means a prebuild.

## 5. Build and place it

```sh
bun run ios
```

Then on the device: press and hold the Lock Screen → **Customize** → **Lock
Screen** → tap the widget area → **Widgets Atelier** → your design.

## What the artwork has to be

Accessory widgets render in `WidgetRenderingMode.vibrant`. iOS desaturates the
widget and recomposites it as a vibrant material over the wallpaper. Three
consequences:

1. **Colour is discarded.** Design in luminance and alpha only. Use *alpha*,
   not grey values, to express depth.
2. **Black becomes transparent, white becomes opaque.** Mid-greys land between.
3. **The slots are small.** `accessoryCircular` is roughly 72–76pt across;
   `accessoryRectangular` roughly 160×72pt. Bold closed shapes survive.
   Delicate whiskers do not.

So an SVG should be:

- **Monochrome**, and ideally explicitly white. Do not leave
  `stroke="currentColor"` — rsvg resolves it to black. That still works as a
  template, since template rendering keys off alpha, but it reads as a mistake
  next to the rest of `artwork/`.
- **Free of text elements.** Convert text to paths.
- **Tightly cropped**, with an explicit `viewBox` and no stray whitespace, so
  `scaledToFit` behaves predictably.
- **Flattened to filled paths**, *or* stroked thickly enough to survive.

On that last point: the flattening rule exists to catch hairlines, not to ban
stroking. `cat.svg` is stroke-style line art flattened to filled paths: at
`padding: 4` its median feature is 6pt and only 6% of runs fall under 3pt, which
reads fine. Rough test — `stroke_width / viewBox_width × 56` should be 3pt or
more.

If you do flatten, watch subpath winding. Overlapping subpaths cancel into
holes under `fill-rule="evenodd"`, and under the default `nonzero` they only
union if wound the same direction. `artwork/cat.svg` relies on `evenodd` for its
outline, with the eyes and nose as separate elements so their winding cannot
interact with it.

### Preview before you build

Rendering the SVG at true proportions catches most problems in seconds:

```sh
# circular: 72pt slot with the backing plate, at 5x for inspection
rsvg-convert -b '#1c1c1e' -z 5 -f png -o /tmp/preview.png artwork/moon.svg
open /tmp/preview.png
```

This approximates the geometry, not the vibrancy. It will not tell you whether
the design reads over a real wallpaper.

## Checking a design

Xcode previews and the Simulator approximate vibrancy but do not reproduce it.
Check on the physical device Lock Screen:

- [ ] Light wallpaper
- [ ] Dark wallpaper
- [ ] Busy photographic wallpaper — the worst case, and the real test
- [ ] Both Lock Screen widget slots
- [ ] Always-on display, if the device supports it

## Troubleshooting

**The widget is missing from the picker.** Most likely you did not add it to
`WidgetsAtelierBundle`. If it is there, the picker caches aggressively — delete
the app and reinstall, or reboot the device. A new `kind` sometimes will not
surface until then.

**The widget is blank or letterboxed.** Something bypassed
`.containerBackground(.clear, for: .widget)`. Use `AccessoryArt` rather than
building a view from scratch.

**The art is invisible.** Check that the imageset was generated
(`ls targets/widgets/Assets.xcassets/`) and that `imageName` matches the SVG
filename exactly, without the extension.

**The art is clipped in a circular slot.** Increase `padding`. Start at 10 for a
tightly cropped SVG.

**Detail has disappeared.** It was below the few-point threshold. Thicken it in
the source SVG; there is no rendering flag that recovers it.

## Keeping the app gallery in step

`components/designs.ts` holds its own small table of designs, because
the host app renders the source PNGs rather than the real widgets (it cannot —
see the file's own comment). It shows **one row per artwork**, not per widget,
so adding a design means adding one entry there even though it adds two picker
rows.

Nothing enforces that the two stay in step. If the gallery is missing a design,
this is why.

Give each entry a few `keywords` while you are there. The gallery search is
fuzzy (Fuse.js), and name plus description alone is a thin target — someone
hunting for the sparkle is as likely to type "star" or "glitter".

## One SVG, both families

A single SVG can back two widgets, with different padding, but each needs its
own `Widget` struct and its own unique `kind`. In practice a rectangular
composition rarely survives the circular crop, so most designs want dedicated
artwork per family.

## A note on `kind`

`kind` is how iOS matches a placed widget back to its definition. Rename it
later and every instance already sitting on someone's Lock Screen goes blank.
Choose it once and leave it alone — even to fix a naming inconsistency. Change
the display name instead; that is not load-bearing.
