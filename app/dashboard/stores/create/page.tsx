'use client';

import CreateStoreForm from '@/components/ui/forms/create-store-form';
import { useAuthStore } from '@/lib/store/auth-store';

export default function Page() {
  const { user, loading } = useAuthStore();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <p>Please sign in to create a store.</p>;
  }

  return <CreateStoreForm userId={user.uid} />;
}
