import { useState } from "react";
import supercar from "@/assets/flex-supercar.jpg.asset.json";
import drift from "@/assets/flex-drift.jpg.asset.json";
import { UNITS, distanceLabel, formatDuration, toUnit, type UnitKey } from "@/lib/speed-units";

type Props = {
  unit: UnitKey;
  maxSpeedMs: number;
  avgSpeedMs: number;
  distanceM: number;
  elapsedS: number;
  speedHistory: number[];
};

const BACKDROPS = [
  { id: "night", label: "Night Run", url: supercar.url },
  { id: "track", label: "Track Day", url: drift.url },
];

function Sparkline({ values }: { values: number[] }) {
  const data = values.length > 1 ? values : [0, 0];
  const max = Math.max(...data, 1);
  const step = 100 / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${34 - (v / max) * 30}`).join(" ");
  return (
    <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="h-16 w-full">
      <polyline
        points={pts}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function FlexCard(p: Props) {
  const [bg, setBg] = useState(0);
  const [copied, setCopied] = useState(false);
  const u = UNITS[p.unit];
  const backdrop = BACKDROPS[bg]!;

  const summary = `APEX drive — max ${toUnit(p.maxSpeedMs, p.unit).toFixed(1)} ${u.short}, avg ${toUnit(
    p.avgSpeedMs,
    p.unit,
  ).toFixed(1)} ${u.short}, ${distanceLabel(p.distanceM, p.unit)} in ${formatDuration(p.elapsedS)}`;

  const share = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "APEX drive", text: summary });
        return;
      }
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled */
    }
  };

  const stat = (value: string, label: string, tone: string) => (
    <div className="min-w-0">
      <p className={`tabular truncate text-3xl font-extrabold leading-none ${tone}`}>{value}</p>
      <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Export preview
        </p>
        <div className="flex gap-1 rounded-full bg-secondary p-1">
          {BACKDROPS.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setBg(i)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                bg === i ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <article className="surface-card relative overflow-hidden">
        <img
          src={backdrop.url}
          alt="Sports car at speed"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background/95" />

        <div className="relative px-5 py-6">
          <h2 className="text-center text-3xl font-extrabold tracking-[0.18em] text-primary">
            APEX
          </h2>
          <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Performance data protocol
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
            {stat(distanceLabel(p.distanceM, p.unit).split(" ")[0]!, `Distance (${distanceLabel(p.distanceM, p.unit).split(" ")[1]})`, "text-foreground")}
            {stat(toUnit(p.avgSpeedMs, p.unit).toFixed(1), `Avg speed (${u.short})`, "text-foreground")}
            {stat(Math.round(toUnit(p.maxSpeedMs, p.unit)).toString(), `Max speed (${u.short})`, "text-accent")}
            {stat(formatDuration(p.elapsedS), "Trip time", "text-primary")}
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Speed over time ({u.short})
          </p>
          <Sparkline values={p.speedHistory.map((v) => toUnit(v, p.unit))} />

          <p className="mt-4 text-sm font-bold uppercase leading-snug tracking-wide">
            Live GPS drive
          </p>
          <div className="flex items-end justify-between gap-3">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {new Date().toLocaleString()}
            </p>
            <p className="text-sm font-extrabold italic text-primary">#APEXDRIVE</p>
          </div>
        </div>
      </article>

      <button
        onClick={share}
        className="h-14 w-full rounded-full bg-primary text-base font-bold uppercase tracking-widest text-primary-foreground transition-transform active:scale-[0.97]"
      >
        {copied ? "Copied!" : "Share this run"}
      </button>
    </section>
  );
}
