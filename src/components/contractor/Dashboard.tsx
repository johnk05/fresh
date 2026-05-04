
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { 
  User, 
  Search, 
  Settings, 
  Plus, 
  Navigation2,
  Share2,
  CloudSun,
  Loader2
} from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

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
  
  const [currentLocationName, setCurrentLocationName] = useState("Finding location...");
  const [currentTemp, setCurrentTemp] = useState(32);

  useEffect(() => {
    const savedProfileString = localStorage.getItem('fresh_user_profile');
    let profile: any = null;
    
    if (savedProfileString) {
      try {
        profile = JSON.parse(savedProfileString);
        setUserProfile(profile);
        if (profile.location) {
          setMapCenter([profile.location.lat, profile.location.lng]);
        }
        if (profile.locationName) {
          setCurrentLocationName(profile.locationName);
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }

    // Try to detect location if not shared/saved
    if (!profile?.location && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setMapCenter([lat, lng]);
          fetchLocationName(lat, lng);
        },
        () => {
          setCurrentLocationName("Kerala");
        }
      );
    }

    const savedListings = localStorage.getItem('fresh_local_listings');
    if (savedListings) {
      try {
        setListings(JSON.parse(savedListings));
      } catch (e) {
        setListings(getMockListings());
      }
    } else {
      setListings(getMockListings());
    }
  }, []);

  const getMockListings = () => [
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

  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      const addr = data.address;
      const hood = addr.suburb || addr.neighbourhood || addr.village || addr.city_district || addr.city || addr.town;
      setCurrentLocationName(hood || "Current Location");
    } catch (e) {
      setCurrentLocationName("Shared Location");
    }
  };

  const handleRecenter = () => {
    if (userProfile?.location) {
      setMapCenter([userProfile.location.lat, userProfile.location.lng]);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  };

  const handleShare = () => {
    setIsSharing(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newLocation = { lat, lng };
          
          let locationName = "Current Location";
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            const addr = data.address;
            const hood = addr.suburb || addr.neighbourhood || addr.village || addr.city_district;
            const city = addr.city || addr.town || addr.state;
            locationName = hood ? `${hood}, ${city}` : city;
          } catch (err) {
            console.error("Geocoding failed", err);
          }
          
          const updatedProfile = {
            ...userProfile,
            location: newLocation,
            locationName: locationName
          };

          setUserProfile(updatedProfile);
          setMapCenter([lat, lng]);
          setCurrentLocationName(locationName);
          setCurrentTemp(28 + Math.floor(Math.random() * 7));
          
          localStorage.setItem('fresh_user_profile', JSON.stringify(updatedProfile));
          setIsSharing(false);
          toast({
            title: t.locationShared,
            description: `Now sharing location in ${locationName}`,
          });
        },
        (error) => {
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
      <div className="absolute inset-0 z-0">
        <MapComponent 
          center={mapCenter} 
          listings={listings} 
          userLocation={userProfile?.location ? [userProfile.location.lat, userProfile.location.lng] : null}
          userName={userProfile?.name || "YOU"}
        />
      </div>

      <div className="absolute top-6 left-4 right-4 z-[1000] flex items-center justify-between gap-3 pointer-events-none">
        <motion.div 
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-white/50 pointer-events-auto"
        >
          <Search className="w-6 h-6 text-muted-foreground" />
        </motion.div>
        
        <div className="flex-1 bg-white/95 backdrop-blur-md h-14 rounded-full shadow-lg border border-white/50 flex items-center px-6 gap-3 pointer-events-auto overflow-hidden">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
          <span className="font-bold text-sm tracking-tight truncate flex-1">{currentLocationName}</span>
          <div className="w-px h-6 bg-border/50 shrink-0" />
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <CloudSun className="w-5 h-5 text-[#FDB714]" />
            <span className="text-sm font-bold">{currentTemp}°C</span>
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

      <div className="absolute right-4 top-28 z-[1000] flex flex-col gap-3">
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          onClick={() => onNavigate?.('account')}
          className="w-14 h-14 bg-[#3B82F6] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          <User className="w-6 h-6" />
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.9 }} 
          onClick={() => onNavigate?.('owner-form')}
          className="w-14 h-14 bg-[#10B981] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          <Plus className="w-7 h-7" />
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.9 }} 
          onClick={handleShare}
          className="w-14 h-14 bg-[#FDB714] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          {isSharing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Share2 className="w-6 h-6" />}
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.9 }}
          onClick={handleRecenter}
          className="w-14 h-14 bg-white text-[#FDB714] rounded-full shadow-xl flex items-center justify-center cursor-pointer border-2 border-primary/5 pointer-events-auto"
        >
          <Navigation2 className="w-7 h-7 rotate-45" />
        </motion.div>
      </div>
    </div>
  );
}
