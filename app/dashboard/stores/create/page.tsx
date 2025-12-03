'use client';

import CreateStoreForm from '@/components/ui/forms/create-store-form';
import { useUser } from '@clerk/nextjs';

export default function Page() {
  const { user } = useUser();

  if (!user) return <p>Loading...</p>;

  return <CreateStoreForm userId={user.id} />;
}
