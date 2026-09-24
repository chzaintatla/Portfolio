import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BlogPostCard } from "@/types";

import { PostCard } from "../PostCard";

export function Insights({ posts }: { posts: BlogPostCard[] }) {
  if (!posts.length) return null;
  return (
    <section className="relative py-28 md:py-36" aria-labelledby="insights-title">
      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div id="insights-title">
            <SectionHeading eyebrow="Daily insights" title="Ideas, technology & *growth.*" intro="A new article every day — practical thinking on AI, software, automation and growth." />
          </div>
          <Button href="/blog" variant="outline" className="shrink-0">All articles</Button>
        </div>
        <RevealGroup className="grid gap-x-6 gap-y-12 md:grid-cols-3" step={0.1}>
          {posts.map((p) => (
            <RevealItem key={p.id}>
              <PostCard post={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
