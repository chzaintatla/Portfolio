"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

import { EASE } from "@/animations/variants";
import { CmsImage } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import type { BlogPostCard, DailyGroup } from "@/types";

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

function dayLabel(iso: string) {
  const today = dayKey(new Date());
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (iso === today) return "Today";
  if (iso === dayKey(y)) return "Yesterday";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" });
}

/** Large "today's read" card with an image reveal. */
export function TodaysPick({ post, iso }: { post: BlogPostCard; iso: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      <Link href={`/blog/${post.slug}`} data-cursor="view" className="group hairline grid overflow-hidden rounded-[2rem] bg-card/70 md:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[22rem]">
          {post.featured_image && (
            <motion.div className="absolute inset-0" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: EASE }}>
              <CmsImage src={post.featured_image} alt="" fill priority sizes="(min-width: 768px) 55vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-spark group-hover:scale-105" />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 to-transparent md:bg-gradient-to-r md:from-transparent md:to-card/80" />
          <span suppressHydrationWarning className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-midnight">
            <CalendarDays className="h-3.5 w-3.5" /> {dayLabel(iso)}&apos;s insight
          </span>
        </div>
        <div className="flex flex-col justify-center p-7 md:p-10">
          {post.category && <p className="eyebrow !text-aqua">{post.category.name}</p>}
          <h2 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight transition-colors group-hover:text-aqua md:text-4xl">{post.title}</h2>
          {post.excerpt && <p className="mt-4 text-mute">{post.excerpt}</p>}
          <p className="mt-6 flex items-center gap-4 text-sm text-dim">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.reading_minutes} min read</span>
            {post.author_name && <span>By {post.author_name}</span>}
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink">
            Read today&apos;s article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Daily feed: a two-week date strip (days with posts glow) and the articles for the selected day.
 */
const noop = () => () => {};

export function DailyTimeline({ groups }: { groups: DailyGroup[] }) {
  // Dates depend on the viewer's timezone, so the strip renders only on the client.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const days = useMemo(() => {
    const out: { iso: string; d: Date }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push({ iso: dayKey(d), d });
    }
    return out;
  }, []);
  const byDay = useMemo(() => new Map(groups.map((g) => [g.date, g.posts])), [groups]);
  const [active, setActive] = useState(groups[0]?.date ?? days[0].iso);
  const posts = byDay.get(active) ?? [];
  if (!mounted) return <div className="mt-16 h-72 animate-pulse rounded-3xl bg-white/[.03]" aria-hidden="true" />;

  return (
    <section aria-labelledby="daily-h" className="mt-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Daily feed</p>
          <h2 id="daily-h" className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">A new idea, every day.</h2>
        </div>
        <p className="text-sm text-mute">{groups.reduce((n, g) => n + g.posts.length, 0)} articles in the last two weeks</p>
      </div>

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2" role="tablist" aria-label="Choose a day">
        {days.map(({ iso, d }, i) => {
          const has = byDay.has(iso);
          const on = iso === active;
          return (
            <motion.button
              key={iso}
              type="button"
              role="tab"
              aria-selected={on}
              disabled={!has}
              onClick={() => setActive(iso)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              className={cn(
                "relative flex w-16 shrink-0 flex-col items-center rounded-2xl border py-3 transition-colors",
                on ? "border-aqua/60 bg-aqua/10" : has ? "border-line hover:border-line-hi" : "border-line/50 opacity-40",
              )}
            >
              <span className="text-[0.65rem] tracking-widest text-dim uppercase">{d.toLocaleDateString("en", { weekday: "short" })}</span>
              <span className="mt-1 font-display text-xl font-semibold">{d.getDate()}</span>
              <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full", has ? "bg-gold shadow-[0_0_8px_rgba(245,185,66,.8)]" : "bg-transparent")} />
              {on && <motion.span layoutId="day-glow" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-aqua" />}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6" aria-live="polite">
        <p className="mb-4 text-sm text-mute">{dayLabel(active)}</p>
        <AnimatePresence mode="wait">
          <motion.ul
            key={active}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="space-y-3"
          >
            {posts.length === 0 && <li className="text-mute">No article on this day.</li>}
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`} className="group hairline flex items-center gap-5 rounded-2xl bg-card/60 p-3 pr-5 transition-colors hover:border-line-hi hover:bg-card">
                  <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-night">
                    {p.featured_image && <CmsImage src={p.featured_image} alt="" fill sizes="112px" className="object-cover transition-transform duration-700 group-hover:scale-110" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-xs text-aqua">{p.category?.name}</span>
                    <span className="mt-1 block truncate font-display text-lg font-semibold group-hover:text-aqua">{p.title}</span>
                    <span className="mt-0.5 block truncate text-sm text-mute">{p.excerpt}</span>
                  </span>
                  <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-dim transition-all group-hover:rotate-45 group-hover:text-aqua sm:block" />
                </Link>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}
