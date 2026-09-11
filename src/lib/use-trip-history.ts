import { useEffect, useState } from "react";
import { computeStats, loadTrips, type TripStats } from "./trip-history";

export function useTripHistory(): TripStats {
  const [stats, setStats] = useState<TripStats>(() => computeStats([]));

  useEffect(() => {
    const sync = () => setStats(computeStats(loadTrips()));
    sync();
    window.addEventListener("apex-trips-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("apex-trips-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return stats;
}
