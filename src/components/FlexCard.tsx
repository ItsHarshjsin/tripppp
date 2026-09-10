import { useRef, useState } from "react";
import { toPng } from "html-to-image";
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
  const pts = data.map((v, i) => `${i * step},${34 - (v / max) * 30}`);
  const area = `0,36 ${pts.join(" ")} 100,36`;
  return (
    <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="h-20 w-full">
      <polygon points={area} fill="var(--color-primary)" opacity="0.22" />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2"
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
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const u = UNITS[p.unit];
  const backdrop = BACKDROPS[bg]!;

  const summary = `APEX drive — max ${toUnit(p.maxSpeedMs, p.unit).toFixed(1)} ${u.short}, avg ${toUnit(
    p.avgSpeedMs,
    p.unit,
  ).toFixed(1)} ${u.short}, ${distanceLabel(p.distanceM, p.unit)} in ${formatDuration(p.elapsedS)}`;

  const renderPng = async () => {
    if (!cardRef.current) return null;
    return toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
  };

  const download = async () => {
    setSaving(true);
    try {
      const url = await renderPng();
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      a.download = `apex-drive-${Date.now()}.png`;
      a.click();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const share = async () => {
    try {
      const dataUrl = await renderPng();
      if (dataUrl && typeof navigator !== "undefined" && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "apex-drive.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: "APEX drive", text: summary });
          return;
        }
      }
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

  const stat = (value: string, label: string, tone: string, align: "left" | "right") => (
    <div className={`min-w-0 ${align === "right" ? "text-right" : "text-left"}`}>
      <p className={`tabular truncate text-[2.1rem] font-extrabold leading-none ${tone}`}>{value}</p>
      <p className="mt-1.5 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  );

  const dist = distanceLabel(p.distanceM, p.unit).split(" ");

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

      <article ref={cardRef} className="surface-card relative overflow-hidden">
        <img
          src={backdrop.url}
          alt="Sports car at speed"
          crossOrigin="anonymous"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/45 to-background/90" />

        <div className="relative px-6 py-7">
          <h2 className="text-center text-3xl font-extrabold italic tracking-[0.18em] text-primary">
            APEX
          </h2>
          <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Performance data protocol
          </p>

          <div className="mt-7 grid grid-cols-2 items-start gap-x-4 gap-y-6">
            {stat(dist[0]!, `Distance (${dist[1]})`, "text-foreground", "left")}
            {stat(toUnit(p.avgSpeedMs, p.unit).toFixed(1), `Avg speed (${u.short})`, "text-foreground", "right")}
            {stat(Math.round(toUnit(p.maxSpeedMs, p.unit)).toString(), `Max speed (${u.short})`, "text-accent", "left")}
            {stat(formatDuration(p.elapsedS), "Trip time", "text-primary", "right")}
          </div>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Speed over time ({u.short})
          </p>
          <Sparkline values={p.speedHistory.map((v) => toUnit(v, p.unit))} />

          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold uppercase italic leading-snug">Live GPS drive</p>
              <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                {new Date().toLocaleString()}
              </p>
            </div>
            <p className="shrink-0 text-sm font-extrabold italic text-primary">#APEXDRIVE</p>
          </div>
        </div>
      </article>

      <div className="flex gap-3">
        <button
          onClick={download}
          className="h-14 flex-1 rounded-full bg-secondary text-sm font-bold uppercase tracking-widest text-foreground transition-transform active:scale-[0.97]"
        >
          {saving ? "Saving…" : "Download"}
        </button>
        <button
          onClick={share}
          className="h-14 flex-[1.4] rounded-full bg-primary text-sm font-bold uppercase tracking-widest text-primary-foreground transition-transform active:scale-[0.97]"
        >
          {copied ? "Copied!" : "Share this run"}
        </button>
      </div>
    </section>
  );
}
