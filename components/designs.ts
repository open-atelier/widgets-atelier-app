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
  /**
   * The widget kinds of the two variants, plain then plate, matching the
   * designs in targets/widgets/Designs/. Kinds are permanent once shipped,
   * so a renamed artwork (cat-outline) keeps its original kind (CatCircular).
   */
  kinds: [plain: string, plate: string];
  image: number;
  family: "circular" | "rectangular";
  /** Must match the AccessoryArt padding in the Swift design. */
  padding: number;
  description: string;
  /**
   * Extra terms the search should match. The name and description alone are
   * a thin target -- someone looking for the sparkle is as likely to type
   * "star" or "glitter".
   */
  keywords: string[];
};

export const DESIGNS: Design[] = [
  {
    name: "Cat outline",
    slug: "cat-outline",
    kinds: ["CatCircular", "CatCircularPlate"],
    image: require("../assets/previews/cat-outline.png"),
    family: "circular",
    padding: 4,
    description: "A cat looking back at you.",
    keywords: ["kitten", "kitty", "animal", "pet", "face", "whiskers", "feline"],
  },
  {
    name: "Hello Kitty filled",
    slug: "hello-kitty-filled",
    kinds: ["HelloKittyFilledCircular", "HelloKittyFilledCircularPlate"],
    image: require("../assets/previews/hello-kitty-filled.png"),
    family: "circular",
    padding: 4,
    description: "Hello Kitty, solid fill.",
    keywords: ["sanrio", "cat", "kitty", "bow", "character", "cute", "kawaii"],
  },
  {
    name: "Hello Kitty outline",
    slug: "hello-kitty-outline",
    kinds: ["HelloKittyOutlineCircular", "HelloKittyOutlineCircularPlate"],
    image: require("../assets/previews/hello-kitty-outline.png"),
    family: "circular",
    padding: 2,
    description: "Hello Kitty, line art.",
    keywords: ["sanrio", "cat", "kitty", "bow", "character", "cute", "kawaii"],
  },
  {
    name: "Kuromi",
    slug: "kuromi-filled",
    kinds: ["KuromiFilledCircular", "KuromiFilledCircularPlate"],
    image: require("../assets/previews/kuromi-filled.png"),
    family: "circular",
    padding: 8,
    description: "Kuromi, solid fill.",
    keywords: ["sanrio", "rabbit", "bunny", "skull", "jester", "punk", "kawaii"],
  },
  {
    name: "My Melody filled",
    slug: "my-melody-filled",
    kinds: ["MyMelodyFilledCircular", "MyMelodyFilledCircularPlate"],
    image: require("../assets/previews/my-melody-filled.png"),
    family: "circular",
    padding: 10,
    description: "My Melody, solid fill.",
    keywords: ["sanrio", "rabbit", "bunny", "hood", "character", "cute", "kawaii"],
  },
  {
    name: "My Melody outline",
    slug: "my-melody-outline",
    kinds: ["MyMelodyOutlineCircular", "MyMelodyOutlineCircularPlate"],
    image: require("../assets/previews/my-melody-outline.png"),
    family: "circular",
    padding: 7,
    description: "My Melody, line art.",
    keywords: ["sanrio", "rabbit", "bunny", "hood", "character", "cute", "kawaii"],
  },
  {
    name: "Sparkles",
    slug: "sparkles-filled",
    kinds: ["SparklesFilledCircular", "SparklesFilledCircularPlate"],
    image: require("../assets/previews/sparkles-filled.png"),
    family: "circular",
    padding: 10,
    description: "Three rounded sparkles.",
    keywords: ["star", "shine", "glitter", "twinkle", "magic", "ai", "round"],
  },
  {
    name: "Sparkles sharp",
    slug: "sparkles-sharp-filled",
    kinds: ["SparkleCircular", "SparkleCircularPlate"],
    image: require("../assets/previews/sparkles-sharp-filled.png"),
    family: "circular",
    padding: 10,
    description: "A four-point sparkle.",
    keywords: ["star", "shine", "glitter", "twinkle", "magic", "ai", "sharp"],
  },
];

/** Real accessory slot sizes, in points. */
export const SLOT = {
  circularDiameter: 72,
  rectangularWidth: 160,
  height: 72,
} as const;
