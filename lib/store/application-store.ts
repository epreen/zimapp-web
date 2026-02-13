// lib/store/application-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { writer } from "@/sanity/lib/client";
import { BusinessStepValues, ContactStepValues, ProductStepValues } from "../schemas";

type Draft = {
  business?: BusinessStepValues;
  contact?: ContactStepValues;
  product?: ProductStepValues;
  status?: string;
  appliedAt?: string;
};

type AppStore = {
  documentId: string | null;
  step: number;
  draft: Draft;
  loading: boolean;

  // mutators
  setDocumentId: (id: string) => void;
  setStep: (step: number) => void;
  setBusiness: (data: BusinessStepValues) => void;
  setContact: (data: ContactStepValues) => void;
  setProduct: (data: ProductStepValues) => void;
  saveDraft: (opts?: { persistToSanity?: boolean }) => Promise<void>;
  submitApplication: () => Promise<void>;
  createRemoteDraft: () => Promise<void>; // calls your API to create doc and returns id
  reset: () => void;
};

export const useApplicationStore = create<AppStore>()(
  persist(
    (set, get) => ({
      documentId: null,
      step: 1,
      draft: {},
      loading: false,

      setDocumentId: (id) => set({ documentId: id }),
      setStep: (step) => set({ step }),

      setBusiness: (data) => set((s) => ({ draft: { ...s.draft, business: data } })),
      setContact: (data) => set((s) => ({ draft: { ...s.draft, contact: data } })),
      setProduct: (data) => set((s) => ({ draft: { ...s.draft, product: data } })),

      saveDraft: async ({ persistToSanity = true } = {}) => {
        const { documentId, draft } = get();
        if (!documentId) return;
        try {
          set({ loading: true });
          await writer.patch(documentId).set(draft).commit();
          if (persistToSanity) {
            // optionally you can add extra behavior here
          }
        } catch (err) {
          console.error("Failed to save draft:", err);
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      submitApplication: async () => {
        const { documentId, draft, setStep } = get();
        if (!documentId) throw new Error("No documentId");
        try {
          set({ loading: true });
          await writer
            .patch(documentId)
            .set({
              ...draft,
              status: "pending",
              appliedAt: new Date().toISOString(),
            })
            .commit();
          set({ step: 4 }); // move to review/confirmation
        } catch (err) {
          console.error("Submit failed:", err);
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      createRemoteDraft: async () => {
        // Call your backend API that creates an empty Sanity doc and returns the document id
        // This keeps the wizard component simpler.
        try {
            set({ loading: true });
            const res = await fetch("/api/business-application", {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) {
                const text = await res.text();
                console.error("Create application failed:", res.status, text);
                throw new Error("Failed to create application");
            }
                          
            const body = await res.json();
            set({ documentId: body.documentId });
            return body.documentId;
        } finally {
            set({ loading: false });
        }
      },

      reset: () => set({ documentId: null, step: 1, draft: {}, loading: false }),
    }),
    {
      name: "application-store", // localStorage key
      // serialize: (state) => ... // default is fine
    }
  )
);