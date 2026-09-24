"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { EASE } from "@/animations/variants";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

import { MobileMenu } from "./MobileMenu";
import type { NavItem } from "./nav";

export function Navbar({ items }: { items: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on route change. Syncing UI to navigation is the intent here.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(null), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-b border-line bg-midnight/70 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-midnight">
        Skip to content
      </a>
      <nav className="container-x flex h-[72px] items-center justify-between" aria-label="Main">
        <Link href="/" aria-label="SparkWave Digital Systems — home" className="shrink-0">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children?.length && setOpen(item.label)}
              onMouseLeave={() => setOpen(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "group relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.92rem] text-mute transition-colors hover:text-ink",
                  isActive(item.href) && "text-ink",
                )}
                aria-expanded={item.children?.length ? open === item.label : undefined}
                onFocus={() => item.children?.length && setOpen(item.label)}
              >
                {item.label}
                {!!item.children?.length && (
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open === item.label && "rotate-180")} aria-hidden="true" />
                )}
                <span
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-violet to-aqua transition-transform duration-500 ease-spark group-hover:scale-x-100",
                    isActive(item.href) && "scale-x-100",
                  )}
                  aria-hidden="true"
                />
              </Link>
              <AnimatePresence>
                {open === item.label && !!item.children?.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="absolute top-full left-0 pt-3"
                  >
                    <ul className="hairline w-72 rounded-2xl bg-night/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className="block rounded-xl px-4 py-2.5 text-sm text-mute transition-colors hover:bg-white/[.04] hover:text-ink focus:bg-white/[.04] focus:text-ink"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/contact" className="px-5 py-2.5 text-sm" trackLabel="nav_lets_talk">
            Let&apos;s Talk
          </Button>
        </div>
        <MobileMenu items={items} />
      </nav>
    </header>
  );
}
