import { UserMenu } from "./user-menu";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar({ email }: { email: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 md:px-6">
      <div className="md:hidden">
        <Logo />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <UserMenu email={email} />
      </div>
    </header>
  );
}
