import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "widgets-atelier:theme";

export const THEME_OPTIONS: { value: ThemePreference; label: string; symbol: string }[] = [
  { value: "system", label: "System", symbol: "iphone" },
  { value: "light", label: "Light", symbol: "sun.max" },
  { value: "dark", label: "Dark", symbol: "moon" },
];

type ThemeContextValue = {
  /** What the user picked. */
  preference: ThemePreference;
  /** What that resolves to right now, after applying the system setting. */
  scheme: "light" | "dark";
  setPreference: (next: ThemePreference) => void;
  /** False until the stored preference has been read back. */
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setPreferenceState(stored);
        }
      })
      .catch(() => {
        // A unreadable preference is not worth failing the app over; the
        // default is "system", which is already what state holds.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    // Apply immediately, persist in the background. The write is not worth
    // blocking the UI on, and losing it only costs the next launch.
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      scheme: preference === "system" ? (system === "dark" ? "dark" : "light") : preference,
      setPreference,
      ready,
    }),
    [preference, system, setPreference, ready]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
