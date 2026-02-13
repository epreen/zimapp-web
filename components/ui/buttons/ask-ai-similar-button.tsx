"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatActions } from "@/components/providers/chat-store-provider";

interface AskAISimilarButtonProps {
  productName: string;
}

export function AskAISimilarButton({ productName }: AskAISimilarButtonProps) {
  const { openChatWithMessage } = useChatActions();

  const handleClick = () => {
    openChatWithMessage(`Show me products similar to "${productName}"`);
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full gap-2 bg-linear-to-r from-secondary to-background text-foreground hover:from-background hover:to-secondary dark:from-background dark:to-secondary dark:hover:from-secondary dark:hover:to-background animated"
    >
      <Sparkles className="h-4 w-4" />
      Ask for similar products
    </Button>
  );
}