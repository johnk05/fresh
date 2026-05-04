
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Search, 
  Settings, 
  Plus, 
  Layers, 
  Navigation2,
  Share2,
  CloudSun
} from "lucide-react";
import { Language, translations } from "@/lib/translations";

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />
});

export function ContractorDashboard({ language }: { language: Language }) {
  const t = translations[language];
  const [listings, setListings] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.8505, 76.2711]);

  useEffect(() => {
    const savedProfile = localStorage.getItem('fresh_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);
        if (parsed.location) {
          setMapCenter([parsed.location.lat, parsed.location.lng]);
        }
      } catch (e) {
        console.error("Failed to load profile for dashboard", e);
      }
    }

    const savedListings = localStorage.getItem('fresh_local_listings');
    if (savedListings) {
      try {
        setListings(JSON.parse(savedListings));
      } catch (e) {
        console.error("Failed to load listings", e);
      }
    } else {
      const mockListings = [
        {
          id: '1',
          ownerName: 'Suresh Kumar',
          treeType: 'Alphonso',
          estimatedQuantityKg: 150,
          status: 'open',
          location: { lat: 10.8505, lng: 76.2711 },
          distance: "2.4km",
          time: "11h"
        },
        {
          id: '2',
          ownerName: 'Meera Nair',
          treeType: 'Priyoor',
          estimatedQuantityKg: 80,
          status: 'open',
          location: { lat: 10.8605, lng: 76.2811 },
          distance: "1.1km",
          time: "now"
        }
      ];
      setListings(mockListings);
    }
  }, []);

  const handleRecenter = () => {
    if (userProfile?.location) {
      setMapCenter([userProfile.location.lat, userProfile.location.lng]);
    }
  };

  return (
    <div className="relative h-[85vh] -mx-6 -mt-12 overflow-hidden bg-[#E5E7EB]">
      {/* Real Interactive Map */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
          center={mapCenter} 
          listings={listings} 
          userLocation={userProfile?.location ? [userProfile.location.lat, userProfile.location.lng] : null}
        />
      </div>

      {/* Top Bar Overlay */}
      <div className="absolute top-6 left-4 right-4 z-[1000] flex items-center justify-between gap-3 pointer-events-none">
        <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-white/50 pointer-events-auto">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 bg-white/90 backdrop-blur-md h-12 rounded-full shadow-lg border border-white/50 flex items-center justify-center px-4 gap-2 pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-bold text-sm tracking-tight truncate">Ernakulam, Kerala</span>
          <div className="w-px h-4 bg-border mx-1" />
          <div className="flex items-center gap-1">
            <CloudSun className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold">32°C</span>
          </div>
        </div>

        <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-white/50 pointer-events-auto">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Floating Action Buttons (Right) */}
      <div className="absolute right-4 top-24 z-[1000] flex flex-col gap-3">
        <motion.div whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-[#3B82F6] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer">
          <User className="w-5 h-5" />
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-[#10B981] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer">
          <Plus className="w-6 h-6" />
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-[#FDB714] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer">
          <Share2 className="w-5 h-5" />
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-white text-muted-foreground rounded-full shadow-xl flex items-center justify-center cursor-pointer border border-border">
          <Layers className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Recenter/Compass Button */}
      <div className="absolute bottom-28 right-4 z-[1000]">
        <motion.div 
          whileTap={{ scale: 0.9 }}
          onClick={handleRecenter}
          className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-2 border-primary/20"
        >
          <Navigation2 className="w-7 h-7 text-primary" />
        </motion.div>
      </div>

      {/* Popular Clusters Indicator (Bottom) */}
      <div className="absolute bottom-6 left-6 right-6 z-[1000]">
        <div className="bg-white/90 backdrop-blur-xl p-4 rounded-[2rem] flex items-center justify-between shadow-2xl border border-white/50">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center text-xs">🥭</div>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none mb-1">Local Hotspot</p>
              <p className="text-sm font-bold leading-none tracking-tight">3 Harvests near Palakkad</p>
            </div>
          </div>
          <Badge className="bg-primary text-white font-bold py-1 px-3 rounded-full border-none">View All</Badge>
        </div>
      </div>
    </div>
  );
}
