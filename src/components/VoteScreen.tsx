import { useState } from "react";
import Board from "./Board";
import BoardCredits from "./BoardCredits";
import CountdownNeon from "./CountdownNeon";
import Wiggle from "./Wiggle";

type Choice = "red" | "blue";

export default function VoteScreen({ totalCount }: { totalCount: number }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="relative z-10 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black text-white">
      <Board
        onChoice={submit}
        disabled={pending}
        topRight={
          <>
            <CountdownNeon />
            <span className="text-xl font-light tabular-nums tracking-wider text-amber-300 [text-shadow:0_0_4px_rgba(255,200,80,0.9),0_0_10px_rgba(245,166,35,0.7),0_0_20px_rgba(245,140,30,0.5)] sm:text-2xl">
              <Wiggle>{`${totalCount}명`}</Wiggle>
            </span>
            <button
              onClick={signout}
              className="mt-1 font-mono text-[10px] tracking-wider text-amber-300/70 underline underline-offset-2 [text-shadow:0_0_3px_rgba(245,166,35,0.4)] hover:text-amber-200 sm:text-[11px]"
            >
              로그아웃
            </button>
          </>
        }
        bottomRight={<BoardCredits />}
      />
      {error && (
        <p className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded bg-black/70 px-3 py-1 text-sm text-red-300">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
