import { writer } from "@/sanity/lib/client";
import debounce from "lodash.debounce";

export const autosave = debounce(
  async (documentId: string, data: Record<string, any>) => {
    await writer
      .patch(documentId.replace("drafts.", ""))
      .set(data)
      .commit();
  },
  800
);