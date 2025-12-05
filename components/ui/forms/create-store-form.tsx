'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createStore } from '@/app/actions/store-actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

interface FormValues {
  name: string;
  description: string;
  category: string;
  logoFile?: FileList;
}

interface CreateStoreFormProps {
  userId: string;
}

export default function CreateStoreForm({ userId }: CreateStoreFormProps) {
  const form = useForm<FormValues>(); // <-- ShadCN form methods
  const { control, handleSubmit, watch } = form;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const logoFile = watch('logoFile')?.[0];

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (logoFile) {
      const url = URL.createObjectURL(logoFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [logoFile])

  const onSubmit = async (data: FormValues) => {
    if (!data.name || !data.description || !data.category) {
      toast.error('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createStore(
        userId,
        data.name,
        data.description,
        data.category,
        data.logoFile?.[0]
      );
      toast.success('Store created successfully!');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create store.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="My Awesome Store" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe your store..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          name="category"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Electronics, Apparel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          name="logoFile"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              {logoFile && (
                <div className="mt-2">
                  <img
                    src={previewUrl!}
                    alt="Logo Preview"
                    className="h-24 w-24 object-contain rounded-md border"
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Store'}
        </Button>
      </form>
    </Form>
  );
}