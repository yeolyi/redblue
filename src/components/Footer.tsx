export default function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-10 px-6 py-4 text-center text-xs text-white/60">
      <p>
        Inspired by{" "}
        <a
          href="https://x.com/MrBeast/status/2049273335742435617"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          @MrBeast
        </a>
        {" · "}made by{" "}
        <a
          href="https://instagram.com/yeol.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          @yeol.dev
        </a>
      </p>
    </footer>
  );
}
