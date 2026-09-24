"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const LABELS = ["AI", "WEB", "MOBILE", "SOFTWARE", "AUTOMATION", "MARKETING", "DATA", "CLOUD"];
const C = 300; // centre of the 600×600 viewBox
const CHORDS: [number, number][] = [[0, 6], [0, 4], [1, 7], [2, 5], [3, 6], [4, 5]];

interface NodeSpec {
  label: string;
  angle: number;
  radius: number;
  phase: number;
  speed: number;
}

/**
 * The SparkWave "digital ecosystem": a hub linked to eight capability nodes. Nodes drift on slow
 * orbits, sparks travel the links, hovering a node lights up its connections, and the whole thing
 * parallaxes with the mouse. Positions update through refs in one rAF loop (no per-frame re-render).
 */
export function Ecosystem({ className }: { className?: string }) {
  const nodes = useMemo<NodeSpec[]>(
    () =>
      LABELS.map((label, i) => ({
        label,
        angle: (i / LABELS.length) * Math.PI * 2 - Math.PI / 2,
        radius: i % 2 ? 228 : 196,
        phase: i * 1.3,
        speed: 0.35 + (i % 3) * 0.08,
      })),
    [],
  );
  const links = useMemo(
    () => [...nodes.map((_, i) => [-1, i] as [number, number]), ...nodes.map((_, i) => [i, (i + 1) % nodes.length] as [number, number]), ...CHORDS],
    [nodes],
  );

  const [active, setActive] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const sparkRefs = useRef<(SVGCircleElement | null)[]>([]);
  const groupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = nodes.map(() => ({ x: C, y: C }));
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const place = (t: number) => {
      nodes.forEach((n, i) => {
        const wobble = reduce ? 0 : Math.sin(t * n.speed + n.phase);
        const a = n.angle + (reduce ? 0 : Math.sin(t * 0.12 + n.phase) * 0.06);
        const r = n.radius + wobble * 10;
        pos[i].x = C + Math.cos(a) * r;
        pos[i].y = C + Math.sin(a) * r;
        nodeRefs.current[i]?.setAttribute("transform", `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)})`);
      });
      links.forEach(([a, b], i) => {
        const p1 = a < 0 ? { x: C, y: C } : pos[a];
        const p2 = pos[b];
        const line = lineRefs.current[i];
        if (line) {
          line.setAttribute("x1", p1.x.toFixed(1));
          line.setAttribute("y1", p1.y.toFixed(1));
          line.setAttribute("x2", p2.x.toFixed(1));
          line.setAttribute("y2", p2.y.toFixed(1));
        }
        const spark = sparkRefs.current[i];
        if (spark) {
          const k = reduce ? 0.5 : ((t * (a < 0 ? 0.28 : 0.16) + i * 0.137) % 1);
          spark.setAttribute("cx", (p1.x + (p2.x - p1.x) * k).toFixed(1));
          spark.setAttribute("cy", (p1.y + (p2.y - p1.y) * k).toFixed(1));
          spark.setAttribute("opacity", reduce ? "0" : String(Math.sin(k * Math.PI).toFixed(2)));
        }
      });
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      groupRef.current?.setAttribute("transform", `translate(${(mouse.x * 18).toFixed(2)} ${(mouse.y * 18).toFixed(2)})`);
    };

    const loop = (now: number) => {
      if (visible) place((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    place(0);
    if (!reduce) raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
    };
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    if (svgRef.current) io.observe(svgRef.current);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [nodes, links]);

  const touches = (i: number, [a, b]: [number, number]) => active !== null && (a === i || b === i || (a < 0 && i === -1));

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 600"
      className={cn("h-auto w-full overflow-visible select-none", className)}
      role="img"
      aria-label="SparkWave connects AI, web, mobile, software, automation, marketing, data and cloud into one system"
    >
      <defs>
        <radialGradient id="eco-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#7C3AED" stopOpacity=".9" />
          <stop offset=".55" stopColor="#7C3AED" stopOpacity=".18" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="eco-line" x1="0" x2="1">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <filter id="eco-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g ref={groupRef}>
        {/* orbit rings */}
        {[120, 196, 228, 280].map((r, i) => (
          <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeDasharray={i % 2 ? "2 6" : undefined} />
        ))}
        <circle cx={C} cy={C} r="150" fill="url(#eco-core)" opacity=".55" />

        {links.map((link, i) => {
          const hot = active !== null && (link[0] === active || link[1] === active);
          return (
            <line
              key={`l${i}`}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              stroke={hot ? "url(#eco-line)" : "rgba(255,255,255,.10)"}
              strokeWidth={hot ? 1.6 : 1}
              strokeDasharray={link[0] < 0 ? undefined : "3 5"}
              className="transition-[stroke-width] duration-300"
              style={{ opacity: active !== null && !hot ? 0.35 : 1 }}
            />
          );
        })}
        {links.map((link, i) => (
          <circle
            key={`s${i}`}
            ref={(el) => {
              sparkRefs.current[i] = el;
            }}
            r={link[0] < 0 ? 2.6 : 1.8}
            fill={i % 3 === 0 ? "#F5B942" : "#22D3EE"}
            filter="url(#eco-glow)"
            style={{ opacity: active !== null && !touches(active, link) ? 0.15 : undefined }}
          />
        ))}

        {/* hub */}
        <g transform={`translate(${C} ${C})`}>
          <circle r="62" fill="#0D101A" stroke="url(#eco-line)" strokeWidth="1.2" />
          <circle r="74" fill="none" stroke="rgba(124,58,237,.35)" strokeDasharray="1 7" className="animate-spin-slow [transform-box:fill-box] [transform-origin:center]" />
          <text textAnchor="middle" y="4" fill="#F8FAFC" fontSize="13" fontWeight="600" letterSpacing="3.5" fontFamily="var(--font-grotesk)">
            SPARKWAVE
          </text>
          <text textAnchor="middle" y="22" fill="#94A3B8" fontSize="7.5" letterSpacing="2.5" fontFamily="var(--font-inter)">
            DIGITAL SYSTEMS
          </text>
        </g>

        {nodes.map((n, i) => {
          const hot = active === i;
          const w = n.label.length * 7.4 + 30;
          return (
            <g
              key={n.label}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              className="cursor-pointer"
              data-cursor="link"
            >
              <rect
                x={-w / 2}
                y="-17"
                width={w}
                height="34"
                rx="17"
                fill={hot ? "#1A1440" : "#111522"}
                stroke={hot ? "#22D3EE" : "rgba(255,255,255,.14)"}
                className="transition-colors duration-300"
              />
              <circle cx={-w / 2 + 14} r="3" fill={i % 3 === 0 ? "#F5B942" : i % 2 ? "#22D3EE" : "#A78BFA"} className="animate-pulse-soft" />
              <text x="6" y="4" textAnchor="middle" fill={hot ? "#F8FAFC" : "#CBD5E1"} fontSize="11" fontWeight="500" letterSpacing="1.6" fontFamily="var(--font-grotesk)">
                {n.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
