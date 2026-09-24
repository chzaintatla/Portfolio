import { Sparkles } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** next/image for CMS URLs. Local /uploads are proxied from the API, so they skip the optimizer. */
export function CmsImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const unoptimized = props.unoptimized ?? (src.startsWith("/uploads/") || src.endsWith(".svg"));
  return <Image {...props} unoptimized={unoptimized} alt={props.alt ?? ""} />;
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="hairline flex flex-col items-center gap-3 rounded-3xl bg-card/60 px-6 py-14 text-center">
      <Sparkles className="h-6 w-6 text-aqua" aria-hidden="true" />
      <p className="font-display text-xl">{title}</p>
      {children && <div className="max-w-md text-mute">{children}</div>}
    </div>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("hairline inline-flex items-center rounded-full bg-white/[.03] px-3 py-1 text-xs text-mute", className)}>
      {children}
    </span>
  );
}

/** Small "Demo content" badge for seed records that haven't been replaced with real copy yet. */
export function DemoBadge({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wide text-gold">
      Demo content
    </span>
  );
}

/** Marks concept builds (reference solutions) so they are never mistaken for delivered client work. */
export function ConceptBadge({ show, className }: { show?: boolean; className?: string }) {
  if (!show) return null;
  return (
    <span className={cn("inline-flex items-center rounded-full border border-gold/40 bg-midnight/80 px-2.5 py-0.5 text-[0.68rem] font-medium tracking-wide text-gold backdrop-blur", className)}>
      Concept
    </span>
  );
}
