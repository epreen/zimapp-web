// app/business/register/page.tsx remains server-side for auth checks (keep your existing server flow)

"use client";

import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Store } from "lucide-react";
import { useApplicationStore } from "@/lib/store/application-store";
import BusinessStep from "./steps/business-step";
import ContactStep from "./steps/contact-step";
import ProductStep from "./steps/product-step";
import ReviewStep from "./steps/review-step";

const steps = [
  { id: 1, title: "Business Information" },
  { id: 2, title: "Contact Information" },
  { id: 3, title: "Product Information" },
  { id: 4, title: "Review & Submit" },
];

export function BusinessWizard() {
  const step = useApplicationStore((s) => s.step);
  const setStep = useApplicationStore((s) => s.setStep);
  const documentId = useApplicationStore((s) => s.documentId);
  const createRemoteDraft = useApplicationStore((s) => s.createRemoteDraft);

  useEffect(() => {
    if (!documentId) createRemoteDraft().catch(console.error);
  }, [documentId, createRemoteDraft]);

  if (!documentId) return null; // or a loader

  return (
    <div className="mx-auto max-w-3xl space-y-6 mt-10 p-4">
      <div className="flex items-center justify-start gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Store className="h-10 w-10 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold tracking-tight text-2xl mt-2 mb-1">Business ZIMAPP Business Owner</h3>
          <p className="text-sm font-medium text-foreground/60">Join our marketplace and start selling your products</p>
        </div>
      </div>

      <Progress value={(step / steps.length) * 100} />

      {step === 1 && <BusinessStep onNext={() => setStep(2)} />}
      {step === 2 && <ContactStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <ProductStep onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <ReviewStep onBack={() => setStep(3)} />}
    </div>
  );
}