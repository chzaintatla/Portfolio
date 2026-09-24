import Link from "next/link";

import { DailyTimeline, TodaysPick } from "@/components/sections/DailyInsights";
import { PageHero } from "@/components/sections/PageHero";
import { PostCard } from "@/components/sections/PostCard";
import { EmptyState } from "@/components/ui/misc";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const generateMetadata = () =>
  pageMetadata("/blog", { title: "Insights — Ideas, Technology & Growth", description: "Articles on AI, software development, automation, design and digital growth." });

const PAGE_SIZE = 9;

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : "";
  const page = Math.max(1, Number(sp.page) || 1);
  const q = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
  if (category) q.set("category", category);
  const front = page === 1 && !category;
  const [data, categories, daily] = await Promise.all([api.blog(`?${q}`), api.blogCategories(), front ? api.blogDaily(14) : Promise.resolve([])]);
  const today = daily[0];
  const pages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const href = (p: number, c = category) => {
    const u = new URLSearchParams();
    if (c) u.set("category", c);
    if (p > 1) u.set("page", String(p));
    const s = u.toString();
    return s ? `/blog?${s}` : "/blog";
  };

  return (
    <>
      <PageHero
        eyebrow="Daily insights"
        title="Ideas, technology & *growth.*"
        intro="A new practical article every day on AI, software, automation, design and digital growth — for people who make decisions about technology."
        crumbs={[{ label: "Insights", href: "/blog" }]}
      />
      {front && today && (
        <section className="container-x pb-20">
          <TodaysPick post={today.posts[0]} iso={today.date} />
          <DailyTimeline groups={daily} />
        </section>
      )}
      <section className="container-x pb-28" id="archive">
        {front && <h2 className="mb-6 font-display text-3xl font-semibold tracking-tight">Browse by topic</h2>}
        <nav aria-label="Categories" className="no-scrollbar -mx-5 mb-12 flex gap-2 overflow-x-auto px-5">
          {[{ name: "All", slug: "", count: undefined }, ...categories.filter((c) => c.count)].map((c) => (
            <Link
              key={c.slug || "all"}
              href={href(1, c.slug)}
              aria-current={category === c.slug ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                category === c.slug ? "border-aqua/50 bg-aqua/10 text-ink" : "border-line text-mute hover:text-ink",
              )}
            >
              {c.name}
              {c.count ? <span className="ml-1.5 text-xs text-dim">{c.count}</span> : null}
            </Link>
          ))}
        </nav>

        {data.items.length === 0 ? (
          <EmptyState title="No articles yet">New articles are on the way.</EmptyState>
        ) : (
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-3">
            {data.items.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={href(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn("flex h-10 w-10 items-center justify-center rounded-full border text-sm", p === page ? "border-aqua/50 bg-aqua/10" : "border-line text-mute hover:text-ink")}
              >
                {p}
              </Link>
            ))}
          </nav>
        )}
      </section>
    </>
  );
}
