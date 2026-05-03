import { useState } from "react";

const SHARE_URL = "https://vote.yeolyi.com";
const SHARE_TITLE = "빨강 vs 파랑";
const SHARE_TEXT =
  "지구상 모든 사람이 비밀투표로 빨강이나 파랑을 누른다. 당신은?";

type Status = "idle" | "copied" | "error";

export default function ShareButton({
  className = "",
}: {
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function share() {
    const data: ShareData = {
      title: SHARE_TITLE,
      text: SHARE_TEXT,
      url: SHARE_URL,
    };
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share(data);
        return;
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1800);
    }
  }

  const label =
    status === "copied"
      ? "주소 복사됨"
      : status === "error"
        ? "복사 실패"
        : "공유";

  return (
    <button
      type="button"
      onClick={share}
      aria-label="공유"
      className={`inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98] ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      {label}
    </button>
  );
}
