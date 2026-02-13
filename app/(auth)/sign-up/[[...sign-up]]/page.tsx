"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/auth-store";
import Link from "next/link";

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const params = useSearchParams();
    const redirectTo = params.get("redirectTo") ?? "/";

    const { signUp, signInWithGoogle } = useAuthStore();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!agreeToTerms) {
        setError("You must agree to the Terms and Privacy Policy.");
        return;
        }

        if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
        }

        if (password.length < 6) {
            setError("Passwords must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            await signUp(email, password, name);
            router.push(redirectTo);
        } catch (err: any) {
            setError(err?.message ?? "Failed to create account.");
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignup() {
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
                        Already have an account?{" "}
                        <Link
                            href={`/sign-in${
                            redirectTo
                                ? `?redirectTo=${encodeURIComponent(redirectTo)}`
                                    : ""
                                }`
                            }
                        >
                            Sign in
                        </Link>
                    </FieldDescription>
                </div>

                {error && (
                    <FieldDescription className="mb-4 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-600 rounded-lg text-xs font-medium">
                        {error}
                    </FieldDescription>
                )}

                <Field>
                    <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </Field>

                <Field>
                    <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
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
                    required
                    />
                </Field>

                <Field>
                    <Input
                    id="confirm"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                </Field>

                <Field orientation="horizontal" className="text-xs">
                    <input
                        id="terms"
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="shrink-0 text-primary focus:ring-primary border-foreground/40 rounded-sm accent-primary cursor-pointer"
                    />
                    <label htmlFor="terms" className="flex gap-1">
                        I agree to the
                        <Link href="/terms-and-conditions" className="text-primary font-medium hover:underline">
                            Terms and Conditions
                        </Link>
                    </label>
                </Field>

                <Field>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                    </Button>
                </Field>

                <FieldSeparator>Or</FieldSeparator>

                <Field className="grid gap-4">
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full rounded-full"
                        onClick={handleGoogleSignup}
                        disabled={loading}
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
                </FieldGroup>
            </form>
        </div>
    );
}