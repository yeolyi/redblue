export default function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-10 px-6 py-4 text-center text-xs text-white/60">
      <p>
        Inspired by{" "}
        <a
          href="https://x.com/MrBeast/status/1916501096811450585"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          @MrBeast
        </a>
        {" · "}© 2026{" "}
        <a
          href="https://yeolyi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          yeolyi.com
        </a>
      </p>
    </footer>
  );
}
