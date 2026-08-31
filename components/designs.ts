/**
 * The illustrations, mirroring targets/widgets/Designs/.
 *
 * The app cannot render the real widgets -- WidgetKit views compile into the
 * extension, a separate binary, and there is no public API to draw another
 * target's widget inside your app. So the gallery renders the same source
 * artwork at real accessory sizes, from the PNGs the artwork pipeline emits.
 *
 * One entry per artwork. Each ships two widget variants, plain and plated,
 * which the gallery shows side by side.
 *
 * Nothing keeps this in step with the Swift designs -- see
 * docs/adding-an-illustration.md, "Keeping the app gallery in step".
 */
export type Design = {
  name: string;
  /** Matches the SVG filename and the imageset name. */
  slug: string;
  image: number;
  family: "circular" | "rectangular";
  /** Must match the AccessoryArt padding in the Swift design. */
  padding: number;
  description: string;
};

export const DESIGNS: Design[] = [
  {
    name: "Cat",
    slug: "cat",
    image: require("../assets/previews/cat.png"),
    family: "circular",
    padding: 4,
    description: "A cat looking back at you.",
  },
  {
    name: "Sparkle",
    slug: "sparkle",
    image: require("../assets/previews/sparkle.png"),
    family: "circular",
    padding: 10,
    description: "A four-point sparkle.",
  },
];

/** Real accessory slot sizes, in points. */
export const SLOT = {
  circularDiameter: 72,
  rectangularWidth: 160,
  height: 72,
} as const;
