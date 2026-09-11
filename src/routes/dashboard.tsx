import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useTripHistory } from "@/lib/use-trip-history";
import { formatDuration } from "@/lib/speed-units";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Your APEX Driving Stats" },
      {
        name: "description",
        content:
          "Monthly distance, total drive time, trips taken and your all-time top speed — every APEX drive tracked on your device.",
      },
      { property: "og:title", content: "Dashboard — Your APEX Driving Stats" },
      {
        property: "og:description",
        content: "Weekly distance chart, trip count, drive time and personal top speed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#000000" },
    ],
  }),
  component: DashboardPage,
});

function Tile({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: string;
  accent?: boolean;
  sub?: string;
}) {
  return (
    <div className="surface-card min-w-0 px-4 py-4">
      <p
        className={`truncate text-[10px] font-bold uppercase tracking-[0.18em] ${
          accent ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
      </p>
      <p
        className={`tabular mt-2 truncate text-[1.7rem] font-black italic leading-none ${
          accent ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </p>
      {sub ? (
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function DashboardBody() {
  const s = useTripHistory();
  const maxWeek = Math.max(...s.weekly.map((w) => w.distanceM), 1);
  const delta =
    s.prevMonthDistanceM > 0
      ? ((s.monthDistanceM - s.prevMonthDistanceM) / s.prevMonthDistanceM) * 100
      : null;
  const bestWeek = s.weekly.reduce(
    (best, w, i) => (w.distanceM > s.weekly[best]!.distanceM ? i : best),
    0,
  );

  return (
    <>
      <section className="surface-card px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Monthly distance
          </p>
          {delta !== null && (
            <span
              className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                delta >= 0 ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"
              }`}
            >
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(1)}%
            </span>
          )}
        </div>
        <p className="tabular mt-2 text-[2.3rem] font-black italic leading-none">
          {(s.monthDistanceM / 1000).toFixed(1)}
          <span className="ml-2 text-xl">KM</span>
        </p>

        <div className="mt-6 flex h-32 items-end gap-3">
          {s.weekly.map((w, i) => (
            <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end">
                <div
                  className={`w-full rounded-sm ${
                    i === bestWeek && w.distanceM > 0
                      ? "bg-primary"
                      : "border border-border bg-secondary"
                  }`}
                  style={{
                    height: `${Math.max(8, (w.distanceM / maxWeek) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">{w.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Tile label="Total duration" value={formatDuration(s.totalDurationS)} />
        <Tile label="Trips taken" value={s.tripCount.toString()} />
        <Tile
          label="Top speed"
          value={(s.topSpeedMs * 3.6).toFixed(0)}
          accent
          sub="km/h"
        />
        <Tile label="Total distance" value={`${(s.totalDistanceM / 1000).toFixed(1)} km`} />
      </section>

      <Link
        to="/leaderboard"
        className="flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground transition-transform active:scale-[0.98]"
      >
        <span>
          <span className="block text-lg font-black italic uppercase">Leaderboard</span>
          <span className="block text-[10px] font-bold uppercase tracking-widest opacity-80">
            See where you rank
          </span>
        </span>
        <ChevronRight className="h-5 w-5" />
      </Link>

      {s.tripCount === 0 && (
        <p className="rounded-2xl bg-secondary px-4 py-3 text-center text-xs text-muted-foreground">
          No drives recorded yet. Start a drive and stop it to log your first trip.
        </p>
      )}
    </>
  );
}

function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col gap-4 px-4 pb-2 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between">
        <h1 className="text-[1.9rem] font-black italic uppercase leading-none">Dashboard</h1>
        <Link
          to="/speedometer"
          className="rounded-full bg-secondary px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
        >
          Drive
        </Link>
      </header>

      <ClientOnly
        fallback={<div className="surface-card h-48 animate-pulse" />}
      >
        <DashboardBody />
      </ClientOnly>

      <div className="mt-auto" />
      <BottomNav />
    </main>
  );
}
