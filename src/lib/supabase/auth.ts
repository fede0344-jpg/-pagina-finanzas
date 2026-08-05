import "server-only";
import { cache } from "react";
import { createClient } from "./server";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return { id: data.claims.sub as string, email: data.claims.email as string };
});
