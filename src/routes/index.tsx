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
    <div aria-hidden className="checker-window">
      <div className="checker-ribbon" />
    </div>
  );
}

function LandingPage() {
  return (
    <main className="landing-shell">
      {/* logo */}
      <header className="relative z-10 px-4 pt-[max(env(safe-area-inset-top),1.25rem)]">
        <div>
          <span className="font-display block text-[19px] font-black italic leading-none">
            APEX
          </span>
          <span className="mt-2 block h-[3px] w-11 bg-primary" />
        </div>
      </header>

      {/* hero copy */}
      <section className="relative z-10 mt-6 px-5 text-center">
        <h1 className="font-display text-[clamp(2.65rem,13.7vw,3.55rem)] font-black italic leading-[0.9]">
          OWN THE
          <br />
          ROAD
        </h1>
      </section>

      <div className="relative z-10 mt-3">
        <CheckerBanner />
      </div>

      <p className="relative z-10 mt-1 px-5 text-center text-[15px] font-normal leading-[1.45] text-foreground/90">
        Track your speed.
        <br />
        Outpace everyone.
      </p>

      {/* car */}
      <div className="relative z-0 mt-1 min-h-[29dvh] w-full flex-1">
        <img
          src={heroCar.url}
          alt="Black supercar with glowing red headlights charging out of smoke"
          className="h-full w-full object-cover object-[50%_76%]"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
          }}
        />
      </div>

      {/* CTA — skewed red bar */}
      <footer className="relative z-10 mt-auto flex justify-center px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-1">
        <Link
          to="/speedometer"
          className="cta-frame block w-[86%] max-w-[350px] p-[2px] transition-transform active:scale-[0.98]"
        >
          <span className="cta-fill flex h-[50px] items-center justify-center">
            <span className="font-display text-lg font-black italic text-primary-foreground">
              PROVE IT
            </span>
          </span>
        </Link>
      </footer>
    </main>
  );
}
