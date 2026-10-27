import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" fill="#2f5bff" />
      <path
        d="M8.5 20.5L13 15.5L16.5 18.5L23 11"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 11H23V16.5"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  textClassName,
  markClassName,
}: {
  className?: string;
  textClassName?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={cn("size-7", markClassName)} />
      <span className={cn("font-semibold tracking-tight", textClassName)}>
        Financitas
      </span>
    </span>
  );
}
