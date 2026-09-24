"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { EASE } from "@/animations/variants";
import { EmptyState } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import type { ProjectCard as Project } from "@/types";

import { ProjectCard } from "./ProjectCard";

export function WorkGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[]))],
    [projects],
  );
  const [filter, setFilter] = useState("All");
  const [kind, setKind] = useState<"all" | "shipped" | "concept">("all");
  const shown = projects.filter(
    (p) => (filter === "All" || p.category === filter) && (kind === "all" || (kind === "concept") === p.is_demo),
  );
  const count = (k: typeof kind) => projects.filter((p) => k === "all" || (k === "concept") === p.is_demo).length;

  if (!projects.length) return <EmptyState title="Case studies coming soon">We&apos;re preparing detailed write-ups of recent work.</EmptyState>;

  return (
    <>
      <div className="mb-4 inline-flex rounded-full border border-line p-1" role="group" aria-label="Filter by type">
        {([["all", "All work"], ["shipped", "Shipped products"], ["concept", "Concept builds"]] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={cn("rounded-full px-4 py-1.5 text-sm transition-colors", kind === k ? "bg-ink text-midnight" : "text-mute hover:text-ink")}
          >
            {label} <span className="text-xs opacity-60">{count(k)}</span>
          </button>
        ))}
      </div>
      <div className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
              filter === c ? "border-aqua/50 bg-aqua/10 text-ink" : "border-line text-mute hover:text-ink",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      {shown.length === 0 && <p className="text-mute">No projects match these filters.</p>}
      <motion.div layout className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <ProjectCard project={p} index={i} large className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
