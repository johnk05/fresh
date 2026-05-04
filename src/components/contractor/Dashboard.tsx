
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  User, 
  Search, 
  Settings, 
  Plus, 
  Compass, 
  CloudSun, 
  Layers, 
  Navigation2,
  Share2
} from "lucide-react";
import { Language, translations } from "@/lib/translations";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function ContractorDashboard({ language }: { language: Language }) {
  const t = translations[language];
  const [listings, setListings] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const mapImg = PlaceHolderImages.find(img => img.id === 'kerala-map');

  useEffect(() => {
    const savedProfile = localStorage.getItem('fresh_user_profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
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

  return (
    <div className="relative h-[85vh] -mx-6 -mt-12 overflow-hidden bg-[#E5E7EB]">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        {mapImg && (
          <Image 
            src={mapImg.imageUrl} 
            alt={mapImg.description} 
            fill 
            className="object-cover opacity-60 grayscale-[0.3] contrast-[1.1] brightness-[1.05]"
            data-ai-hint={mapImg.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Top Bar Overlay */}
      <div className="absolute top-6 left-4 right-4 z-30 flex items-center justify-between gap-3">
        <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-white/50">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 bg-white/90 backdrop-blur-md h-12 rounded-full shadow-lg border border-white/50 flex items-center justify-center px-4 gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-bold text-sm tracking-tight truncate">Ernakulam, Kerala</span>
          <div className="w-px h-4 bg-border mx-1" />
          <div className="flex items-center gap-1">
            <CloudSun className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold">32°C</span>
          </div>
        </div>

        <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-white/50">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Floating Action Buttons (Right) */}
      <div className="absolute right-4 top-24 z-30 flex flex-col gap-3">
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
      <div className="absolute bottom-28 right-4 z-30">
        <motion.div 
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-2 border-primary/20"
        >
          <Navigation2 className="w-7 h-7 text-primary" />
        </motion.div>
      </div>

      {/* Listing Markers (Mango Pins) */}
      {listings.map((l, i) => (
        <motion.div
          key={l.id}
          className="absolute z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1, type: "spring" }}
          style={{ 
            top: `${35 + (i * 12)}%`, 
            left: `${25 + (i * 25)}%` 
          }}
        >
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white shadow-2xl border-4 border-white flex items-center justify-center text-3xl overflow-hidden hover:scale-110 transition-transform">
                🥭
              </div>
              <motion.div 
                className="absolute inset-0 bg-primary/30 rounded-full -z-10"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
              />
            </div>
            <div className="mt-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl shadow-lg border border-white flex flex-col items-center">
              <span className="text-[11px] font-bold leading-none">{l.ownerName}</span>
              <div className="flex gap-2 items-center mt-1">
                <span className="text-[9px] font-medium text-muted-foreground">{l.distance}</span>
                <div className="w-1 h-1 bg-border rounded-full" />
                <span className="text-[9px] font-medium text-primary">{l.time}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* "Me" Blue Dot Marker */}
      {userProfile?.location && (
        <motion.div
          className="absolute z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ top: "55%", left: "45%" }}
        >
          <div className="flex flex-col items-center">
             <div className="relative">
               <div className="w-5 h-5 bg-[#3B82F6] rounded-full border-2 border-white shadow-lg relative z-10" />
               <motion.div 
                 className="absolute inset-0 bg-[#3B82F6]/40 rounded-full"
                 animate={{ scale: [1, 3, 1], opacity: [0.4, 0, 0.4] }}
                 transition={{ duration: 3, repeat: Infinity }}
               />
             </div>
             <div className="mt-1 bg-black/70 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">ME</div>
          </div>
        </motion.div>
      )}

      {/* Popular Clusters Indicator */}
      <div className="absolute bottom-6 left-6 right-6 z-30">
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
