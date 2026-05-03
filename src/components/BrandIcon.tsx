import {
  siKakaotalk,
  siGoogle,
  siApple,
  siGithub,
  type SimpleIcon,
} from "simple-icons/icons";

const ICONS: Record<string, SimpleIcon> = {
  kakao: siKakaotalk,
  google: siGoogle,
  apple: siApple,
  github: siGithub,
};

export default function BrandIcon({
  brand,
  className,
}: {
  brand: keyof typeof ICONS;
  className?: string;
}) {
  const icon = ICONS[brand];
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      aria-label={icon.title}
    >
      <path d={icon.path} />
    </svg>
  );
}
