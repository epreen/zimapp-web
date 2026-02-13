"use client";

import { useIsChatOpen } from "@/components/providers/chat-store-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const isChatOpen = useIsChatOpen();

  return (
    <div
      className={`min-h-screen transition-all duration-300 ease-in-out ${
        isChatOpen ? "xl:mr-[448px] max-xl:overflow-hidden max-xl:h-screen" : ""
      }`}
    >
      {children}
    </div>
  );
}