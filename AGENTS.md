# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Do not build iOS to check your work

**Default to not building.** A clean `expo prebuild` plus `xcodebuild` on this
project is roughly 10 minutes, and driving the result in a Simulator adds more.
Build only when the user asks for it, or when the change is one that genuinely
cannot be verified any other way.

## Verify statically first

Most changes here are provable without a build, and the cheap checks are also
the ones that catch real problems:

| Change | How to verify |
| --- | --- |
| TypeScript, React components | `npx tsc --noEmit` |
| Artwork conversion | run `bun run artwork`, then `git diff` — conversion is deterministic, so a diff means the artwork changed |
| Generated PNGs and PDFs | check dimensions and that they contain non-transparent pixels |
| Asset wiring | `grep` the imageset out of `targets/widgets/Assets.xcassets`, or the asset path out of a Metro bundle |
| Bundle ids, entitlements, embedded `.appex` | the checks in `.github/workflows/build-unsigned-ios.yml`, run against an existing `ios/` |
| Swift that only adds a design | read it against a sibling in `targets/widgets/Designs/` — they are near-identical by construction |

## A JS change needs no native build

Nothing under `app/`, `components/` or `assets/` requires recompiling. If a
build already exists, Metro serves the change. If one does not, a build is not
usually the right way to answer the question anyway.

Adding files under `targets/widgets/` does not need `expo prebuild` either — the
target is an Xcode synchronized folder, so a plain rebuild picks them up.
Prebuild is only needed after changing `app.json` or `expo-target.config.js`.

## If you do drive the Simulator, know what it costs

This path is slow and unreliable, and it has bitten before:

- `expo-dev-client` shows a launcher and a first-run developer-menu sheet. The
  sheet covers the screen and there is **no way to dismiss it from the command
  line** — `simctl` has no tap, and `osascript` needs assistive access that is
  not granted.
- `simctl openurl` on a custom scheme always shows an "Open in …?" confirmation,
  which also cannot be dismissed.
- Fast refresh silently stops applying if the app is relaunched with
  `simctl launch`. Screenshots then show stale JS, which looks exactly like a
  rendering bug. **Confirm the bundle count in the Metro log actually increased
  before trusting a screenshot.**

If a change really does need eyes on a running app, say so and let the user run
it, rather than spending the time and reporting an inconclusive result.

## Never claim a visual result you did not see

Static checks prove the pipeline, not the pixels. If the artwork was not
observed rendering, say that plainly instead of inferring it from a green
typecheck and a 200 from Metro.

# Illustration sizes

The artwork is vector and rendered with `scaledToFit`, so absolute size is
irrelevant. Only two things matter: the **aspect ratio** of the `viewBox`, and
the **weight of detail relative to it**.

## Use these viewBoxes

| Slot | Family | viewBox | Ratio |
| --- | --- | --- | --- |
| Small | `accessoryCircular` | `0 0 72 72` | 1:1 |
| Big | `accessoryRectangular` | `0 0 160 72` | 20:9 |

They match the real slot sizes, so **1 viewBox unit ≈ 1pt** and you can reason
directly in points. That is the reason to prefer them over something like
24×24.

## Small: the circle clips the corners

The slot is 72pt across, radius 36pt, so a square image loses its corners:

| Padding | Art frame | Corner reaches | |
| --- | --- | --- | --- |
| 6 | 60pt | 42.4pt | clipped |
| 8 | 56pt | 39.6pt | clipped |
| 10 | 52pt | 36.8pt | clipped by 0.8pt |
| **11** | **50pt** | **35.4pt** | **safe** |

The largest corner-safe frame is **50.9pt**.

So art that reaches its viewBox corners wants `padding: 11`. Art that is a
centred round-ish shape with empty corners is fine at 6–8, because there is
nothing out there to clip — which is why `cat` works at 4: its furthest drawn
point is 30.4pt from the slot centre, comfortably inside the 36pt radius.

Measure rather than guess. Render the SVG at the frame size and check the
furthest opaque pixel against the radius; the bounding box is too pessimistic,
because round-ish art does not fill its own corners.

## Big: you get nearly all of it

160×72pt with no meaningful clipping. `padding: 2` gives 156×68, essentially
the whole slot. Keep important detail 2–3pt inside the edge for the rounded
corners.

## Minimum detail is 3pt

Below roughly 3pt a feature disappears in vibrant rendering. In viewBox units,
for the designs actually in the repo:

| Design | viewBox | Padding | pt/unit | 3pt needs |
| --- | --- | --- | --- | --- |
| `cat` | 72×72 | 4 | 0.889 | 3.4 units (4.7% of short side) |
| `sparkle` | 72×72 | 10 | 0.722 | 4.2 units (5.8%) |

**Rule of thumb: a feature narrower than ~5% of the viewBox's short side will
probably vanish.** On a 72-unit viewBox that is 4 units. Strokes, gaps between
shapes, and negative space all count.

The circular slot is the harder constraint — smaller and clipped — so design
for it first and adapt outward.

## If the source is a bitmap rather than an SVG

Avoid it, but at 3x: circular **216×216**, rectangular **480×216**. Those are
the sizes `tools/svg-to-png.sh` emits for the app gallery.

# Every illustration ships two variants

Never add a design with only one. Each artwork gets **two** `Widget` structs in
its file under `targets/widgets/Designs/`:

- **plain** — no backing, so the artwork itself becomes the vibrant material
- **plate** — `AccessoryWidgetBackground()` behind it

Which one reads better depends on the wallpaper, so it is the user's choice, not
a decision to make on their behalf. This applies to both families: small
(`accessoryCircular`) and big (`accessoryRectangular`).

## Convention

| | `kind` | Display name |
| --- | --- | --- |
| Plain | `MoonCircular` | `Moon` |
| Plate | `MoonCircularPlate` | `Moon, plate` |

Register **both** in `WidgetsAtelierBundle.swift` — an unregistered widget
compiles cleanly and simply never appears in the picker.

Then add **one** row to the table in `components/widget-gallery.tsx`. That
table is one row per artwork, not per widget; showing both variants would just
be the same illustration twice.

## Never rename a shipped kind

`kind` is how iOS matches an already-placed widget to its definition. Renaming
one blanks every instance a user has already placed, so treat it as permanent
from the moment it ships — even to fix a naming inconsistency.

Change display names instead — those are not load-bearing.

## If the picker gets too long

The fix is fewer designs, not dropping a variant. Failing that,
`AppIntentConfiguration` (iOS 17) turns the plate into a toggle in the widget's
own edit menu and halves the row count. It needs no entitlement, so it works on
a free account, but it adds AppIntents to the extension and a framework to
`expo-target.config.js` — which means a prebuild.

Full procedure: `docs/adding-an-illustration.md`.
