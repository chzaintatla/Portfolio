import { cn } from "@/lib/utils";

// Deterministic pseudo-random so server and client render the same particles.
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/** Animated grid, drifting radial glows and floating particles. Purely decorative. */
export function Backdrop({ className, particles = 22, tone = "violet" }: {
  className?: string; particles?: number; tone?: "violet" | "aqua" | "gold";
}) {
  const glow = { violet: "bg-violet/25", aqua: "bg-aqua/15", gold: "bg-gold/15" }[tone];
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="bg-grid mask-radial animate-grid absolute inset-0 opacity-70" />
      <div className={cn("animate-float absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full blur-[140px]", glow)} />
      <div className="animate-float absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-aqua/10 blur-[140px] [animation-delay:-3s]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-[40rem] rounded-full bg-gold/[.06] blur-[120px]" />
      {Array.from({ length: particles }, (_, i) => (
        <span
          key={i}
          className="animate-float absolute rounded-full bg-white"
          style={{
            left: `${(rand(i + 1) * 100).toFixed(2)}%`,
            top: `${(rand(i + 101) * 100).toFixed(2)}%`,
            width: `${(1 + rand(i + 7) * 2).toFixed(1)}px`,
            height: `${(1 + rand(i + 7) * 2).toFixed(1)}px`,
            opacity: +(0.15 + rand(i + 3) * 0.5).toFixed(2),
            animationDuration: `${(6 + rand(i + 11) * 8).toFixed(1)}s`,
            animationDelay: `-${(rand(i + 17) * 8).toFixed(1)}s`,
          }}
        />
      ))}
    </div>
  );
}
