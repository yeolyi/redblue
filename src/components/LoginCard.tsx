import { useState } from "react";
import { supabaseBrowser } from "../lib/supabase-browser";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import Board from "./Board";
import CountdownNeon from "./CountdownNeon";
import BoardCredits from "./BoardCredits";
import Wiggle from "./Wiggle";

type Provider = "kakao" | "google" | "github";

function humanizeAuthError(raw: string): string {
  const decoded = decodeURIComponent(raw);
  if (decoded.includes("code verifier")) {
    return "인증 세션이 만료됐어요. 한 번에 한 제공자만 클릭해 주세요.";
  }
  if (decoded === "missing-code") {
    return "인증 코드를 받지 못했습니다. 다시 시도해 주세요.";
  }
  return `로그인 실패: ${decoded}`;
}

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "kakao", label: "카카오로 로그인" },
  { id: "google", label: "Google로 로그인" },
  { id: "github", label: "GitHub로 로그인" },
];

// /calibrate-login 에서 측정한 값으로 교체
const POSITIONS: Record<Provider, { left: string; top: string; size: string }> = {
  kakao: { left: "34.25%", top: "59.00%", size: "11.00%" },
  google: { left: "50.00%", top: "59.00%", size: "11.00%" },
  github: { left: "65.75%", top: "59.00%", size: "11.00%" },
};

export default function LoginCard({
  totalCount,
  authError,
}: {
  totalCount: number;
  authError?: string | null;
}) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [open, setOpen] = useState(!!authError);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    authError ? humanizeAuthError(authError) : null,
  );

  async function login(provider: Provider) {
    setPending(provider);
    setErrorMsg(null);
    const redirectTo = `${window.location.origin}/api/auth/callback`;
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) {
      setPending(null);
      setErrorMsg(error.message);
    }
  }

  return (
    <>
      <div
        className="relative z-10 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black text-white"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
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
          className="mx-auto !bg-black bg-[url('/login-plate.webp')] bg-cover bg-center bg-no-repeat border-0 max-w-none w-[min(100%,calc(100svh*3/4))] aspect-[1136/1385] mt-0 max-h-none rounded-none"
        >
          <DrawerTitle className="sr-only">신원 확인이 필요합니다</DrawerTitle>
          <DrawerDescription className="sr-only">
            이 결정은 당신의 이름으로 영구 기록됩니다. 로그인 후 다시 버튼을
            눌러주세요.
          </DrawerDescription>
          <div className="relative h-full w-full">
            {errorMsg && (
              <div className="absolute left-1/2 top-[42%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded bg-red-900/40 px-3 py-2 text-center text-xs text-red-200 ring-1 ring-red-300/40 backdrop-blur-sm">
                ⚠ {errorMsg}
              </div>
            )}
            {PROVIDERS.map((p) => {
              const pos = POSITIONS[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-label={p.label}
                  title={p.label}
                  disabled={pending !== null}
                  onClick={() => login(p.id)}
                  style={{ left: pos.left, top: pos.top, width: pos.size }}
                  className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70 disabled:opacity-50"
                />
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>

    </>
  );
}
