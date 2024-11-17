import Link from "next/link";

import { Monoton } from "next/font/google";

const monoton = Monoton({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

function Logo() {
  return (
    <Link
      href="/"
      className={`${monoton.className} flex items-center gap-2 z-10`}
    >
      <img
        src="/logo.png"
        height="60"
        width="60"
        alt="WFlance"
        className="rounded-full"
      />
      <span className="text-5xl  text-primary-100">
        WFlance
      </span>
    </Link>
  );
}

export default Logo;
