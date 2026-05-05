export default function Wiggle({ children }: { children: string }) {
  return (
    <>
      {children.split("").map((ch, i) => (
        <span
          key={i}
          className="wiggle-char"
          style={{
            animationDelay: `${(i * 0.07) % 0.6}s`,
            animationDuration: `${0.5 + ((i * 13) % 5) * 0.05}s`,
          }}
        >
          {ch}
        </span>
      ))}
    </>
  );
}
