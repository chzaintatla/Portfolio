import { CmsImage } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

/**
 * Project artwork. Uses the CMS thumbnail when there is one; otherwise draws an abstract,
 * accent-tinted composition (device frame + wave) so cards never fall back to stock imagery.
 */
export function ProjectVisual({ title, image, accent, category, className, priority, sizes = "(min-width: 1024px) 60vw, 100vw" }: {
  title: string; image?: string | null; accent?: string | null; category?: string | null; className?: string;
  priority?: boolean; sizes?: string;
}) {
  const color = accent || "#7C3AED";
  if (image) {
    return (
      // Mockups are often square; show them whole over a blurred, darkened copy that fills the frame.
      <div className={cn("relative overflow-hidden bg-night", className)}>
        <CmsImage src={image} alt="" aria-hidden fill sizes="10vw" className="scale-125 object-cover opacity-50 blur-2xl" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-midnight/60 to-transparent" />
        <CmsImage src={image} alt={`${title} preview`} fill sizes={sizes} priority={priority} className="object-contain transition-transform duration-[1.2s] ease-spark group-hover:scale-[1.04]" />
      </div>
    );
  }
  const mobile = /mobile|app/i.test(category ?? "");
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: `radial-gradient(120% 90% at 85% 10%, ${color}55, transparent 55%), radial-gradient(90% 80% at 0% 100%, #22D3EE22, transparent 60%), #0D101A` }}
      aria-hidden="true"
    >
      <div className="bg-grid absolute inset-0 opacity-50" />
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full transition-transform duration-[1.2s] ease-spark group-hover:scale-[1.04]">
        <path d="M-10 190 C 70 190, 90 120, 170 120 S 280 200, 410 150" fill="none" stroke={color} strokeOpacity=".55" strokeWidth="2" />
        <path d="M-10 215 C 80 215, 110 160, 190 160 S 300 225, 410 185" fill="none" stroke="#22D3EE" strokeOpacity=".25" strokeWidth="1.2" />
        {mobile ? (
          <g transform="translate(150 28)">
            <rect width="100" height="200" rx="18" fill="#111522" stroke="rgba(255,255,255,.18)" />
            <rect x="10" y="22" width="80" height="44" rx="8" fill={color} fillOpacity=".35" />
            {[80, 98, 116].map((y) => <rect key={y} x="10" y={y} width={y === 98 ? 56 : 80} height="10" rx="5" fill="rgba(255,255,255,.1)" />)}
            <rect x="10" y="140" width="38" height="38" rx="8" fill="rgba(255,255,255,.06)" />
            <rect x="52" y="140" width="38" height="38" rx="8" fill="#22D3EE" fillOpacity=".18" />
          </g>
        ) : (
          <g transform="translate(70 40)">
            <rect width="260" height="170" rx="12" fill="#111522" stroke="rgba(255,255,255,.18)" />
            <circle cx="14" cy="13" r="3" fill="rgba(255,255,255,.2)" />
            <circle cx="24" cy="13" r="3" fill="rgba(255,255,255,.2)" />
            <rect x="12" y="30" width="60" height="128" rx="6" fill="rgba(255,255,255,.04)" />
            <rect x="82" y="30" width="166" height="54" rx="6" fill={color} fillOpacity=".3" />
            <rect x="82" y="94" width="78" height="64" rx="6" fill="rgba(255,255,255,.05)" />
            <rect x="170" y="94" width="78" height="64" rx="6" fill="#22D3EE" fillOpacity=".14" />
          </g>
        )}
      </svg>
      <span className="absolute bottom-5 left-6 font-display text-[clamp(2rem,5vw,4rem)] leading-none font-bold tracking-tight text-white/[.06]">
        {title}
      </span>
    </div>
  );
}
