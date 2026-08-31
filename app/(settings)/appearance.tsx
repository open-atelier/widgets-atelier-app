import { FieldGroup, Host, Picker, Text } from "@expo/ui";

import { THEME_OPTIONS, useTheme, type ThemePreference } from "@/components/theme";

export default function Appearance() {
  const { preference, setPreference } = useTheme();

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section>
          <FieldGroup.SectionHeader>
            <Text>Appearance</Text>
          </FieldGroup.SectionHeader>
          <Picker
            selectedValue={preference}
            onValueChange={(value) => setPreference(value as ThemePreference)}
          >
            {THEME_OPTIONS.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
          <FieldGroup.SectionFooter>
            <Text>
              System follows your device setting. This affects the app only —
              Lock Screen widgets are always drawn by iOS to match your
              wallpaper.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
