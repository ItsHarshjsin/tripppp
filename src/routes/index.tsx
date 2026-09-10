import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Flag } from "lucide-react";
import heroCar from "@/assets/hero-car.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "APEX — Own the Road" },
      {
        name: "description",
        content:
          "APEX is a free live GPS speedometer for your phone. Track speed, distance, trip time and route — no account, no API keys.",
      },
      { property: "og:title", content: "APEX — Own the Road" },
      {
        property: "og:description",
        content:
          "Live GPS speed, max & average speed, distance and trip time. Shareable drive cards. Free, in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#000000" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
  }),
  component: LandingPage,
});

function CheckerStrip({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-4 w-full opacity-90 ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(45deg, #fff 25%, #000 25%, #000 75%, #fff 75%), linear-gradient(45deg, #fff 25%, #000 25%, #000 75%, #fff 75%)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0, 8px 8px",
      }}
    />
  );
}

function LandingPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-black text-white">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55dvh]"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 100%, rgba(220,38,38,0.28) 0%, rgba(220,38,38,0.08) 45%, transparent 75%)",
        }}
      />

      {/* header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-black italic tracking-widest">
            APEX
          </span>
          <Flag className="h-3.5 w-3.5 text-red-600" fill="currentColor" />
        </div>
        <Link
          to="/speedometer"
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
        >
          Speedometer
        </Link>
      </header>

      {/* hero copy */}
      <section className="relative z-10 mt-4 px-6 text-center">
        <h1 className="font-display text-[clamp(3rem,17vw,5.5rem)] leading-[0.9] font-black italic tracking-tight drop-shadow-[0_0_30px_rgba(220,38,38,0.35)]">
          OWN THE
          <br />
          ROAD
        </h1>
        <CheckerStrip className="mx-auto mt-5 max-w-[520px]" />
        <p className="mx-auto mt-5 max-w-xs text-sm font-medium leading-relaxed text-white/70">
          Track your speed.
          <br />
          Outpace everyone.
        </p>
      </section>

      {/* car */}
      <div className="relative z-0 mx-auto mt-2 w-full max-w-lg flex-1">
        <img
          src={heroCar.url}
          alt="Black supercar with glowing red headlights charging out of smoke"
          className="h-full min-h-[38dvh] w-full object-cover"
          style={{
            maskImage:
              "radial-gradient(90% 90% at 50% 55%, black 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(90% 90% at 50% 55%, black 55%, transparent 100%)",
          }}
        />
      </div>

      {/* CTA */}
      <footer className="relative z-10 mt-auto px-6 pb-[max(env(safe-area-inset-bottom),2rem)]">
        <Link
          to="/speedometer"
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-base font-black uppercase italic tracking-[0.2em] text-white shadow-[0_0_40px_rgba(220,38,38,0.45)] transition-all active:scale-[0.98] active:bg-red-700"
        >
          Prove It
          <ChevronRight className="h-5 w-5 transition-transform group-active:translate-x-1" />
        </Link>
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.25em] text-white/30">
          Free · No account · Uses your GPS
        </p>
      </footer>
    </main>
  );
}
