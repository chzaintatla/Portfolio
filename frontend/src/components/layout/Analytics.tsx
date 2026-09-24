"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

import { track } from "@/lib/track";

/** GA4 + Meta Pixel (only when IDs are configured in Admin → Settings) and first-party page views. */
export function Analytics({ gaId, pixelId }: { gaId?: string; pixelId?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    track("page_view");
    window.gtag?.("event", "page_view", { page_path: pathname });
    window.fbq?.("track", "PageView");
  }, [pathname]);

  const safeGa = gaId && /^G-[A-Z0-9]+$/.test(gaId) ? gaId : undefined;
  const safePixel = pixelId && /^\d+$/.test(pixelId) ? pixelId : undefined;

  return (
    <>
      {safeGa && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${safeGa}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${safeGa}',{send_page_view:false});`}
          </Script>
        </>
      )}
      {safePixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${safePixel}');`}
        </Script>
      )}
    </>
  );
}
