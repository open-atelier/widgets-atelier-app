import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { getPlacedWidgets } from "@/modules/placed-widgets";

/**
 * The set of widget kinds the user has placed, or null while loading and on
 * binaries without the native module. Placing a widget happens outside the
 * app, so this refreshes whenever the app returns to the foreground.
 */
export function usePlacedWidgets(): Set<string> | null {
  const [placed, setPlaced] = useState<Set<string> | null>(null);

  useEffect(() => {
    let alive = true;
    const refresh = () => {
      getPlacedWidgets().then(
        (widgets) => {
          if (alive && widgets) setPlaced(new Set(widgets.map((w) => w.kind)));
        },
        () => {}
      );
    };

    refresh();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  return placed;
}
