import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY 가 누락됨");
}

export function createSupabaseServerClient(
  request: Request,
  cookies: AstroCookies,
) {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: "redblue" },
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "")
          .filter((c): c is { name: string; value: string } => c.value !== undefined);
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookies.set(name, value, options),
        );
      },
    },
  });
}
