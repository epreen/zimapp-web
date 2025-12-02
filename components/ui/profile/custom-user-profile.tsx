"use client";

import { UserProfile } from "@clerk/nextjs";
import { ManageStoresInline } from "@/components/ui/modals/manage-stores-modal";

export default function CustomUserProfile() {
  return (
    <UserProfile>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Stores</h2>
        <ManageStoresInline />
      </div>
    </UserProfile>
  );
}