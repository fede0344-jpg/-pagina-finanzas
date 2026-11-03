import { signInWithGoogle } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-10.72-3.78H1.31v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.34 14.31a7.2 7.2 0 0 1 0-4.62V6.6H1.31a12 12 0 0 0 0 10.8l4.03-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.31 6.6l4.03 3.09A7.16 7.16 0 0 1 12 4.75Z"
      />
    </svg>
  );
}

export function GoogleButton({ next }: { next?: string }) {
  return (
    <form action={signInWithGoogle} className="mb-4 flex flex-col gap-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Button type="submit" variant="outline" size="lg" className="w-full">
        <GoogleIcon />
        Continuar con Google
      </Button>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        o con tu email
        <span className="h-px flex-1 bg-border" />
      </div>
    </form>
  );
}
