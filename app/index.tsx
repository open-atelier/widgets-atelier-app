import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WidgetGallery } from "../components/widget-gallery";

const STEPS = [
  "Press and hold the Lock Screen, then tap Customize.",
  "Tap Lock Screen, then tap the widget area below the clock.",
  "Scroll to Widgets Atelier and pick a design.",
  "Tap Done, then Set as Wallpaper Pair.",
];

function Step({ index, text }: { index: number; text: string }) {
  return (
    <View style={styles.step}>
      <Text style={styles.stepNumber}>{index + 1}</Text>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

export default function Index() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Widgets Atelier</Text>
        <Text style={styles.subtitle}>
          Decorative Lock Screen widgets. There is nothing to do in here — the
          widgets are added from the Lock Screen itself.
        </Text>

        <Text style={styles.sectionHeading}>In the set</Text>
        <WidgetGallery />

        <Text style={styles.sectionHeading}>Adding a widget</Text>
        {STEPS.map((text, i) => (
          <Step key={text} index={i} text={text} />
        ))}

        <View style={styles.notice}>
          <Text style={styles.noticeHeading}>This build expires in 7 days</Text>
          <Text style={styles.noticeText}>
            It is signed with a free Apple ID, so the certificate lasts a week.
            When the app stops opening and the widgets go blank, re-install it
            with AltStore or Sideloadly. AltStore can refresh it automatically
            over Wi-Fi if its companion app is running.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#101014" },
  content: { padding: 24, gap: 16 },
  title: { color: "#fff", fontSize: 34, fontWeight: "700" },
  subtitle: { color: "#9a9aa2", fontSize: 16, lineHeight: 23 },
  sectionHeading: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 12,
  },
  step: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  stepNumber: {
    color: "#101014",
    backgroundColor: "#fff",
    fontSize: 13,
    fontWeight: "700",
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    lineHeight: 24,
    overflow: "hidden",
  },
  stepText: { color: "#e4e4ea", fontSize: 16, lineHeight: 23, flex: 1 },
  notice: {
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#1c1c22",
    gap: 6,
  },
  noticeHeading: { color: "#fff", fontSize: 15, fontWeight: "600" },
  noticeText: { color: "#9a9aa2", fontSize: 14, lineHeight: 20 },
});
