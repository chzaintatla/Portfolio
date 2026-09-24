"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-6xl">We hit a loose wire.</h1>
      <p className="mt-4 max-w-md text-mute">The page failed to load. Try again, or head back home.</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="outline">Back Home</Button>
      </div>
    </section>
  );
}
