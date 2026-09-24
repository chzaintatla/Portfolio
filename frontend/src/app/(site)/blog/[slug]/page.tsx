import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { Backdrop } from "@/components/sections/home/Backdrop";
import { PostCard } from "@/components/sections/PostCard";
import { ReadingProgress } from "@/components/sections/ReadingProgress";
import { ViewTracker } from "@/components/sections/ViewTracker";
import { CmsImage } from "@/components/ui/misc";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { api } from "@/lib/api";
import { jsonLd, recordMetadata } from "@/lib/seo";
import { absoluteUrl, formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await api.post(slug);
  if (!post) return { title: "Article not found" };
  return recordMetadata(`/blog/${slug}`, post, {
    title: post.title,
    description: post.excerpt,
    image: post.og_image || post.featured_image,
    type: "article",
    publishedTime: post.published_at,
  });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, related, site] = await Promise.all([api.post(slug), api.relatedPosts(slug), api.site()]);
  if (!post) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image ? absoluteUrl(post.featured_image) : undefined,
    datePublished: post.published_at,
    author: { "@type": "Organization", name: post.author_name || "SparkWave Digital Systems" },
    publisher: { "@type": "Organization", name: "SparkWave Digital Systems" },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.map((t) => t.name).join(", "),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <ReadingProgress />
      <ViewTracker type="blog" slug={post.slug} />
      <header className="relative isolate overflow-hidden pt-36 pb-14 md:pt-44">
        <Backdrop particles={10} />
        <div className="container-x relative max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-dim">
            <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/blog" className="hover:text-ink">Insights</Link>
            {post.category && <> / <Link href={`/blog?category=${post.category.slug}`} className="hover:text-ink">{post.category.name}</Link></>}
          </nav>
          <div className="flex flex-wrap items-center gap-3 text-sm text-mute">
            {post.category && <span className="text-aqua">{post.category.name}</span>}
            <span>·</span>
            <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at, { dateStyle: "long" })}</time>
            <span>·</span>
            <span>{post.reading_minutes} min read</span>
          </div>
          <SplitHeading as="h1" immediate text={post.title} className="mt-6 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] font-semibold" />
          {post.excerpt && <p className="mt-6 text-lg text-mute md:text-xl">{post.excerpt}</p>}
          {post.author_name && <p className="mt-8 text-sm text-dim">By <span className="text-ink">{post.author_name}</span></p>}
        </div>
      </header>

      {post.featured_image && (
        <div className="container-x max-w-5xl">
          <div className="hairline relative aspect-[16/8] overflow-hidden rounded-3xl">
            <CmsImage src={post.featured_image} alt="" fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
          </div>
        </div>
      )}

      <div className="container-x max-w-3xl py-16">
        <div className="prose-spark" dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.tags.length > 0 && (
          <ul className="mt-14 flex flex-wrap gap-2 border-t border-line pt-8" aria-label="Tags">
            {post.tags.map((t) => <li key={t.id} className="hairline rounded-full px-3 py-1 text-xs text-mute">#{t.name}</li>)}
          </ul>
        )}
      </div>

      {related.length > 0 && (
        <section className="container-x pb-24" aria-labelledby="rel">
          <h2 id="rel" className="eyebrow mb-10">Keep reading</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}
      <FinalCTA settings={site.settings} />
    </article>
  );
}
