import { useState } from "react";
import { supabaseBrowser } from "../lib/supabase-browser";
import { Button } from "./ui/button";
import BrandIcon from "./BrandIcon";
import SplitBg from "./SplitBg";
import Countdown from "./Countdown";
import Footer from "./Footer";

type Provider = "kakao" | "google" | "apple" | "github";

const PROVIDERS: {
  id: Provider;
  label: string;
  className: string;
  iconClassName?: string;
}[] = [
  {
    id: "kakao",
    label: "카카오로 시작하기",
    className: "bg-[#FEE500] text-black hover:bg-[#FEE500]/90",
  },
  {
    id: "google",
    label: "Google로 시작하기",
    className:
      "bg-white text-black border border-black/10 hover:bg-white/90",
  },
  {
    id: "apple",
    label: "Apple로 시작하기",
    className: "bg-black text-white hover:bg-black/90",
  },
  {
    id: "github",
    label: "GitHub로 시작하기",
    className: "bg-[#1f2328] text-white hover:bg-[#1f2328]/90",
  },
];

export default function LoginCard({ totalCount }: { totalCount: number }) {
  const [pending, setPending] = useState<Provider | null>(null);

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
      <SplitBg />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-white">
        <div className="mb-8 flex flex-col items-center text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            5월 18일 오후 6시 결과 공개
          </p>
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            파랑 vs 빨강
          </h1>
          <p className="mt-5 max-w-md text-balance text-sm leading-relaxed text-white/80 sm:text-base">
            지구상 모든 사람이 비밀투표로 파랑이나 빨강을 누른다.
            <br />
            파랑이 절반을 넘으면 <b>전원 생존</b>, 미만이면 <b>빨강만 생존</b>.
            <br />
            당신은 어느 쪽을 누르겠습니까?
          </p>
        </div>

        <div className="mb-10">
          <Countdown />
        </div>

        <div className="w-full max-w-sm space-y-2.5">
          {PROVIDERS.map((p) => (
            <Button
              key={p.id}
              type="button"
              size="lg"
              disabled={pending !== null}
              onClick={() => login(p.id)}
              className={`h-12 w-full justify-center gap-3 text-sm font-semibold shadow-sm transition active:scale-[0.98] ${p.className}`}
            >
              <BrandIcon brand={p.id} className="h-5 w-5" />
              {pending === p.id ? "이동 중…" : p.label}
            </Button>
          ))}
        </div>

        <p className="mt-8 text-xs text-white/70">
          현재 <b>{totalCount.toLocaleString()}</b>명 참여
        </p>
      </div>
      <Footer />
    </>
  );
}
