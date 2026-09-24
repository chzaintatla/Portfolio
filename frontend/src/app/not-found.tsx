import Link from "next/link";

import { Backdrop } from "@/components/sections/home/Backdrop";

export const metadata = { title: "Page not found", robots: { index: false } };

/** 404: a node that has drifted away from its network, with a broken, flickering link. */
export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 text-center">
      <Backdrop particles={16} />
      <div className="relative">
        <svg viewBox="0 0 320 140" className="mx-auto w-72" aria-hidden="true">
          <defs>
            <linearGradient id="nf" x1="0" x2="1">
              <stop offset="0" stopColor="#7C3AED" />
              <stop offset="1" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <line x1="60" y1="70" x2="140" y2="70" stroke="url(#nf)" strokeWidth="2" />
          <line x1="175" y1="70" x2="255" y2="70" stroke="#F5B942" strokeWidth="2" strokeDasharray="4 6" className="animate-pulse-soft" />
          <circle cx="50" cy="70" r="14" fill="#111522" stroke="url(#nf)" strokeWidth="2" />
          <circle cx="50" cy="70" r="4" fill="#22D3EE" />
          <circle cx="146" cy="70" r="3" fill="#7C3AED" />
          <path d="M158 58 l-6 12 h8 l-6 12" fill="none" stroke="#F5B942" strokeWidth="2" className="animate-pulse-soft" />
          <g className="animate-float">
            <circle cx="270" cy="70" r="16" fill="#111522" stroke="rgba(255,255,255,.25)" strokeWidth="2" strokeDasharray="3 4" />
            <circle cx="270" cy="70" r="4" fill="#64748B" />
          </g>
        </svg>
        <p className="eyebrow mt-8">Error 404</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] font-bold tracking-tight">
          THIS SPARK DIDN&apos;T <span className="text-gradient">CONNECT.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-mute">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="mt-10 inline-flex rounded-full bg-ink px-7 py-3.5 font-medium text-midnight transition-colors hover:bg-white">
          Back Home
        </Link>
      </div>
    </main>
  );
}
