"use client";

import { GalleryVerticalEnd, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import { useState } from "react"
import Link from "next/link";

export default function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/";

  const { signIn, signInWithGoogle, sendEmailLink } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError("");

      try {
          setLoading(true);

          await signIn(email, password);
          router.push(redirectTo);
      } catch (err: any) {
          setError(err?.message ?? "Failed to create account.");
      } finally {
          setLoading(false);
      }
  }

  const handleEmailLinkSignIn = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
  
    try {
      setLoading(true);
      await sendEmailLink(email);
      setEmailLinkSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Failed to send sign-in link.");
    } finally {
      setLoading(false);
    }
  };  

  async function handleGoogleSigning() {
      try {
          setLoading(true);
          await signInWithGoogle();
          router.push(redirectTo);
      } catch (err: any) {
          setError(err?.message ?? "Google sign-in failed.");
      } finally {
          setLoading(false);
      }
  }      
  
  return (
    <div className={cn("flex flex-col gap-6 max-w-sm mx-auto p-6 md:p-10", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-start gap-2 text-center">
            <a
              href="/"
              className="flex text-primary items-end gap-1 font-light text-xl mb-4"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="text-2xl">
                  zim<span className="text-foreground font-bold">app</span>
                  <span className="text-primary text-4xl font-bold">.</span>
              </span>
            </a>
            <h1 className="text-xl font-bold">Create Account</h1>
              <FieldDescription className="text-xs">
                  Don&apos;t have an account?{" "}
                  <Link
                      href={`/sign-up${
                      redirectTo
                          ? `?redirectTo=${encodeURIComponent(redirectTo)}`
                              : ""
                          }`
                      }
                  >
                    Register
                  </Link>
              </FieldDescription>
          </div>

          {error && (
            <FieldDescription className="mb-4 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-600 rounded-lg text-xs font-medium">
              {error}
            </FieldDescription>
          )}

          {emailLinkSent && (
            <FieldDescription className="mb-4 p-4 bg-green-500/10 border-l-4 border-green-500 text-green-600 rounded-lg text-xs font-medium">
              Check your email for the sign-in link.
            </FieldDescription>
          )}

          <Field>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={emailLinkSent}
              required
            />
          </Field>

          <Field>
            <Button type="submit">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </Field>

          <div className="flex justify-between items-center">
            <Field orientation="horizontal" className="text-xs">
                <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="shrink-0 text-primary focus:ring-primary border-foreground/40 rounded-sm accent-primary cursor-pointer"
                />
                <label htmlFor="terms" className="flex">
                    Remember me
                </label>
            </Field>
            <Link href="/forgot-password" className="text-primary text-right text-xs font-medium max-w-fit w-full">
              Forgot Password?
            </Link>
          </div>

          <FieldSeparator>Or</FieldSeparator>
          
          <Field className="grid gap-4">
            <Button
              variant="outline"
              type="button"
              className="w-full rounded-full"
              onClick={handleGoogleSigning}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </Field>

          <Field className="grid gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleEmailLinkSignIn}
              disabled={loading}
              className="w-full rounded-full border border-foreground/20"
            >
              <Mail className="mr-2 size-4" />
              Send sign-in link
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              We’ll email you a secure sign-in link. No password needed.
            </p>
          </Field>

        </FieldGroup>
      </form>
    </div>
  )
}