import { Color } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

import { DESIGNS } from "@/components/designs";
import { VariantRow } from "@/components/variant-row";

export default function Gallery() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      {DESIGNS.map((design) => (
        <VariantRow key={design.slug} design={design} />
      ))}
      <Text style={styles.footnote}>
        Shown at actual size. Every illustration is offered both ways in the
        widget picker. On the Lock Screen iOS recolours them to match your
        wallpaper, so they will not look exactly like this.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Color.ios.systemGroupedBackground },
  content: { padding: 16, gap: 16 },
  footnote: {
    color: Color.ios.secondaryLabel,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 4,
  },
});
