import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";

/**
 * Wires the native header search bar (UISearchController on iOS) and returns
 * the current query.
 *
 * The options are spread into a stable object rather than taken as a prop so
 * an inline literal cannot retrigger the effect on every render.
 */
export function useHeaderSearch(placeholder: string) {
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder,
        autoCapitalize: "none",
        hideWhenScrolling: true,
        onChangeText: (event: { nativeEvent: { text: string } }) =>
          setQuery(event.nativeEvent.text),
        onCancelButtonPress: () => setQuery(""),
      },
    });
  }, [navigation, placeholder]);

  return query;
}
