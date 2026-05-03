import Countdown from "./Countdown";
import Footer from "./Footer";

export default function ResultScreen({
  myVote,
  totalCount,
}: {
  myVote: "red" | "blue";
  totalCount: number;
}) {
  const isRed = myVote === "red";
  const labelKo = isRed ? "빨강" : "파랑";

  async function signout() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.reload();
  }

  return (
    <>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: isRed
            ? "linear-gradient(135deg, var(--color-red-vote-deep), var(--color-red-vote))"
            : "linear-gradient(225deg, var(--color-blue-vote-deep), var(--color-blue-vote))",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-black/15" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-white">
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            투표 완료
          </p>
          <div
            className="mb-6 h-32 w-32 rounded-full shadow-2xl ring-8 ring-white/30 sm:h-40 sm:w-40"
            style={{
              background: isRed
                ? "var(--color-red-vote)"
                : "var(--color-blue-vote)",
            }}
          />
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            당신은 {labelKo}을 골랐습니다
          </h1>
        </div>

        <div className="rounded-2xl bg-white/10 px-8 py-6 ring-1 ring-white/20 backdrop-blur-sm">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            5월 18일 오후 6시 결과 공개까지
          </p>
          <Countdown />
        </div>

        <p className="mt-8 text-sm text-white/80">
          현재 <b>{totalCount.toLocaleString()}</b>명이 결정했습니다
        </p>

        <button
          onClick={signout}
          className="mt-6 text-xs text-white/70 underline underline-offset-2 hover:text-white"
        >
          로그아웃
        </button>
      </div>

      <Footer />
    </>
  );
}
