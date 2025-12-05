'use client';

import CreateStoreForm from '@/components/ui/forms/create-store-form';
import { useUser } from '@clerk/nextjs';

export default function Page() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <p>Loading...</p>;

  if (!isSignedIn || !user) {
    return <p>Please sign in to create a store.</p>;
  }

  return <CreateStoreForm userId={user.id} />;
}
