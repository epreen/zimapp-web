'use client';

import React, { createContext, useContext, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface ProfileSyncContextValue {
  synced: boolean;
  forceSync: () => Promise<void>;   // <-- NEW: manual syncing hook
}

const ProfileSyncContext = createContext<ProfileSyncContextValue | undefined>(undefined);

export const ProfileSyncProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user } = useUser();
  const syncProfile = useMutation(api.syncing.syncProfile);

  const [synced, setSynced] = React.useState(false);

  // Exposed function to sync anytime user performs an action
  const forceSync = useCallback(async () => {
    if (!user || !isSignedIn) return;

    try {
      await syncProfile({
        userId: user.id,
      });
      setSynced(true);
    } catch (err) {
      console.error("Profile sync failed:", err);
      toast.error("Could not sync profile.");
      setSynced(false);
    }
  }, [user, isSignedIn, syncProfile]);


  // Automatically sync on login + user changes
  useEffect(() => {
    if (isSignedIn && user) {
      forceSync();
    }
  }, [isSignedIn, user, forceSync]);  // sync when Clerk updates user data

  return (
    <ProfileSyncContext.Provider value={{ synced, forceSync }}>
      {children}
    </ProfileSyncContext.Provider>
  );
};

export const useProfileSync = () => {
  const context = useContext(ProfileSyncContext);
  if (!context) {
    throw new Error("useProfileSync must be used within ProfileSyncProvider");
  }
  return context;
};