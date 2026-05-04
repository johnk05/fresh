
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  center: [number, number];
  listings: any[];
  userLocation: [number, number] | null;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function MapComponent({ center, listings, userLocation }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-muted animate-pulse" />;

  const mangoIcon = L.divIcon({
    className: "custom-marker-container",
    html: `
      <div class="flex flex-col items-center">
        <div class="relative group cursor-pointer">
          <div class="w-10 h-10 rounded-full bg-white shadow-2xl border-4 border-white flex items-center justify-center text-2xl overflow-hidden">
            🥭
          </div>
          <div class="absolute inset-0 bg-orange-400/20 rounded-full animate-ping -z-10"></div>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const meIcon = L.divIcon({
    className: "custom-marker-container",
    html: `
      <div class="flex flex-col items-center">
        <div class="relative">
          <div class="w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white shadow-lg relative z-10"></div>
          <div class="absolute inset-0 bg-[#3B82F6]/40 rounded-full animate-pulse scale-[2]"></div>
        </div>
        <div class="mt-1 bg-black/70 text-white px-2 py-0.5 rounded-full text-[8px] font-bold">ME</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="w-full h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <RecenterMap center={center} />
      
      {listings.map((l) => (
        <Marker 
          key={l.id} 
          position={[l.location.lat, l.location.lng]} 
          icon={mangoIcon}
        />
      ))}

      {userLocation && (
        <Marker 
          position={userLocation} 
          icon={meIcon}
        />
      )}
    </MapContainer>
  );
}
