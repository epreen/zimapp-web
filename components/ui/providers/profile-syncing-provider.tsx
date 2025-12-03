'use client';

import React, { createContext, useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface ProfileSyncContextValue {
  synced: boolean;
}

const ProfileSyncContext = createContext<ProfileSyncContextValue | undefined>(undefined);

export const ProfileSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const [synced, setSynced] = React.useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      api.syncProfile({
        userId: user.id,
        publicMetadata: user.publicMetadata,
      })
      .then(() => {
        console.log("Profile synced successfully!");
        setSynced(true);
      })
      .catch((err: any) => {
        console.error("Failed to sync profile:", err);
        toast.error("Failed to sync profile with server.");
        setSynced(false);
      });
    }
  }, [isSignedIn, user]);  

  return (
    <ProfileSyncContext.Provider value={{ synced }}>
      {children}
    </ProfileSyncContext.Provider>
  );
};

export const useProfileSync = () => {
  const context = useContext(ProfileSyncContext);
  if (!context) {
    throw new Error("useProfileSync must be used within a ProfileSyncProvider");
  }
  return context;
};
