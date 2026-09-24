"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AXIS = { stroke: "#64748B", fontSize: 11, tickLine: false, axisLine: false } as const;
const TIP = {
  contentStyle: { background: "#111522", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, fontSize: 12 },
  labelStyle: { color: "#94A3B8" },
  itemStyle: { color: "#F8FAFC" },
  cursor: { fill: "rgba(255,255,255,.04)" },
};

const short = (d: string) => new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" });

export function TrendChart({ data, color = "#22D3EE", name }: { data: { date: string; count: number }[]; color?: string; name: string }) {
  if (!data.length) return <p className="flex h-56 items-center justify-center text-sm text-dim">No data in this period yet.</p>;
  const id = `g-${name.replace(/\W/g, "")}`;
  return (
    <ResponsiveContainer width="100%" height={224}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity={0.35} />
            <stop offset="1" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false} />
        <XAxis dataKey="date" tickFormatter={short} {...AXIS} minTickGap={24} />
        <YAxis allowDecimals={false} {...AXIS} />
        <Tooltip {...TIP} labelFormatter={(l) => short(String(l))} />
        <Area type="monotone" dataKey="count" name={name} stroke={color} strokeWidth={2} fill={`url(#${id})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const PALETTE = ["#7C3AED", "#22D3EE", "#F5B942", "#A78BFA", "#34D399", "#F472B6"];

export function BarsChart({ data, xKey, yKey, name, horizontal }: {
  data: Record<string, string | number>[]; xKey: string; yKey: string; name: string; horizontal?: boolean;
}) {
  if (!data.length) return <p className="flex h-56 items-center justify-center text-sm text-dim">No data yet.</p>;
  return (
    <ResponsiveContainer width="100%" height={Math.max(224, horizontal ? data.length * 36 : 224)}>
      <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 8, right: 8, left: horizontal ? 8 : -20, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,.05)" horizontal={!horizontal} vertical={!!horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" allowDecimals={false} {...AXIS} />
            <YAxis type="category" dataKey={xKey} width={120} {...AXIS} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} {...AXIS} />
            <YAxis allowDecimals={false} {...AXIS} />
          </>
        )}
        <Tooltip {...TIP} />
        <Bar dataKey={yKey} name={name} radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
