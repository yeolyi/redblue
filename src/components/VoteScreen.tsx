import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import SplitBg from "./SplitBg";
import Footer from "./Footer";

type Choice = "red" | "blue";

export default function VoteScreen({ totalCount }: { totalCount: number }) {
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

  const ChoiceCard = ({ choice }: { choice: Choice }) => {
    const isBlue = choice === "blue";
    const colorVar = isBlue
      ? "var(--color-blue-vote)"
      : "var(--color-red-vote)";
    const titleKo = isBlue ? "파랑" : "빨강";
    const subKo = isBlue ? "다 같이 살자에 건다" : "확실히 살아남는다";

    return (
      <button
        type="button"
        disabled={pending}
        onMouseEnter={() => setHover(choice)}
        onMouseLeave={() => setHover(null)}
        onFocus={() => setHover(choice)}
        onBlur={() => setHover(null)}
        onClick={() => setConfirm(choice)}
        className="group flex aspect-square flex-col items-center justify-center rounded-2xl bg-white/10 p-8 text-center backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-white/15 hover:ring-white/40 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
      >
        <div
          className="h-20 w-20 rounded-full shadow-lg ring-4 ring-white/30 transition group-hover:scale-110 sm:h-24 sm:w-24"
          style={{ background: colorVar }}
        />
        <p className="mt-6 text-2xl font-bold">{titleKo}</p>
        <p className="mt-1 text-xs text-white/70">{subKo}</p>
      </button>
    );
  };

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
          <ChoiceCard choice="red" />
          <ChoiceCard choice="blue" />
        </div>

        <div className="mt-10 flex items-center gap-4 text-xs text-white/70">
          <button
            onClick={signout}
            className="underline underline-offset-2 hover:text-white cursor-pointer"
          >
            로그아웃
          </button>
          <span className="text-white/30">·</span>
          <span>{totalCount.toLocaleString()}명 참여</span>
        </div>

        {error && <p className="mt-6 text-sm text-red-200">⚠ {error}</p>}
      </div>

      <Dialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirm === "blue" ? "파랑" : "빨강"}을 누르시겠습니까?
            </DialogTitle>
            <DialogDescription>
              한 번 누르면 변경할 수 없습니다. 5월 18일 오후 6시 결과 공개까지
              유지됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirm(null)}
              disabled={pending}
            >
              취소
            </Button>
            <Button
              onClick={() => confirm && submit(confirm)}
              disabled={pending}
              className={
                confirm === "blue"
                  ? "bg-[var(--color-blue-vote)] text-white hover:bg-[var(--color-blue-vote-deep)]"
                  : "bg-[var(--color-red-vote)] text-white hover:bg-[var(--color-red-vote-deep)]"
              }
            >
              {pending ? "전송 중…" : "확정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
