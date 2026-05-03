import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(request, cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "로그인 필요" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "잘못된 요청" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const choice = (body as { choice?: string })?.choice;
  if (choice !== "red" && choice !== "blue") {
    return new Response(JSON.stringify({ error: "choice는 red 또는 blue" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { error } = await supabase
    .from("votes")
    .insert({ user_id: user.id, choice });

  if (error) {
    const isDup = error.code === "23505";
    return new Response(
      JSON.stringify({
        error: isDup ? "이미 투표하셨습니다" : error.message,
      }),
      {
        status: isDup ? 409 : 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
