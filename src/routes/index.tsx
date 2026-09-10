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
    <div aria-hidden className="relative w-screen -mx-6 overflow-hidden py-3">
      <div className="w-[130%] -ml-[15%] -rotate-[6deg]">
        <div className="h-[3px] w-full bg-red-600" />
        <div
          className="h-7 w-full"
          style={{
            backgroundImage:
              "conic-gradient(#fff 0 25%, #0a0a0a 0 50%, #fff 0 75%, #0a0a0a 0)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="h-[3px] w-full bg-red-600" />
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-black text-white">
      {/* ambient red glow behind car */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60dvh]"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 85%, rgba(220,38,38,0.30) 0%, rgba(220,38,38,0.08) 45%, transparent 75%)",
        }}
      />

      {/* logo */}
      <header className="relative z-10 px-6 pt-[max(env(safe-area-inset-top),1.5rem)]">
        <span className="font-display block text-2xl font-black italic tracking-[0.15em]">
          APEX
        </span>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="h-[3px] w-10 bg-red-600" />
          <span className="h-[3px] w-4 bg-white/25" />
        </div>
      </header>

      {/* hero copy */}
      <section className="relative z-10 mt-8 px-6 text-center">
        <h1 className="font-display text-[clamp(3rem,16vw,5rem)] leading-[0.88] font-black italic tracking-tight drop-shadow-[0_0_35px_rgba(220,38,38,0.4)]">
          OWN THE
          <br />
          ROAD
        </h1>
      </section>

      <div className="relative z-10 mt-7 px-6">
        <CheckerBanner />
      </div>

      <p className="relative z-10 mx-auto mt-6 max-w-xs px-6 text-center text-[15px] font-medium leading-relaxed text-white/70">
        Track your speed.
        <br />
        Outpace everyone.
      </p>

      {/* car */}
      <div className="relative z-0 -mt-2 min-h-0 flex-1">
        <img
          src={heroCar.url}
          alt="Black supercar with glowing red headlights charging out of smoke"
          className="h-full w-full object-cover object-[50%_60%]"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
        />
      </div>

      {/* CTA — skewed red bar */}
      <footer className="relative z-10 px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <Link
          to="/speedometer"
          className="block w-full -skew-x-[12deg] bg-red-600 py-4 text-center shadow-[0_0_45px_rgba(220,38,38,0.5)] transition-transform active:scale-[0.98]"
        >
          <span className="font-display block skew-x-[12deg] text-xl font-black italic tracking-[0.12em] text-white">
            PROVE IT
          </span>
        </Link>
        <div className="mt-5 flex justify-end">
          <span className="h-[2px] w-24 bg-red-600/70" />
        </div>
      </footer>
    </main>
  );
}
