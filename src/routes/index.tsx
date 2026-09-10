import { createFileRoute, Link } from "@tanstack/react-router";
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
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
    ],
  }),
  component: LandingPage,
});

function CheckerBanner() {
  return (
    <div aria-hidden className="relative w-screen overflow-hidden py-2">
      <div className="-ml-[20%] w-[140%] -rotate-[6deg]">
        <div className="h-[2px] w-full bg-red-600" />
        <div
          className="h-5 w-full"
          style={{
            backgroundImage:
              "conic-gradient(#f5f5f5 0 25%, #0a0a0a 0 50%, #f5f5f5 0 75%, #0a0a0a 0)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="h-[2px] w-full bg-red-600" />
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-black text-white">
      {/* logo */}
      <header className="relative z-10 flex items-end justify-between px-5 pt-[max(env(safe-area-inset-top),1.25rem)]">
        <div>
          <span className="font-display block text-xl font-black italic leading-none tracking-[0.18em]">
            APEX
          </span>
          <div className="mt-2 flex items-center gap-1">
            <span className="h-[3px] w-8 bg-red-600" />
            <span className="h-[3px] w-3 bg-white/20" />
          </div>
        </div>
        <span className="pb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
          GPS Speedometer
        </span>
      </header>

      {/* hero copy */}
      <section className="relative z-10 mt-5 px-5 text-center">
        <h1 className="font-display text-[clamp(2.6rem,13.5vw,4.25rem)] font-black italic leading-[0.9] tracking-tight">
          OWN THE
          <br />
          ROAD
        </h1>
      </section>

      <div className="relative z-10 mt-4">
        <CheckerBanner />
      </div>

      <p className="relative z-10 mt-3 px-5 text-center text-[15px] font-normal leading-[1.5] text-white/85">
        Track your speed.
        <br />
        Outpace everyone.
      </p>

      {/* car */}
      <div className="relative z-0 mt-3 min-h-[26dvh] w-full flex-1">
        <img
          src={heroCar.url}
          alt="Black supercar with glowing red headlights charging out of smoke"
          className="h-full w-full object-cover object-[50%_80%]"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
          }}
        />
      </div>

      {/* CTA — skewed red bar */}
      <footer className="relative z-10 mt-auto px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
        <Link
          to="/speedometer"
          className="block w-full -skew-x-[12deg] rounded-sm bg-red-600 py-3.5 text-center transition-transform active:scale-[0.98]"
        >
          <span className="font-display block skew-x-[12deg] text-lg font-black italic tracking-[0.14em] text-white">
            PROVE IT
          </span>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
            Free · No sign-up
          </span>
          <span className="h-[2px] w-20 bg-red-600/60" />
        </div>
      </footer>
    </main>
  );
}
