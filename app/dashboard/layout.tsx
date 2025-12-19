"use client";

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
        <main className="min-h-screen flex items-center justify-center bg-background">
            <div>
                <h1 className="text-3xl font-semibold text-center text-foreground/80 mb-6"><span className="text-primary dark:text-secondary">zim</span><span className="text-foreground">app</span><span className="text-primary dark:text-secondary">.</span></h1>
                {children}
            </div>
        </main>
    </>
  );
}
