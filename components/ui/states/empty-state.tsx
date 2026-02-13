import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  /** Lucide icon to display */
  icon: LucideIcon;
  /** Main title text */
  title: string;
  /** Description text (optional) */
  description?: string;
  /** Action button configuration (optional) */
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    icon?: LucideIcon;
  };
  /** Additional className for the container */
  className?: string;
  /** Size variant */
  size?: "sm" | "default" | "lg";
}

const sizeConfig = {
  sm: {
    container: "py-8",
    iconWrapper: "h-12 w-12 mb-3",
    icon: "h-4 w-4",
    title: "text-base",
    description: "text-xs mt-1",
  },
  default: {
    container: "py-16",
    iconWrapper: "h-16 w-16 mb-4",
    icon: "h-6 w-6",
    title: "text-lg",
    description: "text-xs mt-1",
  },
  lg: {
    container: "py-20",
    iconWrapper: "h-18 w-18 mb-5",
    icon: "h-8 w-8",
    title: "text-xl",
    description: "text-sm mt-2",
  },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "default",
}: EmptyStateProps) {
  const config = sizeConfig[size];

  const ActionButton = action ? (
    action.href ? (
      <Button asChild className="mt-4 text-background">
        <a href={action.href}>
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {action.label}
        </a>
      </Button>
    ) : (
      <Button
        onClick={action.onClick}
        disabled={action.disabled}
        className="mt-4"
      >
        {action.icon && <action.icon className="mr-2 h-4 w-4" />}
        {action.label}
      </Button>
    )
  ) : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        config.container,
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-primary",
          config.iconWrapper
        )}
      >
        <Icon className={cn("text-background", config.icon)} />
      </div>
      <h2
        className={cn(
          "font-semibold text-foreground/80",
          config.title
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-sm text-foreground/60 text-xs",
            config.description
          )}
        >
          {description}
        </p>
      )}
      {ActionButton}
    </div>
  );
}

