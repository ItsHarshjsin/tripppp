export type TripRecord = {
  id: string;
  date: number;
  distanceM: number;
  durationS: number;
  maxSpeedMs: number;
  avgSpeedMs: number;
};

const KEY = "apex.trips.v1";

export function loadTrips(): TripRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as TripRecord[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTrip(trip: Omit<TripRecord, "id" | "date">): TripRecord | null {
  if (typeof window === "undefined") return null;
  if (trip.distanceM < 50 || trip.durationS < 10) return null;
  const record: TripRecord = { ...trip, id: crypto.randomUUID(), date: Date.now() };
  const next = [record, ...loadTrips()].slice(0, 200);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("apex-trips-changed"));
  } catch {
    /* storage full / blocked */
  }
  return record;
}

export function clearTrips() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("apex-trips-changed"));
}

export type TripStats = {
  trips: TripRecord[];
  totalDistanceM: number;
  monthDistanceM: number;
  prevMonthDistanceM: number;
  totalDurationS: number;
  tripCount: number;
  topSpeedMs: number;
  avgSpeedMs: number;
  weekly: { label: string; distanceM: number }[];
};

export function computeStats(trips: TripRecord[]): TripStats {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

  const totalDistanceM = trips.reduce((s, t) => s + t.distanceM, 0);
  const totalDurationS = trips.reduce((s, t) => s + t.durationS, 0);
  const monthTrips = trips.filter((t) => t.date >= monthStart);
  const prevMonthTrips = trips.filter((t) => t.date >= prevMonthStart && t.date < monthStart);

  const weekly = [0, 1, 2, 3].map((i) => ({
    label: `W${i + 1}`,
    distanceM: monthTrips
      .filter((t) => {
        const day = new Date(t.date).getDate();
        const week = Math.min(3, Math.floor((day - 1) / 7));
        return week === i;
      })
      .reduce((s, t) => s + t.distanceM, 0),
  }));

  return {
    trips,
    totalDistanceM,
    monthDistanceM: monthTrips.reduce((s, t) => s + t.distanceM, 0),
    prevMonthDistanceM: prevMonthTrips.reduce((s, t) => s + t.distanceM, 0),
    totalDurationS,
    tripCount: trips.length,
    topSpeedMs: trips.reduce((m, t) => Math.max(m, t.maxSpeedMs), 0),
    avgSpeedMs: totalDurationS > 0 ? totalDistanceM / totalDurationS : 0,
    weekly,
  };
}
