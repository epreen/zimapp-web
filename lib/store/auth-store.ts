import { create } from "zustand";
import { toast } from "sonner";
import {
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

/* =========================
   Types
========================= */

interface AuthState {
  user: User | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<UserCredential>;

  signInWithGoogle: () => Promise<UserCredential>;

  sendEmailLink: (email: string) => Promise<void>;
  completeEmailLinkSignIn: (email: string) => Promise<UserCredential>;

  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;

  initializeAuth: () => () => void;
}

/* =========================
   Helpers
========================= */

async function syncUserToSanityAPI(user: User): Promise<void> {
  try {
    const idToken = await user.getIdToken();

    const response = await fetch("/api/auth/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Failed to sync user to Sanity:", error);
    }
  } catch (error) {
    console.error("❌ Error syncing user to Sanity:", error);
  }
}

/* =========================
   Store
========================= */

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  /* ---------- Sign In ---------- */
  signIn: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully signed in");
      return result;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  },

  /* ---------- Sign Up ---------- */
  signUp: async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      toast.success("Account created successfully");
      return result;
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  },

  /* ---------- Google ---------- */
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    }
  },

  /* ---------- Email Link ---------- */
  sendEmailLink: async (email) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/sign-in/email-link`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", email);

      toast.success("Sign-in link sent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to send sign-in link");
      throw error;
    }
  },

  completeEmailLinkSignIn: async (email) => {
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        throw new Error("Invalid sign-in link");
      }

      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );

      localStorage.removeItem("emailForSignIn");
      toast.success("Successfully signed in");

      return result;
    } catch (error: any) {
      toast.error(error.message || "Failed to complete sign-in");
      throw error;
    }
  },

  /* ---------- Password Reset ---------- */
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
      throw error;
    }
  },

  /* ---------- Logout ---------- */
  logout: async () => {
    try {
    //   const { default: useCartStore } = await import("@/store");
    //   await useCartStore.getState().flushPendingSync();

      await signOut(auth);

      localStorage.clear();
      sessionStorage.clear();

      toast.success("Successfully signed out");
      window.location.href = "/";
    } catch (error: any) {
      console.error("❌ Logout error:", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  },

  /* ---------- Init ---------- */
  initializeAuth: () => {
    let tokenRefreshInterval: NodeJS.Timeout | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      set({ user });

      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
        tokenRefreshInterval = null;
      }

      if (user) {
        try {
          const token = await user.getIdToken(true);

          const res = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (!res.ok) {
            console.error("❌ Failed to set session cookie");
            set({ loading: false });
            return;
          }

          tokenRefreshInterval = setInterval(async () => {
            try {
              const currentUser = auth.currentUser;
              if (!currentUser) return;

              const freshToken = await currentUser.getIdToken(true);
              await fetch("/api/auth/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: freshToken }),
              });
            } catch (err) {
              console.error("❌ Token refresh failed:", err);
            }
          }, 50 * 60 * 1000);

          await syncUserToSanityAPI(user);
        } finally {
          set({ loading: false });
        }
      } else {
        await fetch("/api/auth/session", { method: "DELETE" });
        set({ loading: false });
      }
    });

    return () => {
      if (tokenRefreshInterval) clearInterval(tokenRefreshInterval);
      unsubscribe();
    };
  },
}));