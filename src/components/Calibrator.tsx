import { useRef, useState } from "react";

type Choice = "red" | "blue";
type Pos = { left: number; top: number; size: number }; // all percentages

const INITIAL: Record<Choice, Pos> = {
  red: { left: 24, top: 75, size: 18 },
  blue: { left: 71, top: 74, size: 18 },
};

export default function Calibrator() {
  const [pos, setPos] = useState(INITIAL);
  const [active, setActive] = useState<Choice>("red");
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  function onPointerDown(choice: Choice) {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      setActive(choice);
      const el = containerRef.current;
      if (!el) return;
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      const move = (ev: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const left = ((ev.clientX - rect.left) / rect.width) * 100;
        const top = ((ev.clientY - rect.top) / rect.height) * 100;
        setPos((p) => ({
          ...p,
          [choice]: {
            ...p[choice],
            left: clamp(left, 0, 100),
            top: clamp(top, 0, 100),
          },
        }));
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  }

  function setSize(choice: Choice, size: number) {
    setPos((p) => ({ ...p, [choice]: { ...p[choice], size } }));
  }

  function setField(choice: Choice, field: keyof Pos, value: number) {
    setPos((p) => ({ ...p, [choice]: { ...p[choice], [field]: value } }));
  }

  const code = `const BUTTONS: Record<Choice, { left: string; top: string; size: string }> = {
  red:  { left: "${pos.red.left.toFixed(2)}%", top: "${pos.red.top.toFixed(2)}%", size: "${pos.red.size.toFixed(2)}%" },
  blue: { left: "${pos.blue.left.toFixed(2)}%", top: "${pos.blue.top.toFixed(2)}%", size: "${pos.blue.size.toFixed(2)}%" },
};`;

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex min-h-[100svh] flex-col items-center bg-neutral-900 p-4 text-white print:bg-white print:text-black">
      <div className="mb-3 flex flex-wrap items-center gap-3 print:hidden">
        <span className="text-sm text-white/70">활성 버튼:</span>
        {(["red", "blue"] as Choice[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`rounded px-3 py-1 text-sm ${
              active === c ? "bg-white text-black" : "bg-white/10"
            }`}
          >
            {c === "red" ? "빨강" : "파랑"}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-[480px]"
        style={{ aspectRatio: "3 / 4" }}
      >
        <img
          src="/board.webp"
          alt="board"
          className="block h-full w-full select-none"
          draggable={false}
        />
        {(["red", "blue"] as Choice[]).map((c) => {
          const p = pos[c];
          const isActive = active === c;
          return (
            <div
              key={c}
              onPointerDown={onPointerDown(c)}
              className={`absolute aspect-square -translate-x-1/2 -translate-y-1/2 cursor-move rounded-full border-2 ${
                c === "red" ? "border-red-400" : "border-blue-400"
              } ${isActive ? "ring-4 ring-white/60" : ""}`}
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}%`,
                background:
                  c === "red"
                    ? "rgba(239,68,68,0.25)"
                    : "rgba(59,130,246,0.25)",
              }}
            >
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-bold">
                {c === "red" ? "R" : "B"}
              </div>
              {/* center crosshair */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid w-full max-w-[480px] grid-cols-2 gap-4 print:hidden">
        {(["red", "blue"] as Choice[]).map((c) => (
          <div key={c} className="rounded border border-white/10 p-3">
            <p className="mb-2 text-sm font-semibold">
              {c === "red" ? "빨강" : "파랑"}
            </p>
            {(["left", "top", "size"] as (keyof Pos)[]).map((f) => (
              <label key={f} className="mb-2 block text-xs">
                <span className="mb-1 flex justify-between">
                  <span>{f}</span>
                  <span>{pos[c][f].toFixed(2)}%</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={f === "size" ? 50 : 100}
                  step={0.1}
                  value={pos[c][f]}
                  onChange={(e) => setField(c, f, Number(e.target.value))}
                  className="w-full"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => setSize(c, Math.max(1, pos[c].size - 0.5))}
              className="mr-1 rounded bg-white/10 px-2 py-1 text-xs"
            >
              크기 −
            </button>
            <button
              type="button"
              onClick={() => setSize(c, Math.min(50, pos[c].size + 0.5))}
              className="rounded bg-white/10 px-2 py-1 text-xs"
            >
              크기 +
            </button>
          </div>
        ))}
      </div>

      <pre className="mt-4 w-full max-w-[640px] overflow-x-auto rounded bg-black/60 p-3 text-xs print:bg-transparent print:text-black">
        {code}
      </pre>

      <div className="mt-2 flex gap-2 print:hidden">
        <button
          type="button"
          onClick={copy}
          className="rounded bg-white px-3 py-1 text-sm text-black"
        >
          {copied ? "복사됨!" : "코드 복사"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded bg-white/10 px-3 py-1 text-sm"
        >
          프린트
        </button>
        <button
          type="button"
          onClick={() => setPos(INITIAL)}
          className="rounded bg-white/10 px-3 py-1 text-sm"
        >
          초기화
        </button>
      </div>

      <p className="mt-3 text-xs text-white/50 print:hidden">
        원을 마우스/터치로 드래그하거나 슬라이더로 조정하세요. 크기는 슬라이더로
        변경합니다.
      </p>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
