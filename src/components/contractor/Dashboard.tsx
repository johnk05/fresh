
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
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";

export function ContractorDashboard({ language }: { language: Language }) {
  const t = translations[language];
  const db = useFirestore();
  const [userProfile, setUserProfile] = useState<any>(null);
  const mapImg = PlaceHolderImages.find(img => img.id === 'kerala-map');

  const listingsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "treeListings"), orderBy("createdAt", "desc"), limit(20));
  }, [db]);

  const { data: listings, isLoading: loading } = useCollection(listingsQuery);

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
      <div className="relative h-96 w-full bg-muted rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
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
        
        {/* Real-time Listing Pins */}
        {listings?.map((l, i) => (
          <motion.div
            key={l.id}
            className="absolute z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            style={{ 
              top: `${20 + (Math.random() * 60)}%`, 
              left: `${20 + (Math.random() * 60)}%` 
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
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shadow-lg border border-border">
                {l.treeType} • {l.estimatedQuantityKg}kg
              </div>
            </div>
          </motion.div>
        ))}

        {/* User's shared location pin (Snapchat Style) */}
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
                  <Badge className="bg-primary text-white p-0 text-[8px] border-none">ME</Badge>
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
          <Badge className="bg-accent text-white font-bold py-1 px-3 rounded-full">{listings?.length || 0} listings</Badge>
        </div>
      </div>

      <div className="px-1">
        <h2 className="text-2xl mb-6 flex items-center font-bold tracking-tight text-accent">
          <TrendingUp className="w-6 h-6 mr-3" />
          {t.nearbyListings}
        </h2>
        
        {loading ? (
          <div className="text-center p-12 text-muted-foreground">Loading harvests...</div>
        ) : !listings || listings.length === 0 ? (
          <div className="text-center p-12 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
             <p className="font-medium">No harvests yet.</p>
             <p className="text-sm">Tree owners will list them soon!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {listings.map((l) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-[2rem]">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-4 bg-primary transition-all group-hover:w-6" />
                      <div className="p-6 flex-1 bg-card">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-2xl group-hover:text-primary transition-colors">{l.ownerName}</h3>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-2 text-primary" /> Local Harvest
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-muted text-[10px] font-bold uppercase tracking-widest px-4 py-1">
                            {l.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-muted/30 p-4 rounded-2xl flex items-center border border-border/50">
                            <Info className="w-5 h-5 mr-4 text-primary" />
                            <div className="leading-tight">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Type</p>
                              <p className="font-bold text-md">{l.treeType}</p>
                            </div>
                          </div>
                          <div className="bg-muted/30 p-4 rounded-2xl flex items-center border border-border/50">
                            <TrendingUp className="w-5 h-5 mr-4 text-primary" />
                            <div className="leading-tight">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Qty</p>
                              <p className="font-bold text-md">{l.estimatedQuantityKg} kg</p>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl h-14 shadow-xl shadow-primary/20 text-lg" size="lg">
                          {t.placeBid} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
