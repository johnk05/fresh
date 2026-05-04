
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { 
  User, 
  Search, 
  Settings, 
  Plus, 
  Layers, 
  Navigation2,
  Share2,
  CloudSun,
  Loader2
} from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />
});

export function ContractorDashboard({ language, onNavigate }: { language: Language, onNavigate?: (view: any) => void }) {
  const t = translations[language];
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.8505, 76.2711]);
  const [isSharing, setIsSharing] = useState(false);

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
    } else {
      // Default recenter if no location shared
      setMapCenter([10.8505, 76.2711]);
    }
  };

  const handleShare = () => {
    setIsSharing(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          const updatedProfile = {
            ...userProfile,
            location: newLocation,
            locationName: "Current Shared Location"
          };
          setUserProfile(updatedProfile);
          setMapCenter([newLocation.lat, newLocation.lng]);
          localStorage.setItem('fresh_user_profile', JSON.stringify(updatedProfile));
          setIsSharing(false);
          toast({
            title: t.locationShared,
            description: "Updating map markers...",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsSharing(false);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Please enable location permissions.",
          });
        }
      );
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

      {/* Top Bar Overlay - Matching Reference Screenshot */}
      <div className="absolute top-6 left-4 right-4 z-[1000] flex items-center justify-between gap-3 pointer-events-none">
        <motion.div 
          whileTap={{ scale: 0.9 }}
          onClick={() => toast({ title: "Search", description: "Search feature coming soon!" })}
          className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-white/50 pointer-events-auto"
        >
          <Search className="w-6 h-6 text-muted-foreground" />
        </motion.div>
        
        <div className="flex-1 bg-white/95 backdrop-blur-md h-14 rounded-full shadow-lg border border-white/50 flex items-center justify-center px-6 gap-3 pointer-events-auto overflow-hidden">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shrink-0" />
          <span className="font-bold text-base tracking-tight truncate">Ernakulam, Kerala</span>
          <div className="w-px h-6 bg-border/50 mx-1 shrink-0" />
          <div className="flex items-center gap-2 shrink-0">
            <CloudSun className="w-6 h-6 text-primary" />
            <span className="text-sm font-bold">32°C</span>
          </div>
        </div>

        <motion.div 
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate?.('account')}
          className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-white/50 pointer-events-auto"
        >
          <Settings className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </div>

      {/* Floating Action Buttons (Right) - Core 5 Features */}
      <div className="absolute right-4 top-28 z-[1000] flex flex-col gap-4">
        {/* Feature 1: Profile Access */}
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          onClick={() => onNavigate?.('account')}
          className="w-14 h-14 bg-[#3B82F6] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          <User className="w-6 h-6" />
        </motion.div>

        {/* Feature 2: Create/Add Listing */}
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          onClick={() => onNavigate?.('owner-form')}
          className="w-14 h-14 bg-[#10B981] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          <Plus className="w-7 h-7" />
        </motion.div>

        {/* Feature 3: Share Location */}
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          onClick={handleShare}
          className="w-14 h-14 bg-[#FDB714] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          {isSharing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Share2 className="w-6 h-6" />}
        </motion.div>

        {/* Feature 4: Map Layers */}
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          onClick={() => toast({ title: "Map Layers", description: "Terrain view toggled." })}
          className="w-14 h-14 bg-white text-muted-foreground rounded-full shadow-xl flex items-center justify-center cursor-pointer border border-border pointer-events-auto"
        >
          <Layers className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Feature 5: Recenter/Compass Button */}
      <div className="absolute bottom-28 right-4 z-[1000]">
        <motion.div 
          whileTap={{ scale: 0.9 }}
          onClick={handleRecenter}
          className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-2 border-primary/20 pointer-events-auto"
        >
          <Navigation2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    </div>
  );
}
