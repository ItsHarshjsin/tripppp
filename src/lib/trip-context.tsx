import { createContext, useContext, type ReactNode } from "react";
import { useGpsTracker } from "./use-gps-tracker";

type Tracker = ReturnType<typeof useGpsTracker>;

const TripContext = createContext<Tracker | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const tracker = useGpsTracker();
  return <TripContext.Provider value={tracker}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside TripProvider");
  return ctx;
}
