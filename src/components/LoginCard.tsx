import { useState } from "react";
import { supabaseBrowser } from "../lib/supabase-browser";
import BrandIcon from "./BrandIcon";
import SplitBg from "./SplitBg";
import Countdown from "./Countdown";
import TotalCount from "./TotalCount";
import ShareButton from "./ShareButton";
import Footer from "./Footer";

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
    iconClassName: "h-5 w-5 text-black",
  },
  {
    id: "google",
    label: "Google로 로그인",
    className: "bg-white hover:bg-white/90 border border-black/10",
    iconClassName: "h-5 w-5",
  },
  {
    id: "github",
    label: "GitHub로 로그인",
    className: "bg-[#1f2328] hover:bg-[#1f2328]/90",
    iconClassName: "h-[18px] w-[18px] text-white",
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
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            빨강 vs 파랑
          </h1>
          <p className="mt-5 max-w-md text-balance text-sm leading-relaxed text-white/80 sm:text-base">
            지구상 모든 사람이 비밀투표로 빨강이나 파랑을 누른다.
            <br />
            파랑이 절반을 넘으면 <b>전원 생존</b>, 미만이면 <b>빨강만 생존</b>.
            <br />
            당신은 어느 쪽을 누르겠습니까?
          </p>
        </div>

        <div className="mb-10 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              5월 11일 오후 6시 결과 공개
            </p>
            <Countdown />
          </div>
          <TotalCount value={totalCount} />
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-3 text-xs font-medium text-white/70">
            로그인 후 투표하기
          </p>
          <div className="flex items-center gap-3">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-label={p.label}
                title={p.label}
                disabled={pending !== null}
                onClick={() => login(p.id)}
                className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md transition active:scale-[0.95] disabled:opacity-60 ${p.className}`}
              >
                {pending === p.id ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <BrandIcon brand={p.id} className={p.iconClassName} />
                )}
              </button>
            ))}
          </div>
        </div>

        <ShareButton className="mt-8" />
      </div>
      <Footer />
    </>
  );
}
