"use client";

import { useEffect } from "react";

import { track } from "@/lib/track";

/** Records a view of a CMS entity (feeds "popular projects/services" in the admin dashboard). */
export function ViewTracker({ type, slug }: { type: "project" | "service" | "blog"; slug: string }) {
  useEffect(() => {
    track("entity_view", { type }, { type, slug });
  }, [type, slug]);
  return null;
}
