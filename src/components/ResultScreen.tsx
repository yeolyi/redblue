import BoardCredits from "./BoardCredits";
import CountdownNeon from "./CountdownNeon";
import Wiggle from "./Wiggle";

const BUTTONS = {
  red: { left: "25.34%", top: "75.11%", size: "20.10%" },
  blue: { left: "74.37%", top: "75.11%", size: "20.10%" },
};

export default function ResultScreen({
  myVote,
  totalCount,
}: {
  myVote: "red" | "blue";
  totalCount: number;
}) {
  const pos = BUTTONS[myVote];

  async function signout() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="relative z-10 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black text-white">
      <div
        className="relative mx-auto"
        style={{
          width: "min(100%, calc(100svh * 3 / 4))",
          aspectRatio: "3 / 4",
        }}
      >
        <img
          src="/board.webp"
          alt="당신을 포함한 전 인류는 지금 하나의 버튼을 선택해야 합니다"
          className="block h-full w-full select-none"
          draggable={false}
        />

        {/* 선택한 버튼을 강조 */}
        <div
          className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-amber-300/80"
          style={{
            left: pos.left,
            top: pos.top,
            width: pos.size,
            boxShadow:
              "0 0 0 8px rgba(245,166,35,0.25), 0 0 40px rgba(245,166,35,0.7), 0 0 70px rgba(245,166,35,0.4)",
          }}
        />

        {/* 우상단 */}
        <div className="pointer-events-none absolute right-3 top-3 sm:right-5 sm:top-5">
          <div className="pointer-events-auto flex flex-col items-end gap-1 text-right">
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
          </div>
        </div>

        {/* 우하단 */}
        <div className="pointer-events-none absolute right-3 bottom-3 sm:right-5 sm:bottom-5">
          <div className="pointer-events-auto flex flex-col items-end gap-2 text-right">
            <BoardCredits />
          </div>
        </div>
      </div>
    </div>
  );
}
