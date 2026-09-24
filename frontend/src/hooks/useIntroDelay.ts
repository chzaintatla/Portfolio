"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Seconds to hold hero animations so they play after the first-visit intro overlay lifts. */
export function useIntroDelay() {
  return useSyncExternalStore(
    noop,
    () => (document.documentElement.dataset.intro === "skip" ? 0 : 1.05),
    () => 0,
  );
}
