"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { EASE } from "@/animations/variants";
import { Logo } from "@/components/ui/Logo";

import type { NavItem } from "./nav";

/** Full-screen mobile menu with staggered links, focus trap and Escape to close. */
export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const links = [...items.map(({ label, href }) => ({ label, href })), { label: "Contact", href: "/contact" }];

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("a")?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panel.current) return;
      const focusables = panel.current.querySelectorAll<HTMLElement>("a, button");
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/[.03]"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
      >
        <span className="relative block h-3 w-5" aria-hidden="true">
          <span className="absolute top-0 left-0 h-px w-5 bg-ink" />
          <span className="absolute top-3 left-0 h-px w-5 bg-ink" />
        </span>
      </button>

      {typeof document !== "undefined" && createPortal(<AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "circle(0% at calc(100% - 42px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 42px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 42px) 36px)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-night px-6 pb-10"
          >
            <div className="relative flex h-[72px] shrink-0 items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/[.03]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="h-8 shrink-0" />
            <div aria-hidden="true" className="bg-grid mask-radial pointer-events-none absolute inset-0 opacity-60" />
            <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet/30 blur-[120px]" />
            <motion.ul
              className="relative flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
            >
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
                  className="border-b border-line"
                >
                  <Link href={l.href} className="flex items-center justify-between py-4 font-display text-[2rem] leading-none font-medium tracking-tight">
                    <span>
                      <span className="mr-4 align-top text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                      {l.label}
                    </span>
                    <ArrowUpRight className="h-6 w-6 text-mute" aria-hidden="true" />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }} className="relative mt-auto pt-10">
              <Link href="/contact" className="block rounded-full bg-ink py-4 text-center font-medium text-midnight">
                Start a Project
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  );
}
