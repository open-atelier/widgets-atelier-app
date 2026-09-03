import { SymbolView } from "expo-symbols";
import { Color } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useDesignSearch } from "@/components/use-design-search";
import { useHeaderSearch } from "@/components/use-header-search";
import { usePlacedWidgets } from "@/components/use-placed-widgets";
import { VariantRow } from "@/components/variant-row";

function NoResults({ query }: { query: string }) {
  return (
    <View style={styles.empty}>
      <SymbolView
        name="magnifyingglass"
        size={48}
        tintColor={Color.ios.tertiaryLabel}
      />
      <Text style={styles.emptyTitle}>No Illustrations</Text>
      <Text style={styles.emptyBody}>
        Nothing matches “{query}”.
      </Text>
    </View>
  );
}

export default function Gallery() {
  const query = useHeaderSearch("Search illustrations");
  const designs = useDesignSearch(query);
  const placedKinds = usePlacedWidgets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
    >
      {designs.length === 0 ? (
        <NoResults query={query.trim()} />
      ) : (
        <>
          {designs.map((design) => (
            <VariantRow
              key={design.slug}
              design={design}
              placedKinds={placedKinds}
            />
          ))}
          <Text style={styles.footnote}>
            Shown at actual size. Every illustration is offered both ways in the
            widget picker. On the Lock Screen iOS recolours them to match your
            wallpaper, so they will not look exactly like this.
          </Text>
        </>
      )}
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
  empty: { alignItems: "center", gap: 8, paddingTop: 72 },
  emptyTitle: { color: Color.ios.label, fontSize: 20, fontWeight: "600" },
  emptyBody: { color: Color.ios.secondaryLabel, fontSize: 15 },
});
