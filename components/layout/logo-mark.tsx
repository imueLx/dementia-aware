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
  const dimensions = size === "lg" ? "h-16 w-16" : "h-11 w-11";
  const imageSize = size === "lg" ? 64 : 44;

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-purple-100 bg-white text-sm font-bold text-purple-700 shadow-sm ${dimensions} ${className}`}
      aria-hidden="true"
    >
      {logoFailed ? (
        <span>DA</span>
      ) : (
        <Image
          src={logoSrc}
          alt=""
          width={imageSize}
          height={imageSize}
          className="h-full w-full object-contain p-1"
          onError={() => setLogoFailed(true)}
          priority={size === "lg"}
        />
      )}
    </span>
  );
}
