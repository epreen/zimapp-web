"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContactStepValues } from "@/lib/schemas";
import { contactStepSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApplicationStore } from "@/lib/store/application-store";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function ContactStep({ onNext, onBack }: Props) {
  const draft = useApplicationStore((s) => s.draft);
  const setContact = useApplicationStore((s) => s.setContact);
  const saveDraft = useApplicationStore((s) => s.saveDraft);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactStepValues>({
    resolver: zodResolver(contactStepSchema),
    mode: "onChange",
    defaultValues: draft.contact ?? {
      businessEmail: "",
      businessPhone: "",
      businessTax: "",
      businessWebsite: "",
    },
  });

  const onSubmit = async (data: ContactStepValues) => {
    setContact(data);
    await saveDraft({ persistToSanity: true });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Email" {...register("businessEmail")} />
        {errors.businessEmail && (
          <p className="text-sm text-red-500">{errors.businessEmail.message}</p>
        )}
      </div>

      <div>
        <Input placeholder="Phone" {...register("businessPhone")} />
        {errors.businessPhone && (
          <p className="text-sm text-red-500">{errors.businessPhone.message}</p>
        )}
      </div>

      <div>
        <Input placeholder="Tax ID" {...register("businessTax")} />
        {errors.businessTax && (
          <p className="text-sm text-red-500">{errors.businessTax.message}</p>
        )}
      </div>

      <div>
        <Input placeholder="Business Website URL" {...register("businessWebsite")} />
        {errors.businessWebsite && (
          <p className="text-sm text-red-500">{errors.businessWebsite.message}</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}