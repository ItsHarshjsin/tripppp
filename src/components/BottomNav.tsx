import { Link } from "@tanstack/react-router";
import { Gauge, LayoutDashboard, Trophy, Share2 } from "lucide-react";

const ITEMS = [
  { to: "/speedometer", label: "Drive", icon: Gauge },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/export", label: "Share", icon: Share2 },
] as const;

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-20 mt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between gap-1 rounded-full border border-border bg-card/95 px-2 py-2 backdrop-blur">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            className="grid h-11 flex-1 place-items-center rounded-full text-muted-foreground transition-colors"
            activeProps={{ className: "bg-primary text-primary-foreground" }}
          >
            <Icon className="h-5 w-5" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
