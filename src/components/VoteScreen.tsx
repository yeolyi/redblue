import { useState } from "react";
import SplitBg from "./SplitBg";
import Footer from "./Footer";

type Choice = "red" | "blue";

export default function VoteScreen({
  userEmail,
  totalCount,
}: {
  userEmail: string;
  totalCount: number;
}) {
  const [hover, setHover] = useState<Choice | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Choice | null>(null);

  async function submit(choice: Choice) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `요청 실패 (${res.status})`);
      }
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
      setPending(false);
    }
  }

  async function signout() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.reload();
  }

  return (
    <>
      <SplitBg highlight={hover} />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-white">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            한 번 누르면 변경할 수 없습니다
          </p>
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            당신의 선택은?
          </h1>
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            disabled={pending}
            onMouseEnter={() => setHover("red")}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover("red")}
            onBlur={() => setHover(null)}
            onClick={() => setConfirm("red")}
            className="group flex aspect-square flex-col items-center justify-center rounded-2xl bg-white/10 p-8 text-center backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-white/15 hover:ring-white/40 active:scale-[0.98] disabled:opacity-60"
          >
            <div className="h-20 w-20 rounded-full bg-[var(--color-red-vote)] shadow-lg ring-4 ring-white/30 transition group-hover:scale-110 sm:h-24 sm:w-24" />
            <p className="mt-6 text-2xl font-bold">빨강</p>
            <p className="mt-1 text-xs text-white/70">확실히 살아남는다</p>
          </button>

          <button
            type="button"
            disabled={pending}
            onMouseEnter={() => setHover("blue")}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover("blue")}
            onBlur={() => setHover(null)}
            onClick={() => setConfirm("blue")}
            className="group flex aspect-square flex-col items-center justify-center rounded-2xl bg-white/10 p-8 text-center backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-white/15 hover:ring-white/40 active:scale-[0.98] disabled:opacity-60"
          >
            <div className="h-20 w-20 rounded-full bg-[var(--color-blue-vote)] shadow-lg ring-4 ring-white/30 transition group-hover:scale-110 sm:h-24 sm:w-24" />
            <p className="mt-6 text-2xl font-bold">파랑</p>
            <p className="mt-1 text-xs text-white/70">다 같이 살자에 건다</p>
          </button>
        </div>

        <div className="mt-10 flex items-center gap-4 text-xs text-white/70">
          <span>{userEmail}</span>
          <span className="text-white/30">·</span>
          <button onClick={signout} className="underline underline-offset-2 hover:text-white">
            로그아웃
          </button>
          <span className="text-white/30">·</span>
          <span>{totalCount.toLocaleString()}명 참여</span>
        </div>

        {error && (
          <p className="mt-6 text-sm text-red-200">⚠ {error}</p>
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-black shadow-xl">
            <h2 className="text-lg font-bold">
              {confirm === "red" ? "빨강" : "파랑"}을 누르시겠습니까?
            </h2>
            <p className="mt-2 text-sm text-black/70">
              한 번 누르면 변경할 수 없습니다. 5월 18일 결과 공개까지 유지됩니다.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirm(null)}
                disabled={pending}
                className="flex-1 rounded-lg border border-black/10 py-2.5 text-sm font-medium hover:bg-black/5"
              >
                취소
              </button>
              <button
                onClick={() => submit(confirm)}
                disabled={pending}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white ${
                  confirm === "red"
                    ? "bg-[var(--color-red-vote)] hover:brightness-95"
                    : "bg-[var(--color-blue-vote)] hover:brightness-95"
                } disabled:opacity-60`}
              >
                {pending ? "전송 중…" : "확정"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
