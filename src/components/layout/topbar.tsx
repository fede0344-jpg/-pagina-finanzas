import { UserMenu } from "./user-menu";

export function Topbar({ email }: { email: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 md:px-6">
      <span className="font-semibold tracking-tight md:hidden">
        Finanzas
      </span>
      <div className="ml-auto">
        <UserMenu email={email} />
      </div>
    </header>
  );
}
