import { FieldGroup, Host, Icon, List, ListItem, Text } from "@expo/ui";

import { usePlacedWidgets } from "@/components/use-placed-widgets";

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
  const placed = usePlacedWidgets();
  const count = placed?.size ?? 0;
  const footer =
    count === 0
      ? "Widgets are added from the Lock Screen itself, not from this app."
      : count === 1
        ? "You have 1 widget on your Lock Screen. Repeat the steps to add more."
        : `You have ${count} widgets on your Lock Screen. Repeat the steps to add more.`;

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
            <Text>{footer}</Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
