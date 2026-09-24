import Image from "next/image";

import { cn } from "@/lib/utils";

/** Square SparkWave "S" mark (brand asset: public/brand/logo-mark.png). */
export function LogoMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt=""
      aria-hidden="true"
      width={256}
      height={256}
      className={cn("h-8 w-8 object-contain", animated && "animate-pulse-soft", className)}
    />
  );
}

/**
 * Horizontal logo with wordmark (brand asset: public/brand/logo-wordmark.png).
 * Background keyed to transparency from the supplied banner (applogo_horizontal.png).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-wordmark.png"
      alt="SparkWave Digital Systems"
      width={747}
      height={166}
      priority
      className={cn("h-10 w-auto md:h-11", className)}
    />
  );
}
