import { useEffect, useState } from "react";
import { REVEAL_DATE } from "../lib/constants";

function diff(target: Date) {
  const now = Date.now();
  const t = target.getTime() - now;
  if (t <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const d = Math.floor(t / 86_400_000);
  const h = Math.floor((t % 86_400_000) / 3_600_000);
  const m = Math.floor((t % 3_600_000) / 60_000);
  const s = Math.floor((t % 60_000) / 1000);
  return { d, h, m, s, done: false };
}

export default function Countdown() {
  const [time, setTime] = useState(() => diff(REVEAL_DATE));

  useEffect(() => {
    const id = setInterval(() => setTime(diff(REVEAL_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  if (time.done) {
    return (
      <p className="text-sm font-medium tracking-wide text-white/80">
        결과가 공개됐습니다
      </p>
    );
  }

  const cell = (n: number, label: string) => (
    <div className="flex flex-col items-center">
      <span className="font-mono text-3xl font-semibold tabular-nums sm:text-4xl">
        {String(n).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-widest text-white/60 sm:text-xs">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-4 text-white sm:gap-6">
      {cell(time.d, "DAYS")}
      <span className="text-2xl text-white/40">:</span>
      {cell(time.h, "HOURS")}
      <span className="text-2xl text-white/40">:</span>
      {cell(time.m, "MIN")}
      <span className="text-2xl text-white/40">:</span>
      {cell(time.s, "SEC")}
    </div>
  );
}
