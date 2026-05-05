import { useEffect, useState } from "react";
import { REVEAL_DATE } from "../lib/constants";
import Wiggle from "./Wiggle";

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

const pad = (n: number) => n.toString().padStart(2, "0");

export default function CountdownNeon() {
  const [diff, setDiff] = useState(getDiff);

  useEffect(() => {
    const id = setInterval(() => setDiff(getDiff()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!diff) {
    return (
      <span className="font-mono text-sm text-amber-300 [text-shadow:0_0_8px_rgba(245,166,35,0.7)]">
        REVEALED
      </span>
    );
  }

  const text = `${pad(diff.days)}:${pad(diff.hours)}:${pad(diff.minutes)}:${pad(diff.seconds)}`;

  return (
    <span className="font-mono text-3xl font-light tabular-nums tracking-wider text-amber-300 [text-shadow:0_0_4px_rgba(255,200,80,0.9),0_0_10px_rgba(245,166,35,0.7),0_0_20px_rgba(245,140,30,0.5)] sm:text-4xl">
      <Wiggle>{text}</Wiggle>
    </span>
  );
}
