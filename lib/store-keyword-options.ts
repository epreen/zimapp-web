// lib/store-keyword-options.ts

import { STORE_KEYWORDS } from "./store-keywords";

export const STORE_KEYWORD_OPTIONS = Object.values(STORE_KEYWORDS)
  .flat()
  .map((k) => ({
    title: `${k.keyword} — ${k.description}`,
    value: k.keyword,
}));