import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(request, cookies);
  await supabase.auth.signOut();
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
