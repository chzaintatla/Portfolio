import { PageHero } from "@/components/sections/PageHero";

/** Legal copy is editable in Admin → Settings (`privacy_html`, `terms_html`); this is the fallback. */
export function LegalPage({ title, path, html, fallback }: { title: string; path: string; html?: unknown; fallback: string }) {
  return (
    <>
      <PageHero title={title} crumbs={[{ label: title, href: path }]} />
      <div className="container-x max-w-3xl pb-28">
        <div className="prose-spark" dangerouslySetInnerHTML={{ __html: typeof html === "string" && html ? html : fallback }} />
      </div>
    </>
  );
}
