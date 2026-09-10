import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { AnalogGauge } from "@/components/AnalogGauge";
import { useTrip } from "@/lib/trip-context";
import {
  UNITS,
  distanceLabel,
  formatDuration,
  toUnit,
  type UnitKey,
} from "@/lib/speed-units";

const TripMap = lazy(() => import("@/components/TripMap"));


export const Route = createFileRoute("/speedometer")({
  head: () => ({
    meta: [
      { title: "GPS Speedometer — Live Speed, Distance & Trip Tracking" },
      {
        name: "description",
        content:
          "A free iPhone-friendly GPS speedometer: live speed in km/h, mph, m/s or knots, analog or digital dial, max and average speed, distance and trip time on an OpenStreetMap route.",
      },
      { property: "og:title", content: "GPS Speedometer — Live Speed & Trip Tracking" },
      {
        property: "og:description",
        content:
          "Track your real-time speed, distance and route in the browser. No account, no API keys — just your device GPS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0d1117" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
  }),
  component: Index,
});

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="surface-card min-w-0 px-4 py-3">
      <p className="truncate text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="tabular mt-1 truncate text-xl font-semibold">
        {value}
        {sub ? <span className="ml-1 text-xs font-medium text-muted-foreground">{sub}</span> : null}
      </p>
    </div>
  );
}

function Index() {
  const [unit, setUnit] = useState<UnitKey>("kmh");
  const [analog, setAnalog] = useState(false);
  const t = useTrip();

  const u = UNITS[unit];
  const speed = toUnit(t.speedMs, unit);
  const shown = speed < 10 ? speed.toFixed(1) : Math.round(speed).toString();

  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col gap-4 px-4 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold uppercase tracking-[0.14em]">
            Apex <span className="text-primary">Speed</span>
          </h1>
          <p className="truncate text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t.tracking
              ? t.accuracy
                ? `Live · ±${Math.round(t.accuracy)} m`
                : "Live · acquiring signal"
              : "Real-time GPS speedometer"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${
            t.tracking
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {t.tracking ? "Tracking" : "Idle"}
        </span>
      </header>


      {/* Speed display */}
      <section className="surface-card flex flex-col items-center px-6 py-7">
        <div className="flex w-full justify-center rounded-full bg-secondary p-1">
          {(["Digital", "Analog"] as const).map((mode, i) => {
            const active = analog === (i === 1);
            return (
              <button
                key={mode}
                onClick={() => setAnalog(i === 1)}
                className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>

        {analog ? (
          <div className="mt-4 aspect-square w-full max-w-[280px]">
            <AnalogGauge value={speed} max={u.max} unit={u.label} />
          </div>
        ) : (
          <div className="flex flex-col items-center py-8">
            <span
              className="text-speed tabular text-[5.5rem] font-bold leading-none"
              style={{ filter: "drop-shadow(var(--shadow-glow))" }}
            >
              {shown}
            </span>
            <span className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {u.label}
            </span>
          </div>
        )}

        <div className="mt-4 grid w-full grid-cols-4 gap-1 rounded-full bg-secondary p-1">
          {(Object.keys(UNITS) as UnitKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setUnit(key)}
              className={`rounded-full py-1.5 text-xs font-semibold transition-colors ${
                unit === key ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {UNITS[key].short}
            </button>
          ))}
        </div>
      </section>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={t.tracking ? t.stop : t.start}
          className={`h-14 flex-1 rounded-full text-base font-semibold transition-transform active:scale-[0.97] ${
            t.tracking
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {t.tracking ? "Stop" : t.elapsedS > 0 ? "Resume" : "Start"}
        </button>
        <button
          onClick={t.reset}
          className="h-14 rounded-full border border-border bg-secondary px-6 text-base font-semibold text-foreground transition-transform active:scale-[0.97]"
        >
          Reset
        </button>
      </div>

      {t.error && (
        <p className="rounded-2xl bg-destructive/15 px-4 py-3 text-sm text-destructive-foreground">
          {t.error}
        </p>
      )}
      {!t.supported && (
        <p className="rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
          This browser doesn't support location tracking.
        </p>
      )}

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3">
        <Stat label="Max speed" value={toUnit(t.maxSpeedMs, unit).toFixed(1)} sub={u.short} />
        <Stat label="Avg speed" value={toUnit(t.avgSpeedMs, unit).toFixed(1)} sub={u.short} />
        <Stat label="Distance" value={distanceLabel(t.distanceM, unit)} />
        <Stat label="Trip time" value={formatDuration(t.elapsedS)} />
      </section>

      {/* Map */}
      <section className="surface-card h-64 overflow-hidden">
        <ClientOnly
          fallback={
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              Loading map…
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Loading map…
              </div>
            }
          >
            <TripMap path={t.path} live={t.tracking} />
          </Suspense>
        </ClientOnly>
      </section>
      <p className="px-1 text-[9px] text-muted-foreground/25">
        Map data © OpenStreetMap contributors
      </p>

      <Link
        to="/export"
        className="grid h-14 place-items-center rounded-full bg-primary text-sm font-bold uppercase tracking-widest text-primary-foreground transition-transform active:scale-[0.97]"
      >
        Create share card
      </Link>

      <p className="text-center text-xs text-muted-foreground">
        Speed comes from your device's GPS. Accuracy improves outdoors with a clear sky view.
      </p>
    </main>
  );
}
