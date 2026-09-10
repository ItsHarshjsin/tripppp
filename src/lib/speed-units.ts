export type UnitKey = "kmh" | "mph" | "ms" | "kn";

export const UNITS: Record<
  UnitKey,
  { label: string; short: string; fromMs: number; max: number }
> = {
  kmh: { label: "km/h", short: "km/h", fromMs: 3.6, max: 200 },
  mph: { label: "mph", short: "mph", fromMs: 2.236936, max: 120 },
  ms: { label: "m/s", short: "m/s", fromMs: 1, max: 60 },
  kn: { label: "knots", short: "kn", fromMs: 1.943844, max: 120 },
};

export const toUnit = (ms: number, unit: UnitKey) => ms * UNITS[unit].fromMs;

export const distanceLabel = (meters: number, unit: UnitKey) => {
  if (unit === "mph") return `${(meters / 1609.344).toFixed(2)} mi`;
  if (unit === "kn") return `${(meters / 1852).toFixed(2)} nm`;
  return `${(meters / 1000).toFixed(2)} km`;
};

export const formatDuration = (secondsTotal: number) => {
  const s = Math.max(0, Math.floor(secondsTotal));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
};

export const haversine = (
  a: [number, number],
  b: [number, number],
): number => {
  const R = 6371000;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const la1 = (a[0] * Math.PI) / 180;
  const la2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
