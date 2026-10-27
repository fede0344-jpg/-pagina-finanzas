import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ email }: { email: string }) {
  const initial = (email.trim()[0] ?? "?").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menú de la cuenta"
        className="display flex size-10 items-center justify-center rounded-full bg-cel text-sm text-on-cel outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {initial}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <div className="truncate px-1.5 py-1.5 font-mono text-xs text-muted-foreground">
          {email}
        </div>
        <DropdownMenuItem render={<Link href="/cuenta" />}>
          <Settings />
          Mi cuenta
        </DropdownMenuItem>
        <form action={signOut}>
          <DropdownMenuItem
            variant="destructive"
            nativeButton
            render={<button type="submit" className="w-full" />}
          >
            <LogOut />
            Cerrar sesión
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
