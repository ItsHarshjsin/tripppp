import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Crown } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useTripHistory } from "@/lib/use-trip-history";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — APEX Top Speed Rankings" },
      {
        name: "description",
        content:
          "See how your top speed, distance and trip count stack up against friends, your country and the global APEX board.",
      },
      { property: "og:title", content: "Leaderboard — APEX Top Speed Rankings" },
      {
        property: "og:description",
        content: "Top speed, distance and trip rankings across friends, country and global boards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#000000" },
    ],
  }),
  component: LeaderboardPage,
});

type Racer = {
  name: string;
  car: string;
  topSpeed: number;
  distance: number;
  trips: number;
};

const RACERS: Record<string, Racer[]> = {
  friends: [
    { name: "LEWIS_44", car: "Mercedes AMG GT", topSpeed: 178, distance: 1420, trips: 96 },
    { name: "MAX_V", car: "Red Bull RB20", topSpeed: 172, distance: 1310, trips: 88 },
    { name: "CHECO_SP", car: "Porsche 911 GT3", topSpeed: 165, distance: 980, trips: 71 },
    { name: "CARLOS_55", car: "Ferrari SF-24", topSpeed: 158, distance: 900, trips: 64 },
    { name: "LANDO_04", car: "McLaren MCL38", topSpeed: 151, distance: 870, trips: 60 },
  ],
  country: [
    { name: "LEWIS_44", car: "Mercedes AMG GT", topSpeed: 191, distance: 2140, trips: 152 },
    { name: "MAX_V", car: "Red Bull RB20", topSpeed: 187, distance: 2010, trips: 141 },
    { name: "CHECO_SP", car: "Porsche 911 GT3", topSpeed: 182, distance: 1890, trips: 133 },
    { name: "CARLOS_55", car: "Ferrari SF-24", topSpeed: 179, distance: 1760, trips: 126 },
    { name: "ALONSO_14", car: "Aston Martin AMR24", topSpeed: 174, distance: 1640, trips: 118 },
  ],
  global: [
    { name: "LEWIS_44", car: "Mercedes AMG GT", topSpeed: 194, distance: 3240, trips: 248 },
    { name: "MAX_V", car: "Red Bull RB20", topSpeed: 188, distance: 3100, trips: 233 },
    { name: "CHECO_SP", car: "Porsche 911 GT3", topSpeed: 184, distance: 2980, trips: 221 },
    { name: "CARLOS_55", car: "Ferrari SF-24", topSpeed: 182, distance: 2760, trips: 208 },
    { name: "LANDO_04", car: "McLaren MCL38", topSpeed: 179, distance: 2610, trips: 196 },
    { name: "ALONSO_14", car: "Aston Martin AMR24", topSpeed: 178, distance: 2540, trips: 188 },
  ],
};

const BOARDS = ["friends", "country", "global"] as const;
const METRICS = ["topSpeed", "distance", "trips"] as const;
const METRIC_LABEL: Record<(typeof METRICS)[number], string> = {
  topSpeed: "Top speed",
  distance: "Distance",
  trips: "Trips",
};

