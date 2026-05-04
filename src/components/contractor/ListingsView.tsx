
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, TrendingUp, Info } from "lucide-react";
import { Language, translations } from "@/lib/translations";

export function ListingsView({ language }: { language: Language }) {
  const t = translations[language];
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
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
      <h2 className="text-2xl mb-6 flex items-center font-bold tracking-tight text-accent px-1">
        <TrendingUp className="w-6 h-6 mr-3" />
        {t.nearbyListings}
      </h2>
      
      {listings.length === 0 ? (
        <div className="text-center p-12 bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted">
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
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-[2.5rem] bg-white">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-4 bg-primary transition-all group-hover:w-6" />
                    <div className="p-8 flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-bold text-3xl group-hover:text-primary transition-colors">{l.ownerName}</h3>
                          <p className="text-sm text-muted-foreground flex items-center mt-2">
                            <MapPin className="w-4 h-4 mr-2 text-primary" /> Local Harvest
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                          {l.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/20 p-5 rounded-[1.5rem] flex items-center border border-border/30">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm">
                            <Info className="w-5 h-5 text-primary" />
                          </div>
                          <div className="leading-tight">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Type</p>
                            <p className="font-bold text-md">{l.treeType}</p>
                          </div>
                        </div>
                        <div className="bg-muted/20 p-5 rounded-[1.5rem] flex items-center border border-border/30">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm">
                            <TrendingUp className="w-5 h-5 text-primary" />
                          </div>
                          <div className="leading-tight">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Qty</p>
                            <p className="font-bold text-md">{l.estimatedQuantityKg} kg</p>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-[1.5rem] h-16 shadow-xl shadow-primary/20 text-xl" size="lg">
                        {t.placeBid} <ArrowRight className="ml-2 w-6 h-6" />
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
  );
}
