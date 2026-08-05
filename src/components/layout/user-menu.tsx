import { LogOut, User } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function UserMenu({ email }: { email: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "gap-2 text-muted-foreground",
        )}
      >
        <User className="size-4" />
        <span className="max-w-40 truncate">{email}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
