import { Image, StyleSheet, Text, View } from "react-native";

// Real accessory slot sizes, in points.
const CIRCULAR = 72;
const RECTANGULAR_WIDTH = 160;
const SLOT_HEIGHT = 72;

/**
 * The app cannot render the real widgets. WidgetKit views are compiled into
 * the widget extension, a separate binary, and there is no public API to draw
 * another target's widget inside your app. So this draws the same source
 * artwork at real accessory sizes instead.
 *
 * It approximates the geometry, not the appearance: iOS renders accessory
 * widgets in a vibrant mode that discards colour and recomposites them against
 * the wallpaper. Treat this as "what is in the set", not as a way to check
 * whether a design reads.
 *
 * One row per artwork, not per widget: each design ships twice in the picker,
 * plain and with the backing plate, and showing both here would just be the
 * same illustration twice. The plate column below is therefore only "how we
 * chose to show it", not a property of the design.
 *
 * Nothing keeps this table in step with targets/widgets/Designs/ -- see
 * docs/adding-an-illustration.md, "Keeping the app gallery in step".
 */
type Design = {
  name: string;
  image: number;
  /** Annotated rather than inferred so the union stays open while every
   *  design happens to be circular. */
  family: "circular" | "rectangular";
  padding: number;
  plate: boolean;
};

const DESIGNS: Design[] = [
  {
    name: "Cat",
    image: require("../assets/previews/cat.png"),
    family: "circular",
    padding: 4,
    plate: true,
  },
  {
    name: "Sparkle",
    image: require("../assets/previews/sparkle.png"),
    family: "circular",
    padding: 10,
    plate: false,
  },
];

function Slot({ design }: { design: Design }) {
  const isCircular = design.family === "circular";
  const width = isCircular ? CIRCULAR : RECTANGULAR_WIDTH;

  return (
    <View style={styles.slot}>
      <View
        style={[
          styles.canvas,
          styles.center,
          {
            width,
            height: SLOT_HEIGHT,
            borderRadius: isCircular ? CIRCULAR / 2 : 16,
            // AccessoryWidgetBackground() is a translucent blurred plate. There
            // is no RN equivalent, so this approximates it with a flat fill.
            backgroundColor: design.plate
              ? "rgba(255,255,255,0.22)"
              : "transparent",
          },
        ]}
      >
        <Image
          source={design.image}
          // Explicit dimensions rather than flex: the parent is a fixed-size
          // slot, so there is nothing to resolve and no ambiguity about how
          // an intrinsically-sized Image lays out inside it.
          style={{
            width: width - design.padding * 2,
            height: SLOT_HEIGHT - design.padding * 2,
          }}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.label}>{design.name}</Text>
    </View>
  );
}

export function WidgetGallery() {
  const rectangular = DESIGNS.filter((d) => d.family === "rectangular");
  const circular = DESIGNS.filter((d) => d.family === "circular");

  return (
    <View style={styles.root}>
      <View style={styles.wallpaper}>
        {rectangular.map((design) => (
          <Slot key={design.name} design={design} />
        ))}
        <View style={styles.row}>
          {circular.map((design) => (
            <Slot key={design.name} design={design} />
          ))}
        </View>
      </View>
      <Text style={styles.caption}>
        Shown at actual size. Each design comes in two versions in the picker,
        with and without the backing plate. On the Lock Screen iOS recolours
        them to match your wallpaper, so they will not look exactly like this.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 10 },
  wallpaper: {
    backgroundColor: "#26262e",
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: "center",
    gap: 22,
  },
  row: { flexDirection: "row", gap: 16 },
  slot: { alignItems: "center", gap: 8 },
  canvas: { overflow: "hidden" },
  center: { alignItems: "center", justifyContent: "center" },
  label: { color: "#9a9aa2", fontSize: 12 },
  caption: { color: "#71717a", fontSize: 13, lineHeight: 18 },
});
