
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

  // User avatar icon (Mango)
  const createMangoIcon = (name: string, distance: string, time: string) => {
    return L.divIcon({
      className: "custom-marker-container",
      html: `
        <div class="flex flex-col items-center">
          <div class="relative group cursor-pointer">
            <div class="w-12 h-12 rounded-full bg-white shadow-[0_8px_20px_-5px_rgba(0,0,0,0.3)] border-[3px] border-white flex items-center justify-center text-3xl overflow-hidden transition-transform group-hover:scale-110">
              🥭
            </div>
            <div class="absolute inset-0 bg-primary/20 rounded-full animate-ping -z-10"></div>
          </div>
          <div class="mt-2 flex flex-col items-center gap-0.5">
            <div class="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shadow-lg ring-1 ring-white/20">
              ${name}
            </div>
            <div class="flex gap-1">
              <div class="bg-white/95 text-black px-2 py-0.5 rounded-full text-[9px] font-black whitespace-nowrap shadow-md border border-black/5">
                ${distance}
              </div>
              <div class="bg-white/95 text-black px-2 py-0.5 rounded-full text-[9px] font-black whitespace-nowrap shadow-md border border-black/5">
                ${time}
              </div>
            </div>
          </div>
        </div>
      `,
      iconSize: [80, 100],
      iconAnchor: [40, 40],
    });
  };

  // 'YOU' marker matching the reference (Blue halo with mango)
  const meIcon = L.divIcon({
    className: "custom-marker-container",
    html: `
      <div class="flex flex-col items-center">
        <div class="relative">
          <div class="w-12 h-12 rounded-full bg-white shadow-2xl border-[3px] border-white flex items-center justify-center text-3xl overflow-hidden z-10 relative">
            🥭
          </div>
          <div class="absolute inset-[-6px] bg-[#3B82F6]/30 rounded-full animate-pulse z-0"></div>
        </div>
        <div class="mt-1 bg-[#3B82F6] text-white px-3 py-0.5 rounded-full text-[9px] font-black shadow-lg uppercase tracking-tight">YOU</div>
      </div>
    `,
    iconSize: [40, 70],
    iconAnchor: [20, 20],
  });

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="w-full h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <RecenterMap center={center} />
      
      {listings.map((l) => (
        l.location && typeof l.location.lat === 'number' && (
          <Marker 
            key={l.id} 
            position={[l.location.lat, l.location.lng]} 
            icon={createMangoIcon(l.ownerName || 'Owner', l.distance || '??km', l.time || 'now')}
          />
        )
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
