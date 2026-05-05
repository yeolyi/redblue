import { useState } from "react";
import { supabaseBrowser } from "../lib/supabase-browser";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import BrandIcon from "./BrandIcon";
import Board from "./Board";
import CountdownNeon from "./CountdownNeon";
import BoardCredits from "./BoardCredits";
import Wiggle from "./Wiggle";

type Provider = "kakao" | "google" | "github";

const PROVIDERS: {
  id: Provider;
  label: string;
  className: string;
  iconClassName: string;
}[] = [
  {
    id: "kakao",
    label: "카카오로 로그인",
    className: "bg-[#FEE500] hover:bg-[#FEE500]/90",
    iconClassName: "h-[40%] w-[40%] text-black",
  },
  {
    id: "google",
    label: "Google로 로그인",
    className: "bg-white hover:bg-white/90 border border-black/10",
    iconClassName: "h-[40%] w-[40%]",
  },
  {
    id: "github",
    label: "GitHub로 로그인",
    className: "bg-[#1f2328] hover:bg-[#1f2328]/90",
    iconClassName: "h-[40%] w-[40%] text-white",
  },
];

export default function LoginCard({ totalCount }: { totalCount: number }) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [open, setOpen] = useState(false);

  async function login(provider: Provider) {
    setPending(provider);
    const redirectTo = `${window.location.origin}/api/auth/callback`;
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) {
      setPending(null);
      alert(`로그인 실패: ${error.message}`);
    }
  }

  return (
    <>
      <div className="relative z-10 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black text-white">
        <Board
          onChoice={() => setOpen(true)}
          disabled={pending !== null}
          topRight={
            <>
              <CountdownNeon />
              <span className="text-xl font-light tabular-nums tracking-wider text-amber-300 [text-shadow:0_0_4px_rgba(255,200,80,0.9),0_0_10px_rgba(245,166,35,0.7),0_0_20px_rgba(245,140,30,0.5)] sm:text-2xl">
                <Wiggle>{`${totalCount}명`}</Wiggle>
              </span>
            </>
          }
          bottomRight={<BoardCredits />}
        />
      </div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          className="mx-auto !bg-black bg-[url('/login-plate.webp')] bg-[length:100%_auto] bg-top bg-no-repeat border-0 max-w-none w-[min(100%,calc(100svh*3/4))] aspect-[1130/1392] mt-0 max-h-none rounded-none"
        >
          <DrawerTitle className="sr-only">신원 확인이 필요합니다</DrawerTitle>
          <DrawerDescription className="sr-only">
            이 결정은 당신의 이름으로 영구 기록됩니다. 로그인 후 다시 버튼을
            눌러주세요.
          </DrawerDescription>
          <div className="relative h-full w-full">
            <div
              className="absolute left-1/2 top-[58%] flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ gap: "7.10%" }}
            >
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={p.label}
                  title={p.label}
                  disabled={pending !== null}
                  onClick={() => login(p.id)}
                  style={{ width: "14%" }}
                  className={`flex aspect-square items-center justify-center rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.3),0_2px_6px_rgba(0,0,0,0.4)] mix-blend-luminosity opacity-80 saturate-50 transition hover:opacity-100 hover:mix-blend-normal hover:saturate-100 active:scale-[0.95] disabled:opacity-60 cursor-pointer ${p.className}`}
                >
                  <BrandIcon brand={p.id} className={p.iconClassName} />
                </button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

    </>
  );
}
