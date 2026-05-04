
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin, User } from "lucide-react";
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
          location: { lat: 10.8505, lng: 76.2711 }
        },
        {
          id: '2',
          ownerName: 'Meera Nair',
          treeType: 'Priyoor',
          estimatedQuantityKg: 80,
          status: 'open',
          location: { lat: 10.8605, lng: 76.2811 }
        }
      ];
      setListings(mockListings);
    }
  }, []);

  return (
    <div className="space-y-6 pb-24">
      <div className="relative h-[60vh] w-full bg-muted rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
        {mapImg && (
          <Image 
            src={mapImg.imageUrl} 
            alt={mapImg.description} 
            fill 
            className="object-cover opacity-80 contrast-[1.1] brightness-[0.9]"
            data-ai-hint={mapImg.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
        
        {listings.map((l, i) => (
          <motion.div
            key={l.id}
            className="absolute z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            style={{ 
              top: `${30 + (i * 10)}%`, 
              left: `${40 + (i * 15)}%` 
            }}
          >
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center p-0.5 overflow-hidden">
                 <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white">
                    <MapPin className="w-5 h-5" />
                 </div>
              </div>
              <motion.div 
                className="absolute inset-0 bg-primary rounded-full -z-10"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        ))}

        {userProfile?.location && (
          <motion.div
            className="absolute z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ top: "50%", left: "50%" }}
          >
            <div className="flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-4 border-white bg-accent shadow-2xl flex items-center justify-center overflow-hidden">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                  <Badge className="bg-primary text-white p-0 text-[8px] border-none px-1">ME</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-4 rounded-3xl flex items-center justify-between shadow-2xl border border-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none mb-1">Live Zone</p>
              <p className="text-lg font-bold leading-none tracking-tight">Active Harvests</p>
            </div>
          </div>
          <Badge className="bg-accent text-white font-bold py-1 px-3 rounded-full">{listings.length} listings</Badge>
        </div>
      </div>
    </div>
  );
}
