"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";

export default function EmailLinkSignInPage() {
  const router = useRouter();
  const { completeEmailLinkSignIn } = useAuthStore();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("emailForSignIn");

    if (storedEmail) {
      finishSignIn(storedEmail);
    } else {
      // User opened link on another device
      setLoading(false);
    }
  }, []);

  const finishSignIn = async (email: string) => {
    try {
      await completeEmailLinkSignIn(email);
      router.push("/");
    } catch (err: any) {
      setError(err?.message ?? "Failed to complete sign-in.");
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    await finishSignIn(email);
  };

  if (loading) {
    return <p className="text-center mt-10">Signing you in…</p>;
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold text-center">
        Confirm your email
      </h1>

      <p className="text-sm text-muted-foreground text-center">
        Enter the email you used to request the sign-in link.
      </p>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <input
        type="email"
        placeholder="you@example.com"
        className="w-full border rounded-md p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button className="w-full" onClick={handleManualSubmit}>
        Complete sign in
      </Button>
    </div>
  );
}