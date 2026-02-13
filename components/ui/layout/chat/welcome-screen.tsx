import { Sparkles, Package, Search } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (message: { text: string }) => void;
  isSignedIn: boolean;
}

const productSuggestions = [
  "Show me oak tables",
  "Leather sofas under MWK10000",
  "What chairs do you have?",
];

const orderSuggestions = [
  "Where's my order?",
  "Show me my recent orders",
  "Has my order shipped?",
];

export function WelcomeScreen({
  onSuggestionClick,
  isSignedIn,
}: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-primary/5 border border-primary/30 p-4">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">
        How can I help you today?
      </h3>
      <p className="mt-2 text-xs text-foreground/40 max-w-xs">
        {isSignedIn
          ? "I can help you find furniture, check your orders, and track deliveries."
          : "I can help you find furniture by style, material, color, or price. Just ask!"}
      </p>

      {/* Product suggestions */}
      <div className="mt-6 w-full max-w-sm">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground/40 mb-2">
          <Search className="h-3 w-3" />
          Find products
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {productSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestionClick({ text: suggestion })}
              className="rounded-full border border-foregroud/20 px-3 py-1.5 text-sm text-foreground/60 transition-colors hover:bg-primary/5 hover:border-primary dark:border-foreground/60"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Order suggestions - only for signed in users */}
      {isSignedIn && (
        <div className="mt-4 w-full max-w-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground/40 mb-2">
            <Package className="h-3 w-3" />
            Your orders
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {orderSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestionClick({ text: suggestion })}
                className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary hover:text-background"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
