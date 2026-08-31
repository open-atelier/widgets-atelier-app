import { Stack } from "expo-router/stack";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="appearance" options={{ title: "Theme", headerLargeTitle: false }} />
      <Stack.Screen name="instructions" options={{ title: "Instructions", headerLargeTitle: false }} />
    </Stack>
  );
}
