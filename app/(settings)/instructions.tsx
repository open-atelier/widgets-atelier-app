import { FieldGroup, Host, Icon, List, ListItem, Text } from "@expo/ui";

const STEPS = [
  {
    symbol: "1.circle.fill",
    title: "Press and hold the Lock Screen",
    detail: "Then tap Customize.",
  },
  {
    symbol: "2.circle.fill",
    title: "Tap Lock Screen",
    detail: "Then tap the widget area below the clock.",
  },
  {
    symbol: "3.circle.fill",
    title: "Scroll to Widgets Atelier",
    detail: "Every illustration appears twice, with and without a backing plate.",
  },
  {
    symbol: "4.circle.fill",
    title: "Tap Done",
    detail: "Then Set as Wallpaper Pair.",
  },
] as const;

export default function Instructions() {
  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section>
          <FieldGroup.SectionHeader>
            <Text>Adding a widget</Text>
          </FieldGroup.SectionHeader>
          <List>
            {STEPS.map((step) => (
              <ListItem
                key={step.symbol}
                leading={<Icon name={step.symbol} size={24} />}
                supportingText={step.detail}
              >
                {step.title}
              </ListItem>
            ))}
          </List>
          <FieldGroup.SectionFooter>
            <Text>
              Widgets are added from the Lock Screen itself, not from this app.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
