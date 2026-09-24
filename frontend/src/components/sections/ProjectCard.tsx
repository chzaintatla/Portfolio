import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ConceptBadge } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import type { ProjectCard as Project } from "@/types";

import { ProjectVisual } from "./ProjectVisual";

export function ProjectCard({ project, index, className, large = false }: {
  project: Project; index?: number; className?: string; large?: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="view"
      className={cn("group hairline relative flex flex-col overflow-hidden rounded-[1.75rem] bg-card/70 transition-colors duration-500 hover:border-line-hi", className)}
    >
      <ConceptBadge show={project.is_demo} className="absolute top-4 left-4 z-10" />
      <ProjectVisual
        title={project.title}
        image={project.thumbnail}
        accent={project.accent}
        category={project.category}
        className={cn("w-full", large ? "aspect-[16/9]" : "aspect-[4/3]")}
      />
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-mute">
          {index !== undefined && <span className="text-dim tabular-nums">{String(index + 1).padStart(2, "0")}</span>}
          {project.category && <span>{project.category}</span>}
          {project.industry && (
            <>
              <span className="text-dim">·</span>
              <span>{project.industry}</span>
            </>
          )}
          {project.platforms?.length > 0 && (
            <span className="ml-auto flex gap-1">
              {project.platforms.map((p) => (
                <span key={p} className="rounded-full border border-line px-2 py-0.5 text-[0.65rem] tracking-wide uppercase">{p}</span>
              ))}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-4">
          <h3 className={cn("font-display font-semibold tracking-tight", large ? "text-3xl md:text-4xl" : "text-2xl")}>{project.title}</h3>
          <span className="hairline flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-45 group-hover:border-aqua/60 group-hover:bg-aqua/10">
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        {project.short_description && <p className="text-mute">{project.short_description}</p>}
        {project.technologies.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Technologies">
            {project.technologies.slice(0, 5).map((t) => (
              <li key={t.id} className="rounded-full bg-white/[.04] px-2.5 py-1 text-[0.72rem] text-mute">{t.name}</li>
            ))}
          </ul>
        )}
        <span className="sr-only">View case study</span>
      </div>
    </Link>
  );
}
