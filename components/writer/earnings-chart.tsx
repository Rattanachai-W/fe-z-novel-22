"use client";

import { useMemo, useState } from "react";

type DataPoint = {
  label: string;
  value: number; // Stored as Gold Coins
};

type EarningsChartProps = {
  data?: DataPoint[];
  height?: number;
  selectedMonth?: string; // e.g. "2026-04"
};

export function EarningsChart({ data: propData, height = 280, selectedMonth }: EarningsChartProps) {
  const [unit, setUnit] = useState<"coin" | "baht">("baht");

  // Generate an entire month's worth of data if none provided
  const data = useMemo(() => {
    if (propData && propData.length > 0) return propData;

    const [year, month] = (selectedMonth || new Date().toISOString().slice(0, 7))
      .split("-")
      .map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    const monthlyData = [];
    for (let i = 1; i <= daysInMonth; i++) {
      monthlyData.push({
        label: i.toString(),
        value: Math.floor(Math.random() * 600) + 50,
      });
    }
    return monthlyData;
  }, [propData, selectedMonth]);

  // Conversion logic: 10 coins = 1 baht
  const displayData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      displayValue: unit === "baht" ? d.value / 10 : d.value,
    }));
  }, [data, unit]);

  const max = Math.max(...displayData.map((d) => d.displayValue), 10) * 1.2;
  const min = 0;
  const range = max - min;

  const points = useMemo(() => {
    const width = 1000; // Conceptual width
    const stepX = width / (displayData.length - 1);

    return displayData.map((d, i) => {
      const x = i * stepX;
      const y = height - ((d.displayValue - min) / range) * height;
      return { x, y, value: d.displayValue, label: d.label };
    });
  }, [displayData, height, range]);

  // Generate SVG path for area and line using smooth curves
  const linePath = useMemo(() => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      path += ` C ${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`;
    }

    return path;
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length < 2) return "";
    return `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;
  }, [linePath, points, height]);

  // Deciding which days to show on X-axis (e.g. 1, 5, 10, 15, 20, 25, end)
  const xLabels = useMemo(() => {
    const total = data.length;
    return data
      .map((d, i) => {
        const dayNum = Number(d.label);
        if (dayNum === 1 || dayNum % 5 === 0 || dayNum === total) {
          return { label: d.label, index: i };
        }
        return null;
      })
      .filter(Boolean) as { label: string; index: number }[];
  }, [data]);

  return (
    <div className="relative w-full rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-strong)]">
            สถิติรายได้รายเดือน
          </h3>
          <p className="text-xs text-[var(--color-muted)]">
            รายได้ทั้งเดือนเดือน {selectedMonth || "ปัจจุบัน"} ({unit === "coin" ? "Gold Coins" : "บาท"})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-muted)] rounded-xl border border-[var(--color-border)]">
            <button
              onClick={() => setUnit("baht")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                unit === "baht"
                  ? "bg-[var(--color-brand)] text-white shadow-sm"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
              }`}
            >
              บาท (THB)
            </button>
            <button
              onClick={() => setUnit("coin")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                unit === "coin"
                  ? "bg-[var(--color-brand)] text-white shadow-sm"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
              }`}
            >
              Gold Coins
            </button>
          </div>

          <div className="hidden items-center gap-1.5 sm:flex">
            <div className="h-3 w-3 rounded-full bg-[var(--color-brand)]"></div>
            <span className="text-xs font-medium">
              รายได้ {unit === "coin" ? "Gold" : "บาท"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 1000 ${height}`}
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1="0"
              y1={height * p}
              x2="1000"
              y2={height * p}
              stroke="var(--color-border)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Layer (Simplified for monthly points to avoid clutter) */}
          {points.length < 40 && points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="var(--color-surface)"
                stroke="var(--color-brand)"
                strokeWidth="2"
                className="transition-all hover:r-6"
              />
              <g className="opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                <rect
                    x={p.x - 45}
                    y={p.y - 45}
                    width="90"
                    height="32"
                    rx="8"
                    fill="var(--color-surface-strong)"
                    stroke="var(--color-border)"
                    className="shadow-sm"
                />
                <text
                    x={p.x}
                    y={p.y - 25}
                    textAnchor="middle"
                    className="fill-[var(--color-brand-strong)] text-[20px] font-black"
                >
                    {unit === "baht" ? p.value.toLocaleString(undefined, { minimumFractionDigits: 1 }) : Math.round(p.value)}
                </text>
              </g>
            </g>
          ))}
          
          {/* Overlay for large datasets to handle hover better */}
          {points.length >= 40 && (
             <rect 
                width="1000" 
                height={height} 
                className="fill-transparent cursor-crosshair"
             />
          )}
        </svg>

        {/* X Axis Labels */}
        <div className="relative mt-4 h-6">
          {xLabels.map((item) => (
            <span 
              key={item.index} 
              className="absolute text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)] whitespace-nowrap"
              style={{ left: `${(item.index / (data.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
            >
              วันที่ {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
