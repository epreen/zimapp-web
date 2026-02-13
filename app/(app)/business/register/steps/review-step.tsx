// app/(app)/business/register/steps/review-step.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useApplicationStore } from "@/lib/store/application-store";

export default function ReviewStep({ onBack }: { onBack: () => void }) {
  const submitApplication = useApplicationStore((s) => s.submitApplication);
  const loading = useApplicationStore((s) => s.loading);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Please review your information before submitting your application.</p>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={async () => { await submitApplication(); }}>
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}