"use client";

import { CalendarPlus, Lightbulb, PenLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { adminApi } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

import { Card } from "./ui";

interface Day {
  date: string;
  posts: { id: number; title: string; status: string }[];
}

const localIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Daily publishing planner shown on Admin → Blog: the last week and next two weeks, which days have a
 * post (published / scheduled / draft), one-click "write for this day", and rotating topic ideas.
 */
export function BlogPlanner() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    adminApi.get<Day[]>("/api/admin/blog/calendar?back=7&ahead=14").then(setDays).catch(() => setDays([]));
    adminApi
      .get<{ key: string; value: unknown }[]>("/api/admin/settings")
      .then((rows) => {
        const v = rows.find((r) => r.key === "blog_topics")?.value;
        setTopics(Array.isArray(v) ? (v as string[]) : []);
      })
      .catch(() => undefined);
  }, []);

  const today = localIso(new Date());
  const todays = days?.find((d) => d.date === today);
  const streak = (() => {
    if (!days) return 0;
    let n = 0;
    for (const d of [...days].reverse().filter((x) => x.date <= today)) {
      if (d.posts.some((p) => p.status !== "draft")) n++;
      else break;
    }
    return n;
  })();
  // Rotate suggestions daily.
  const offset = new Date().getDate() % Math.max(1, topics.length);
  const ideas = [...topics.slice(offset), ...topics.slice(0, offset)].slice(0, 6);

  return (
    <Card className="mb-6" title="Daily publishing planner" action={
      <Link href={`/admin/blog/new?date=${today}`} className="inline-flex items-center gap-2 rounded-xl bg-ink px-3.5 py-2 text-sm font-medium text-midnight hover:bg-white">
        <PenLine className="h-4 w-4" /> {todays?.posts.length ? "Write another for today" : "Write today’s post"}
      </Link>
    }>
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-mute">
        <span><b className="text-ink">{streak}</b>-day publishing streak</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-400" /> Published</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-aqua" /> Scheduled</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-gold" /> Draft</span>
      </div>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-2">
        {(days ?? Array.from({ length: 22 }, (_, i) => ({ date: String(i), posts: [] }))).map((d) => {
          const isToday = d.date === today;
          const past = d.date < today;
          const first = d.posts[0];
          const date = new Date(`${d.date}T12:00:00`);
          const valid = !Number.isNaN(date.getTime());
          return (
            <Link
              key={d.date}
              href={first ? `/admin/blog/${first.id}` : `/admin/blog/new?date=${d.date}`}
              title={first ? d.posts.map((p) => `${p.title} (${p.status})`).join("\n") : `Plan a post for ${d.date}`}
              className={cn(
                "group flex w-[4.25rem] shrink-0 flex-col items-center rounded-xl border px-1 py-2.5 transition-colors",
                isToday ? "border-aqua/60 bg-aqua/10" : "border-line hover:border-line-hi",
                past && !first && "opacity-50",
              )}
            >
              <span className="text-[0.62rem] tracking-widest text-dim uppercase">{valid ? date.toLocaleDateString("en", { weekday: "short" }) : "·"}</span>
              <span className="font-display text-lg font-semibold">{valid ? date.getDate() : ""}</span>
              <span className="mt-1 flex h-2 gap-0.5">
                {d.posts.slice(0, 3).map((p) => (
                  <i key={p.id} className={cn("h-2 w-2 rounded-full", p.status === "published" ? "bg-emerald-400" : p.status === "scheduled" ? "bg-aqua" : "bg-gold")} />
                ))}
                {!d.posts.length && <CalendarPlus className="h-3 w-3 text-dim opacity-0 transition-opacity group-hover:opacity-100" />}
              </span>
            </Link>
          );
        })}
      </div>
      {ideas.length > 0 && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs text-mute"><Lightbulb className="h-3.5 w-3.5 text-gold" /> Topic ideas for today (edit the list in Settings → Blog topics)</p>
          <div className="flex flex-wrap gap-1.5">
            {ideas.map((t) => (
              <Link key={t} href={`/admin/blog/new?date=${today}&title=${encodeURIComponent(t)}`} className="rounded-full border border-line px-3 py-1 text-xs text-ink/85 hover:border-aqua/50 hover:text-ink">
                {t}
              </Link>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
