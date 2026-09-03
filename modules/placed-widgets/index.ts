import { requireOptionalNativeModule } from "expo-modules-core";

export type PlacedWidget = {
  /** The widget's `kind`, matching the designs in targets/widgets/Designs/. */
  kind: string;
  family: string;
};

type PlacedWidgetsModule = {
  getPlacedWidgets(): Promise<PlacedWidget[]>;
};

// Optional so a binary built before this module existed degrades to "unknown"
// instead of throwing at import time.
const native = requireOptionalNativeModule<PlacedWidgetsModule>("PlacedWidgets");

/**
 * Which of our widgets the user has actually placed, via
 * WidgetCenter.getCurrentConfigurations. Resolves to null when the native
 * module is unavailable (a stale dev client build).
 */
export async function getPlacedWidgets(): Promise<PlacedWidget[] | null> {
  if (!native) return null;
  return native.getPlacedWidgets();
}
