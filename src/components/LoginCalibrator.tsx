import { useState } from "react";

export default function LoginCalibrator() {
  const [topPct, setTopPct] = useState(70); // y position of button row center (% of plate height)
  const [size, setSize] = useState(12); // button size (% of plate width)
  const [gap, setGap] = useState(4); // gap between buttons (% of plate width)
  const [copied, setCopied] = useState(false);

  // image aspect: 1137/1383
  const code = `// drawer content padding suggestion (apply to LoginCard drawer):
// place button row centered horizontally at top: ${topPct.toFixed(2)}% of plate height
// container: aspect-[1137/1383], so to position absolutely use top-[${topPct.toFixed(2)}%]
// or use padding from top: pt-[${(topPct * 1383 / 1137).toFixed(2)}%] + justify-start, then flex-col
//
// Recommended: render buttons with absolute positioning
<div className="absolute left-1/2 top-[${topPct.toFixed(2)}%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-[${gap.toFixed(2)}%]">
  {/* each button width: ${size.toFixed(2)}% of plate width */}
</div>`;

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex min-h-[100svh] flex-col items-center bg-neutral-900 p-4 text-white">
      <div
        className="relative w-full max-w-[480px]"
        style={{ aspectRatio: "1137 / 1383" }}
      >
        <img
          src="/login-plate.webp"
          alt="login plate"
          className="block h-full w-full select-none"
          draggable={false}
        />
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{
            top: `${topPct}%`,
            gap: `${gap}%`,
            width: "100%",
          }}
        >
          {["#FEE500", "#ffffff", "#1f2328"].map((c, i) => (
            <div
              key={i}
              className="aspect-square rounded-full ring-2 ring-amber-400/70"
              style={{ width: `${size}%`, background: c }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 grid w-full max-w-[480px] grid-cols-1 gap-3">
        {[
          { label: "y 위치 (top %)", value: topPct, set: setTopPct, min: 0, max: 100 },
          { label: "버튼 크기 (% 폭)", value: size, set: setSize, min: 4, max: 25 },
          { label: "버튼 간격 (% 폭)", value: gap, set: setGap, min: 0, max: 20 },
        ].map((row) => (
          <label key={row.label} className="block text-xs">
            <span className="mb-1 flex justify-between">
              <span>{row.label}</span>
              <span>{row.value.toFixed(2)}%</span>
            </span>
            <input
              type="range"
              min={row.min}
              max={row.max}
              step={0.1}
              value={row.value}
              onChange={(e) => row.set(Number(e.target.value))}
              className="w-full"
            />
          </label>
        ))}
      </div>

      <pre className="mt-4 w-full max-w-[640px] overflow-x-auto rounded bg-black/60 p-3 text-xs">
        {code}
      </pre>

      <button
        type="button"
        onClick={copy}
        className="mt-2 rounded bg-white px-3 py-1 text-sm text-black"
      >
        {copied ? "복사됨!" : "코드 복사"}
      </button>
    </div>
  );
}
