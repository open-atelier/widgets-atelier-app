import Fuse from "fuse.js";
import { useMemo } from "react";

import { DESIGNS, type Design } from "./designs";

/**
 * Fuzzy search over the illustrations, so "kitn" or "sparkel" still land.
 *
 * threshold 0.35 was measured rather than guessed: across a set of typo and
 * synonym queries it is the most forgiving value that still returns no
 * unrelated extras and no false positives. 0.4 starts matching both
 * illustrations for queries like "kitty".
 *
 * ignoreLocation stops Fuse favouring matches near the start of a field,
 * which matters because the keywords are unordered.
 */
const fuse = new Fuse(DESIGNS, {
  keys: [
    { name: "name", weight: 3 },
    { name: "keywords", weight: 2 },
    { name: "description", weight: 1 },
    { name: "slug", weight: 1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
});

export function useDesignSearch(query: string): Design[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return DESIGNS;
    return fuse.search(trimmed).map((result) => result.item);
  }, [query]);
}
