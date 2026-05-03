// 1회 실행: node scripts/build-og.mjs
// → public/og.png (1200x630) 생성. 디자인 변경 시 다시 실행 후 commit.
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";

const W = 1200;
const H = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="redG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#b91c1c"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
    <linearGradient id="blueG" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${W / 2}" height="${H}" fill="url(#redG)"/>
  <rect x="${W / 2}" y="0" width="${W / 2}" height="${H}" fill="url(#blueG)"/>
  <rect x="0" y="0" width="${W}" height="${H}" fill="rgba(0,0,0,0.18)"/>

  <g font-family="Pretendard, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" fill="white" text-anchor="middle">
    <text x="${W / 2}" y="200" font-size="140" font-weight="800">빨강 vs 파랑</text>

    <text x="${W / 2}" y="338" font-size="38" fill="rgba(255,255,255,0.92)" font-weight="500">지구상 모든 사람이 비밀투표로 빨강이나 파랑을 누른다.</text>
    <text x="${W / 2}" y="396" font-size="38" fill="rgba(255,255,255,0.92)" font-weight="500">파랑이 절반을 넘으면 전원 생존, 미만이면 빨강만 생존.</text>
    <text x="${W / 2}" y="488" font-size="46" fill="white" font-weight="700">당신은 어느 쪽을 누르겠습니까?</text>

    <text x="${W / 2}" y="585" font-size="26" fill="rgba(255,255,255,0.7)" letter-spacing="2">vote.yeolyi.com</text>
  </g>
</svg>
`;

mkdirSync("public", { recursive: true });
const png = await sharp(Buffer.from(svg))
  .resize(W, H, { fit: "fill" })
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync("public/og.png", png);
console.log(`wrote public/og.png (${png.length.toLocaleString()} bytes)`);