function Avatar({ name, size }: { name: string; size: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-secondary font-black italic text-muted-foreground"
      style={{ width: size, height: size, fontSize: size / 2.6 }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

function LeaderboardBody() {
  const [board, setBoard] = useState<(typeof BOARDS)[number]>("global");
  const [metric, setMetric] = useState<(typeof METRICS)[number]>("topSpeed");
  const s = useTripHistory();

  const you: Racer = {
    name: "YOU",
    car: "Your ride",
    topSpeed: Math.round(s.topSpeedMs * 3.6),
    distance: Math.round(s.totalDistanceM / 1000),
    trips: s.tripCount,
  };

  const rows = [...RACERS[board]!, you].sort((a, b) => b[metric] - a[metric]);
  const yourRank = rows.findIndex((r) => r.name === "YOU") + 1;
  const podium = rows.filter((r) => r.name !== "YOU").slice(0, 3);
  const rest = rows.filter((r) => r.name !== "YOU").slice(3);

  const unit = metric === "topSpeed" ? "km/h" : metric === "distance" ? "km" : "trips";
  const val = (r: Racer) => r[metric].toString();

  return (
    <>
      <div className="grid grid-cols-3 gap-1 rounded-full bg-secondary p-1">
        {BOARDS.map((b) => (
          <button
            key={b}
            onClick={() => setBoard(b)}
            className={`rounded-full py-2 text-[11px] font-black uppercase italic tracking-widest transition-colors ${
              board === b ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        {METRICS.map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
              metric === m ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {METRIC_LABEL[m]}
          </button>
        ))}
      </div>

      {/* podium */}
      <div className="flex items-end justify-center gap-3 pt-2">
        {[podium[1], podium[0], podium[2]].map((r, i) => {
          if (!r) return null;
          const first = i === 1;
          const rank = first ? 1 : i === 0 ? 2 : 3;
          return (
            <div key={r.name} className="flex min-w-0 flex-col items-center">
              {first && <Crown className="mb-1 h-5 w-5 text-[#f5c04a]" />}
              <div className="relative">
                <span
                  className={`block rounded-full ${first ? "ring-2 ring-[#f5c04a]" : ""}`}
                >
                  <Avatar name={r.name} size={first ? 78 : 62} />
                </span>
                <span
                  className={`absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full text-[11px] font-black ${
                    first ? "bg-[#f5c04a] text-black" : "bg-secondary text-foreground"
                  }`}
                >
                  {rank}
                </span>
              </div>
              <p
                className={`mt-2 max-w-[92px] truncate text-[12px] font-black italic ${
                  first ? "text-[#f5c04a]" : "text-foreground"
                }`}
              >
                {r.name}
              </p>
              <p className="tabular text-[11px] font-bold text-muted-foreground">
                {val(r)} {unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* rest */}
      <div className="space-y-2">
        {rest.map((r) => (
          <div
            key={r.name}
            className="surface-card flex items-center gap-3 px-3 py-3"
          >
            <span className="tabular w-6 shrink-0 text-center text-lg font-black italic text-muted-foreground">
              {rows.indexOf(r) + 1}
            </span>
            <Avatar name={r.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-black italic">{r.name}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {r.car}
              </p>
            </div>
            <p className="tabular shrink-0 text-right text-lg font-black italic">
              {val(r)}
              <span className="ml-1 block text-[9px] font-bold uppercase text-muted-foreground">
                {unit}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* you */}
      <div className="flex items-center gap-3 rounded-2xl bg-primary px-3 py-3 text-primary-foreground">
        <span className="tabular w-6 shrink-0 text-center text-lg font-black italic">
          {yourRank}
        </span>
        <Avatar name="Y" size={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-black italic">YOU</p>
          <p className="truncate text-[10px] font-bold uppercase tracking-widest opacity-80">
            {s.tripCount > 0 ? `${s.tripCount} trips logged` : "No drives logged yet"}
          </p>
        </div>
        <p className="tabular shrink-0 text-right text-lg font-black italic">
          {val(you)}
          <span className="ml-1 block text-[9px] font-bold uppercase opacity-80">{unit}</span>
        </p>
      </div>
    </>
  );
}

function LeaderboardPage() {
  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col gap-4 px-4 pb-2 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between">
        <h1 className="text-[1.9rem] font-black italic uppercase leading-none">Leaderboard</h1>
        <Link
          to="/dashboard"
          className="rounded-full bg-secondary px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
        >
          Stats
        </Link>
      </header>

      <ClientOnly fallback={<div className="surface-card h-64 animate-pulse" />}>
        <LeaderboardBody />
      </ClientOnly>

      <div className="mt-auto" />
      <BottomNav />
    </main>
  );
}
