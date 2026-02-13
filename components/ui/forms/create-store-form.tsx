"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeTypeSchema } from "@/schemas/zod-schemas";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CreateStoreFormProps {
  userId: string;
}

export function CreateStoreForm({ userId }: CreateStoreFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(storeTypeSchema),
  });

  async function onSubmit(data: any) {
    try {
      const res = await fetch("/api/stores/create", {
        method: "POST",
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error("Failed to create store");

      toast.success("Your store is now live.");
    } catch (err) {
      toast.error("Failed to create store");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Store Name</Label>
        <Input id="name" {...register("name")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register("username")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} rows={4} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Contact Email</Label>
        <Input id="email" type="email" {...register("email")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact">Phone / Contact</Label>
        <Input id="contact" {...register("contact")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Store"}
      </Button>
    </form>
  );
}