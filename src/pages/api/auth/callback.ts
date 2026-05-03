import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

export const GET: APIRoute = async ({ request, cookies, redirect, url }) => {
  const code = url.searchParams.get("code");
  if (!code) return redirect("/?auth=missing-code", 303);

  const supabase = createSupabaseServerClient(request, cookies);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return redirect(`/?auth=${encodeURIComponent(error.message)}`, 303);
  }
  return redirect("/", 303);
};
