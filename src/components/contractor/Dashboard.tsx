
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, TrendingUp, Info, User } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const MOCK_LISTINGS = [
  { id: 1, owner: "Anand K.", tree: "Alphonso", qty: 120, dist: 2.4, status: "open", color: "bg-green-500", top: "25%", left: "40%" },
  { id: 2, owner: "Mary J.", tree: "Priyoor", qty: 350, dist: 5.1, status: "bidding", color: "bg-yellow-500", top: "45%", left: "60%" },
  { id: 3, owner: "Thomas P.", tree: "Neelum", qty: 80, dist: 1.2, status: "completed", color: "bg-primary", top: "65%", left: "35%" },
];

export function ContractorDashboard({ language }: { language: Language }) {
  const t = translations[language];
  const [userProfile, setUserProfile] = useState<any>(null);
  const mapImg = PlaceHolderImages.find(img => img.id === 'kerala-map');

  useEffect(() => {
    const saved = localStorage.getItem('fresh_user_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load profile for dashboard", e);
      }
    }
  }, []);

  return (
    <div className="space-y-6 pb-24">
      {/* Snapchat-style Map View */}
      <div className="relative h-80 w-full bg-muted rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
        {mapImg && (
          <Image 
            src={mapImg.imageUrl} 
            alt={mapImg.description} 
            fill 
            className="object-cover opacity-60 grayscale-[0.3] contrast-[1.1]"
            data-ai-hint={mapImg.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
        
        {/* Animated pins for listings */}
        {MOCK_LISTINGS.map((l, i) => (
          <motion.div
            key={l.id}
            className="absolute z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.2, type: "spring" }}
            style={{ top: l.top, left: l.left }}
          >
            <div className="relative group cursor-pointer">
              <div className={`w-8 h-8 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-bold text-[10px] ${l.color} animate-pulse`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-bold whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {l.owner} • {l.qty}kg
              </div>
            </div>
          </motion.div>
        ))}

        {/* User's shared location pin */}
        {userProfile?.location && (
          <motion.div
            className="absolute z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ top: "50%", left: "50%" }}
          >
            <div className="flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 rounded-full border-4 border-primary bg-white shadow-2xl flex items-center justify-center overflow-hidden">
                <User className="w-6 h-6 text-primary" />
              </div>
              <Badge className="mt-1 bg-primary text-white text-[8px] uppercase tracking-tighter shadow-lg">You</Badge>
            </div>
          </motion.div>
        )}

        <div className="absolute bottom-4 left-4 right-4 bg-white/40 backdrop-blur-lg border border-white/40 p-3 rounded-2xl flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-accent uppercase tracking-wider leading-none mb-1">Live Zone</p>
              <p className="text-sm font-bold leading-none">Palakkad District</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white/50 border-none font-bold text-[10px]">3 Listings</Badge>
        </div>
      </div>

      <div className="px-1">
        <h2 className="text-xl mb-4 flex items-center font-bold tracking-tight">
          <TrendingUp className="w-5 h-5 mr-2 text-accent" />
          {t.nearbyListings}
        </h2>
        
        <div className="grid gap-4">
          {MOCK_LISTINGS.map((l) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: l.id * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-2xl">
                <CardContent className="p-0">
                  <div className="flex h-full">
                    <div className={`w-3 ${l.color} transition-all group-hover:w-4`} />
                    <div className="p-5 flex-1 bg-card">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{l.owner}</h3>
                          <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1 text-primary" /> {l.dist}km away
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-muted text-[10px] font-bold uppercase tracking-widest px-3">
                          {l.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-muted/30 p-3 rounded-xl flex items-center border border-border/50">
                          <Info className="w-4 h-4 mr-3 text-primary" />
                          <div className="leading-tight">
                            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Type</p>
                            <p className="font-bold text-sm">{l.tree}</p>
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-xl flex items-center border border-border/50">
                          <TrendingUp className="w-4 h-4 mr-3 text-primary" />
                          <div className="leading-tight">
                            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Qty</p>
                            <p className="font-bold text-sm">{l.qty} kg</p>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 shadow-lg shadow-primary/20" size="sm">
                        {t.placeBid} <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
