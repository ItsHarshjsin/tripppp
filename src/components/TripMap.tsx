import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from "react-leaflet";
import { useEffect } from "react";

function Follow({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, Math.max(map.getZoom(), 15), { animate: true });
  }, [center, map]);
  return null;
}

export default function TripMap({
  path,
  live,
}: {
  path: [number, number][];
  live: boolean;
}) {
  const center: [number, number] | null = path[path.length - 1] ?? null;

  return (
    <MapContainer
      center={center ?? [37.7749, -122.4194]}
      zoom={center ? 15 : 11}
      zoomControl={false}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        className="map-tiles-dark"
      />
      {path.length > 1 && (
        <Polyline positions={path} pathOptions={{ color: "#ff2d3f", weight: 5, opacity: 0.95 }} />
      )}
      {center && (
        <CircleMarker
          center={center}
          radius={7}
          pathOptions={{ color: "#160a0b", weight: 3, fillColor: "#ff2d3f", fillOpacity: 1 }}
        />
      )}

      {live && <Follow center={center} />}
    </MapContainer>
  );
}
