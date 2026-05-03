import NumberFlow from "@number-flow/react";

export default function TotalCount({ value }: { value: number }) {
  return (
    <div className="flex items-baseline justify-center gap-1.5">
      <NumberFlow
        value={value}
        className="font-mono text-3xl font-extralight tabular-nums text-white sm:text-4xl"
      />
      <span className="text-xs text-white/70 sm:text-sm">명 투표</span>
    </div>
  );
}
