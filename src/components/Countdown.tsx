import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { REVEAL_DATE } from "../lib/constants";

function getDiff() {
  const ms = REVEAL_DATE.getTime() - Date.now();
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

export default function Countdown() {
  const [diff, setDiff] = useState(getDiff);

  useEffect(() => {
    const id = setInterval(() => setDiff(getDiff()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!diff) {
    return (
      <p className="text-sm font-medium tracking-wide text-white/80">
        결과가 공개됐습니다
      </p>
    );
  }

  return (
    <div className="flex items-baseline justify-center gap-5 sm:gap-7">
      <Unit value={diff.days} label="일" />
      <Unit value={diff.hours} label="시간" />
      <Unit value={diff.minutes} label="분" />
      <Unit value={diff.seconds} label="초" />
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <NumberFlow
        value={value}
        format={{ minimumIntegerDigits: 2 }}
        className="font-mono text-3xl font-extralight tabular-nums text-white sm:text-4xl"
      />
      <span className="text-xs text-white/70 sm:text-sm">{label}</span>
    </div>
  );
}
