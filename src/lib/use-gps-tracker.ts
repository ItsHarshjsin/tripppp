import { useCallback, useEffect, useRef, useState } from "react";
import { haversine } from "./speed-units";

export type TrackerState = {
  tracking: boolean;
  speedMs: number;
  maxSpeedMs: number;
  avgSpeedMs: number;
  distanceM: number;
  elapsedS: number;
  path: [number, number][];
  accuracy: number | null;
  error: string | null;
  supported: boolean;
};

export function useGpsTracker() {
  const [tracking, setTracking] = useState(false);
  const [speedMs, setSpeedMs] = useState(0);
  const [maxSpeedMs, setMaxSpeedMs] = useState(0);
  const [distanceM, setDistanceM] = useState(0);
  const [elapsedS, setElapsedS] = useState(0);
  const [path, setPath] = useState<[number, number][]>([]);
  const [speedHistory, setSpeedHistory] = useState<number[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);


  const watchId = useRef<number | null>(null);
  const startedAt = useRef<number | null>(null);
  const last = useRef<{ coords: [number, number]; t: number } | null>(null);

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && "geolocation" in navigator);
  }, []);

  useEffect(() => {
    if (!tracking) return;
    const id = window.setInterval(() => {
      if (startedAt.current)
        setElapsedS((Date.now() - startedAt.current) / 1000);
    }, 250);
    return () => window.clearInterval(id);
  }, [tracking]);

  const stop = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setTracking(false);
    setSpeedMs(0);
  }, []);

  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setSupported(false);
      setError("Location is not available in this browser.");
      return;
    }
    setError(null);
    startedAt.current = Date.now() - elapsedS * 1000;
    setTracking(true);

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed, accuracy: acc } = pos.coords;
        const now = pos.timestamp || Date.now();
        const point: [number, number] = [latitude, longitude];
        setAccuracy(acc ?? null);

        let computed = speed != null && speed >= 0 ? speed : 0;
        if (last.current) {
          const d = haversine(last.current.coords, point);
          const dt = (now - last.current.t) / 1000;
          if (d > Math.max(3, (acc ?? 10) / 2)) {
            setDistanceM((prev) => prev + d);
            setPath((prev) => [...prev, point]);
            if (speed == null && dt > 0) computed = d / dt;
          }
        } else {
          setPath([point]);
        }
        last.current = { coords: point, t: now };
        setSpeedMs(computed);
        setMaxSpeedMs((prev) => (computed > prev ? computed : prev));
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. Enable it in Settings to track speed."
            : "Couldn't get a GPS signal. Try again outdoors.",
        );
        stop();
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 },
    );
  }, [elapsedS, stop]);

  const reset = useCallback(() => {
    stop();
    last.current = null;
    startedAt.current = null;
    setSpeedMs(0);
    setMaxSpeedMs(0);
    setDistanceM(0);
    setElapsedS(0);
    setPath([]);
  }, [stop]);

  useEffect(() => () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
  }, []);

  const avgSpeedMs = elapsedS > 1 ? distanceM / elapsedS : 0;

  return {
    tracking,
    speedMs,
    maxSpeedMs,
    avgSpeedMs,
    distanceM,
    elapsedS,
    path,
    accuracy,
    error,
    supported,
    start,
    stop,
    reset,
  };
}
