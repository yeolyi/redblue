import type { ReactNode } from "react";

type Choice = "red" | "blue";

const BUTTONS: Record<Choice, { left: string; top: string; size: string }> = {
  red: { left: "25.34%", top: "75.11%", size: "20.10%" },
  blue: { left: "74.37%", top: "75.11%", size: "20.10%" },
};

type Props = {
  onChoice: (choice: Choice) => void;
  disabled?: boolean;
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
};

export default function Board({
  onChoice,
  disabled,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}: Props) {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: "min(100%, calc(100svh * 3 / 4))",
        aspectRatio: "3 / 4",
      }}
    >
      <img
        src="/board.png"
        alt="당신을 포함한 전 인류는 지금 하나의 버튼을 선택해야 합니다"
        className="block h-full w-full select-none"
        draggable={false}
      />
      {(["red", "blue"] as Choice[]).map((choice) => {
        const pos = BUTTONS[choice];
        return (
          <button
            key={choice}
            type="button"
            aria-label={choice === "blue" ? "파랑 선택" : "빨강 선택"}
            disabled={disabled}
            onClick={() => onChoice(choice)}
            className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 disabled:opacity-50"
            style={{ left: pos.left, top: pos.top, width: pos.size }}
          />
        );
      })}
      {topLeft && (
        <div className="pointer-events-none absolute left-3 top-3 sm:left-5 sm:top-5">
          <div className="pointer-events-auto">{topLeft}</div>
        </div>
      )}
      {topRight && (
        <div className="pointer-events-none absolute right-3 top-3 text-right sm:right-5 sm:top-5">
          <div className="pointer-events-auto flex flex-col items-end gap-1">
            {topRight}
          </div>
        </div>
      )}
      {bottomLeft && (
        <div className="pointer-events-none absolute left-3 bottom-3 sm:left-5 sm:bottom-5">
          <div className="pointer-events-auto">{bottomLeft}</div>
        </div>
      )}
      {bottomRight && (
        <div className="pointer-events-none absolute right-3 bottom-3 text-right sm:right-5 sm:bottom-5">
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            {bottomRight}
          </div>
        </div>
      )}
    </div>
  );
}
