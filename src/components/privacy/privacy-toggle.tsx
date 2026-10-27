"use client";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrivacy } from "./privacy-provider";

export function PrivacyToggle({ className }: { className?: string }) {
  const { hidden, toggle } = usePrivacy();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={hidden}
      title={hidden ? "Mostrar montos" : "Ocultar montos"}
      className={cn(
        "flex size-10 items-center justify-center rounded-full ring-1 ring-foreground/8 transition-colors",
        hidden
          ? "bg-ink text-on-ink"
          : "bg-card text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      <span className="sr-only">
        {hidden ? "Mostrar montos" : "Ocultar montos"}
      </span>
    </button>
  );
}
