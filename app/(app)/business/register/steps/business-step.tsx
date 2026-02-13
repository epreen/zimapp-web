// app/(app)/business/register/steps/business-step.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessStepSchema, type BusinessStepValues } from "@/lib/schemas";
import { useApplicationStore } from "@/lib/store/application-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BusinessStep({ onNext }: { onNext: () => void }) {
  const draft = useApplicationStore((s) => s.draft);
  const setBusiness = useApplicationStore((s) => s.setBusiness);
  const saveDraft = useApplicationStore((s) => s.saveDraft);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<BusinessStepValues>({
    resolver: zodResolver(businessStepSchema),
    defaultValues: draft.business ?? {
      businessName: "",
      businessDescription: "",
      businessType: "",
      businessAddress: "",
    },
  });

  // If store updates externally, populate (optional)
  React.useEffect(() => {
    if (draft.business) {
      Object.entries(draft.business).forEach(([k, v]) => setValue(k as any, v));
    }
  }, [draft.business, setValue]);

  const onSubmit = async (data: BusinessStepValues) => {
    setBusiness(data);
    await saveDraft({ persistToSanity: true });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Business Name" {...register("businessName")} />
      {errors.businessName && <p className="text-sm text-red-500">{errors.businessName.message}</p>}

      <Select
        value={draft.business?.businessType ?? ""}
        onValueChange={(val) => setValue("businessType", val)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Business Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="individual">Individual / Sole Proprietor</SelectItem>
          <SelectItem value="informal">Informal</SelectItem>
          <SelectItem value="partnership">Partnership</SelectItem>
          <SelectItem value="llc">LLC</SelectItem>
          <SelectItem value="corporation">Corporation</SelectItem>
          <SelectItem value="cooperative">Cooperative</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      {errors.businessType && <p className="text-sm text-red-500">{errors.businessType.message}</p>}

      <Textarea placeholder="Business Description" {...register("businessDescription")} />
      <Textarea placeholder="Business Address" {...register("businessAddress")} />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Continue
        </Button>
      </div>
    </form>
  );
}