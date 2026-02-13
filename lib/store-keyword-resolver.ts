// lib/store-keyword-resolver.ts

import { STORE_KEYWORDS, StoreKeyword } from "./store-keywords";

const ALL_KEYWORDS: StoreKeyword[] = Object.values(STORE_KEYWORDS).flat();

export function resolveStoreMeta(keywords: string[]) {
  const matches = ALL_KEYWORDS.filter((k) =>
    keywords.includes(k.keyword)
  );

  const categories = [...new Set(matches.map((m) => m.category))];
  const types = [...new Set(matches.map((m) => m.type))];

  return {
    categories,
    types,
  };
}