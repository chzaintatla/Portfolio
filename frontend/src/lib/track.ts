"use client";

type Props = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function sessionId() {
  try {
    let id = sessionStorage.getItem("sw_sid");
    if (!id) {
      id = crypto.randomUUID().replace(/-/g, "");
      sessionStorage.setItem("sw_sid", id);
    }
    return id;
  } catch {
    return undefined;
  }
}

/**
 * Sends an event to the first-party analytics endpoint (feeds the admin dashboard) and mirrors it to
 * GA4 / Meta Pixel when those are configured. Never throws.
 */
export function track(name: string, props: Props = {}, entity?: { type: string; slug: string }) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    name,
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    session_id: sessionId(),
    entity_type: entity?.type,
    entity_slug: entity?.slug,
    props,
  });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
    else void fetch("/api/events", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
  } catch {
    /* analytics must never break the page */
  }
  window.gtag?.("event", name, props);
  if (name === "lead_submit") window.fbq?.("track", "Lead", props);
}
