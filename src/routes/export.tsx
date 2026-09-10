import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FlexCard } from "@/components/FlexCard";
import { useTrip } from "@/lib/trip-context";
import { UNITS, type UnitKey } from "@/lib/speed-units";

export const Route = createFileRoute("/export")({
  head: () => ({
    meta: [
      { title: "Export Preview — Share Your APEX Drive Card" },
      {
        name: "description",
        content:
          "Preview and download a shareable APEX drive card with your max speed, average speed, distance, trip time and speed graph.",
      },
      { property: "og:title", content: "Export Preview — Share Your APEX Drive" },
      {
        property: "og:description",
        content: "Turn your GPS drive stats into a shareable image card you can download or post.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0d1117" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
  }),
  component: ExportPage,
});

function ExportPage() {
  const t = useTrip();
  const [unit, setUnit] = useState<UnitKey>("kmh");

  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col gap-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <Link
          to="/speedometer"
          aria-label="Back to speedometer"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-foreground transition-transform active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="truncate text-center text-[13px] font-bold uppercase italic tracking-[0.24em] text-muted-foreground">
          Export preview
        </h1>
        <span className="h-10 w-10" />
      </header>

      <div className="grid grid-cols-4 gap-1 rounded-full bg-secondary p-1">
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

      <ClientOnly fallback={null}>
        <FlexCard
          unit={unit}
          maxSpeedMs={t.maxSpeedMs}
          avgSpeedMs={t.avgSpeedMs}
          distanceM={t.distanceM}
          elapsedS={t.elapsedS}
          speedHistory={t.speedHistory}
        />
      </ClientOnly>

      <p className="text-center text-xs text-muted-foreground">
        Your card is generated on-device — download it or share straight to your apps.
      </p>
    </main>
  );
}
