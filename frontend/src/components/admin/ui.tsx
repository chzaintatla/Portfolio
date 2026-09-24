"use client";

import { Loader2, X } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes, useEffect } from "react";

import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-xl border border-line bg-night px-3.5 py-2.5 text-sm text-ink placeholder:text-dim focus:border-aqua/60 focus:outline-none disabled:opacity-60";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cn(inputCls, className)} {...p} />;
});

export function Textarea({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputCls, "min-h-24 resize-y", className)} {...p} />;
}

export function Select({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputCls, className)} {...p}>{children}</select>;
}

type BtnVariant = "primary" | "secondary" | "danger" | "ghost";
export function Btn({ variant = "secondary", loading, className, children, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; loading?: boolean }) {
  const v = {
    primary: "bg-ink text-midnight hover:bg-white",
    secondary: "border border-line bg-white/[.03] hover:border-line-hi",
    danger: "border border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20",
    ghost: "text-mute hover:text-ink",
  }[variant];
  return (
    <button className={cn("inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50", v, className)} disabled={loading || p.disabled} {...p}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Label({ children, hint, htmlFor }: { children: ReactNode; hint?: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium tracking-wide text-mute">
      {children}
      {hint && <span className="ml-2 font-normal text-dim">{hint}</span>}
    </label>
  );
}

export function Card({ children, className, title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={cn("hairline rounded-2xl bg-card/70 p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-mute">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "green" | "amber" | "red" | "blue" | "violet" }) {
  const t = {
    default: "bg-white/[.06] text-mute",
    green: "bg-emerald-400/10 text-emerald-300",
    amber: "bg-gold/10 text-gold",
    red: "bg-red-400/10 text-red-300",
    blue: "bg-aqua/10 text-aqua",
    violet: "bg-violet/20 text-violet-soft",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-medium", t)}>{children}</span>;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-white/[.06]", className)} />;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-sm text-mute">{children}</div>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="inline-flex items-center gap-2.5 text-sm">
      <span className={cn("relative h-5 w-9 rounded-full transition-colors", checked ? "bg-aqua" : "bg-white/15")}>
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all", checked ? "left-[18px]" : "left-0.5")} />
      </span>
      {label}
    </button>
  );
}

export function Drawer({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className={cn("flex h-full w-full flex-col border-l border-line bg-night", wide ? "max-w-4xl" : "max-w-xl")} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-mute hover:bg-white/5 hover:text-ink"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function confirmDelete(what: string) {
  return window.confirm(`Delete ${what}? This cannot be undone.`);
}
