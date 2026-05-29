"use client";

import Image from "next/image";
import { useState } from "react";

const logoSrc = "/dementia-aware-logo.png";

type LogoMarkProps = {
  className?: string;
  size?: "sm" | "lg";
};

export function LogoMark({ className = "", size = "sm" }: LogoMarkProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const dimensions =
    size === "lg"
      ? "h-16 w-[13rem] sm:h-18 sm:w-[16rem] lg:h-20 lg:w-[20rem]"
      : "h-11 w-11";
  const imageSize = size === "lg" ? 960 : 44;

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center ${dimensions} ${className}`}
      aria-hidden="true"
    >
      {logoFailed ? (
        <span className="text-lg font-semibold tracking-tight text-purple-700">
          DA
        </span>
      ) : (
        <Image
          src={logoSrc}
          alt=""
          width={imageSize}
          height={imageSize}
          className="h-full w-full object-contain"
          onError={() => setLogoFailed(true)}
          priority={size === "lg"}
        />
      )}
    </span>
  );
}
