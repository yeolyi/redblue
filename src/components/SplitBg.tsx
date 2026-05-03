import type { CSSProperties } from "react";

interface Props {
  intensity?: number;
  highlight?: "red" | "blue" | null;
}

export default function SplitBg({ intensity = 1, highlight = null }: Props) {
  const redOpacity = highlight === "blue" ? 0.35 * intensity : intensity;
  const blueOpacity = highlight === "red" ? 0.35 * intensity : intensity;

  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 grid grid-cols-2">
        <div
          className="transition-all duration-700"
          style={
            {
              background:
                "linear-gradient(135deg, var(--color-blue-vote-deep), var(--color-blue-vote))",
              opacity: blueOpacity,
            } as CSSProperties
          }
        />
        <div
          className="transition-all duration-700"
          style={
            {
              background:
                "linear-gradient(225deg, var(--color-red-vote-deep), var(--color-red-vote))",
              opacity: redOpacity,
            } as CSSProperties
          }
        />
      </div>
      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
}
