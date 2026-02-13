"use client";

import { FormEvent, useState } from "react";
import { Input } from "../input";
import { Button } from "../button";
import { AlertCircle, CheckCircle2, InfoIcon, Loader2 } from "lucide-react";

const NewsletterForm = () => {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: "success" | "error" | "info";
        text: string;
    } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!email.trim()) {
            setMessage({
                type: "error",
                text: "Please enter your email address",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage({
                type: "error",
                text: "Please enter a valid email address",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });

            const data = response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: data.message || "Thank you for subscribing! Check your email for a welcome message.",
                });
                setEmail("");
            } else if (data.alreadySubscribed) {
                setMessage({
                    type: "info",
                    text: data.error || "You're already a subscriber to our newsletter! Check your inbox for our latest updates."
                });
            } else {
                setMessage({
                    type: "error",
                    text: data.error || "Failed to subscribe. Please try again."
                });
            }
        } catch (error) {
            console.error("Newsletter subscription error: ", error)
            setMessage({
                type: "error",
                text: "Something went wrong. Please try again later."
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Subscribing
                        </>
                    ) : (
                        "Subscribe"
                    )}
                </Button>
            </form>
            {message && (
                <div
                    className={`p-3 rounded-lg text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
                        message.type === "success"
                            ? "bg-green-600/10 text-green-600 border border-green-600/30"
                        : message.type === "info"
                            ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30"
                        :
                            "bg-red-500/10 text-red-500 border border-red-500/30"
                    }`}
                >
                    {message.type === "success" && (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    )}
                    {message.type === "error" && (
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    )}
                    {message.type === "info" && (
                        <InfoIcon className="w-4 h-4 mt-0.5 shrink-0" />
                    )}
                    <span className="flex-1">{message.text}</span>
                </div>
            )}
        </div>
    )
}

export default NewsletterForm