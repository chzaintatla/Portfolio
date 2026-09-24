import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CmsImage } from "@/components/ui/misc";
import { cn, formatDate } from "@/lib/utils";
import type { BlogPostCard } from "@/types";

const DAY = 86_400_000;

export function PostCard({ post, featured = false }: { post: BlogPostCard; featured?: boolean }) {
  // Rendered on the server, so the timestamp is stable for hydration.
  // eslint-disable-next-line react-hooks/purity
  const fresh = post.published_at ? Date.now() - new Date(post.published_at).getTime() < 1.5 * DAY : false;
  return (
    <Link href={`/blog/${post.slug}`} data-cursor="view" className={cn("group flex h-full flex-col", featured && "md:col-span-2")}>
      <div className={cn("hairline relative overflow-hidden rounded-3xl bg-card", featured ? "aspect-[16/8]" : "aspect-[16/10]")}>
        {post.featured_image ? (
          <CmsImage src={post.featured_image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-spark group-hover:scale-105" />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(80%_120%_at_100%_0%,rgba(124,58,237,.35),transparent_60%),radial-gradient(60%_80%_at_0%_100%,rgba(34,211,238,.18),transparent_60%)] transition-transform duration-[1.2s] ease-spark group-hover:scale-110">
            <div className="bg-grid absolute inset-0 opacity-40" />
            <span className="absolute bottom-4 left-5 font-display text-5xl font-bold text-white/[.07]">{post.category?.name}</span>
          </div>
        )}
        {fresh && <span className="absolute top-4 left-4 rounded-full bg-gold px-2.5 py-0.5 text-[0.7rem] font-semibold text-midnight">New today</span>}
        <span className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-midnight/70 opacity-0 backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs text-mute">
        {post.category && <span className="text-aqua">{post.category.name}</span>}
        <span className="text-dim">·</span>
        <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
        <span className="text-dim">·</span>
        <span>{post.reading_minutes} min read</span>
      </div>
      <h3 className={cn("mt-3 font-display font-semibold tracking-tight transition-colors group-hover:text-aqua", featured ? "text-3xl" : "text-xl")}>
        {post.title}
      </h3>
      {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-mute">{post.excerpt}</p>}
    </Link>
  );
}
