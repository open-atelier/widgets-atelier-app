import { Stack } from "expo-router/stack";

export default function GalleryLayout() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="index" options={{ title: "Illustrations" }} />
    </Stack>
  );
}
