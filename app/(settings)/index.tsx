import { Host, Icon, List, ListItem, Text } from "@expo/ui";
import { useRouter } from "expo-router";
import { ReactNativeLegal } from "react-native-legal";

import { THEME_OPTIONS, useTheme } from "@/components/theme";

export default function Settings() {
  const router = useRouter();
  const { preference } = useTheme();
  const themeLabel = THEME_OPTIONS.find((o) => o.value === preference)?.label ?? "System";

  return (
    <Host style={{ flex: 1 }}>
      <List>
        <ListItem
          onPress={() => router.push("/appearance")}
          leading={<Icon name="paintpalette" size={22} />}
          trailing={<Text>{themeLabel}</Text>}
        >
          Theme
        </ListItem>
        <ListItem
          onPress={() => router.push("/instructions")}
          leading={<Icon name="lock.iphone" size={22} />}
        >
          Instructions
        </ListItem>
        <ListItem
          // Opens the license list iOS renders itself, generated at build time
          // by react-native-legal from the dependency tree.
          onPress={() => ReactNativeLegal.launchLicenseListScreen("Open Source Libraries")}
          leading={<Icon name="doc.text" size={22} />}
        >
          Open Source Libraries
        </ListItem>
      </List>
    </Host>
  );
}
