import { Color } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

import { SLOT, type Design } from "./designs";

/**
 * One illustration, showing both widget variants side by side: plain, where
 * the artwork itself becomes the vibrant material, and plated, with
 * AccessoryWidgetBackground() behind it.
 *
 * Rendered with React Native rather than @expo/ui because @expo/ui has no
 * Image component, and this needs exact accessory geometry. The chrome uses
 * iOS semantic colours so it still tracks the system appearance.
 */
function Slot({ design, plate }: { design: Design; plate: boolean }) {
  const isCircular = design.family === "circular";
  const width = isCircular ? SLOT.circularDiameter : SLOT.rectangularWidth;

  return (
    <View style={styles.slot}>
      <View
        style={[
          styles.canvas,
          {
            width,
            height: SLOT.height,
            borderRadius: isCircular ? SLOT.circularDiameter / 2 : 16,
            // AccessoryWidgetBackground() is a translucent blurred plate.
            // There is no React Native equivalent, so this approximates it.
            backgroundColor: plate ? "rgba(120,120,128,0.36)" : "transparent",
          },
        ]}
      >
        <Image
          source={design.image}
          style={[styles.art, { margin: design.padding }]}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.variantLabel}>{plate ? "Plate" : "Plain"}</Text>
    </View>
  );
}

export function VariantRow({ design }: { design: Design }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{design.name}</Text>
        <Text style={styles.subtitle}>{design.description}</Text>
      </View>
      {/* Stands in for a Lock Screen wallpaper. The artwork is white, matching
          the vibrant material it becomes on device, so it needs a dark surface
          behind it to be visible at all -- including in light mode. */}
      <View style={styles.wallpaper}>
        <Slot design={design} plate={false} />
        <Slot design={design} plate />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.ios.secondarySystemGroupedBackground,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 16,
  },
  header: { gap: 3 },
  title: { color: Color.ios.label, fontSize: 17, fontWeight: "600" },
  subtitle: { color: Color.ios.secondaryLabel, fontSize: 14 },
  wallpaper: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#26262e",
    borderRadius: 14,
    paddingVertical: 18,
  },
  slot: { alignItems: "center", gap: 8 },
  canvas: { overflow: "hidden" },
  art: { flex: 1, width: undefined, height: undefined },
  variantLabel: { color: "rgba(235,235,245,0.6)", fontSize: 12 },
});
