
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  center: [number, number];
  listings: any[];
  userLocation: [number, number] | null;
  userName?: string;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function MapComponent({ center, listings, userLocation, userName = "YOU" }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-muted animate-pulse" />;

  // User avatar icon (Mango) for listings
  const createMangoIcon = (name: string, distance: string, time: string) => {
    return L.divIcon({
      className: "custom-marker-container",
      html: `
        <div class="flex flex-col items-center">
          <div class="relative group cursor-pointer">
            <div class="w-12 h-12 rounded-full bg-white shadow-2xl border-[3px] border-white flex items-center justify-center text-2xl overflow-hidden transition-transform group-hover:scale-110 active:scale-95">
              🥭
            </div>
            <div class="absolute inset-0 bg-primary/20 rounded-full animate-ping -z-10"></div>
          </div>
          <div class="mt-2 flex flex-col items-center gap-1">
            <div class="bg-black/85 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shadow-xl border border-white/10">
              ${name}
            </div>
            <div class="flex gap-1">
              <span class="bg-white/95 text-black px-2 py-0.5 rounded-full text-[8px] font-black shadow-md border border-black/5">${distance}</span>
              <span class="bg-white/95 text-black px-2 py-0.5 rounded-full text-[8px] font-black shadow-md border border-black/5">${time}</span>
            </div>
          </div>
        </div>
      `,
      iconSize: [100, 100],
      iconAnchor: [50, 50],
    });
  };

  // 'YOU' marker with distinctive blue halo
  const meIcon = L.divIcon({
    className: "custom-marker-container",
    html: `
      <div class="flex flex-col items-center">
        <div class="relative">
          <div class="w-12 h-12 rounded-full bg-white shadow-2xl border-[3px] border-white flex items-center justify-center text-2xl overflow-hidden z-10 relative">
            🥭
          </div>
          <div class="absolute inset-[-8px] bg-[#3B82F6]/40 rounded-full animate-pulse z-0"></div>
        </div>
        <div class="mt-2 bg-[#3B82F6] text-white px-3 py-1 rounded-full text-[9px] font-black shadow-xl uppercase tracking-wider border border-white/20">
          ${userName === "YOU" ? "YOU" : userName.split(' ')[0]}
        </div>
      </div>
    `,
    iconSize: [60, 80],
    iconAnchor: [30, 40],
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
