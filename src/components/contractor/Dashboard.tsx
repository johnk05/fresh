"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, TrendingUp, Clock, Info } from "lucide-react";
import { Language, translations } from "@/lib/translations";

const MOCK_LISTINGS = [
  { id: 1, owner: "Anand K.", tree: "Alphonso", qty: 120, dist: 2.4, status: "open", color: "bg-green-500" },
  { id: 2, owner: "Mary J.", tree: "Priyoor", qty: 350, dist: 5.1, status: "bidding", color: "bg-yellow-500" },
  { id: 3, owner: "Thomas P.", tree: "Neelum", qty: 80, dist: 1.2, status: "completed", color: "bg-primary" },
];

export function ContractorDashboard({ language }: { language: Language }) {
  const t = translations[language];

  return (
    <div className="space-y-6 pb-24">
      <div className="relative h-64 w-full bg-muted rounded-2xl overflow-hidden shadow-inner border border-border/50">
        {/* Placeholder for Mapbox */}
        <div className="absolute inset-0 leaf-pattern opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center flex-col p-4 text-center">
          <MapPin className="w-12 h-12 text-primary animate-bounce mb-2" />
          <p className="text-sm font-medium text-muted-foreground">3 Live Listings in Palakkad</p>
        </div>
        
        {/* Animated pins */}
        {MOCK_LISTINGS.map((l, i) => (
          <motion.div
            key={l.id}
            className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg ${l.color}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1, x: [0, 5, 0], y: [0, -5, 0] }}
            transition={{ delay: i * 0.2, repeat: Infinity, duration: 3 }}
            style={{ 
              top: `${20 + i * 25}%`, 
              left: `${30 + i * 20}%` 
            }}
          />
        ))}
      </div>

      <div className="px-1">
        <h2 className="text-xl mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-accent" />
          {t.nearbyListings}
        </h2>
        
        <div className="grid gap-4">
          {MOCK_LISTINGS.map((l) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: l.id * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className={`w-2 ${l.color}`} />
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{l.owner}</h3>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <MapPin className="w-3 h-3 mr-1" /> {l.dist}km away
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-muted text-xs capitalize">
                          {l.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-muted/50 p-2 rounded flex items-center">
                          <Info className="w-3 h-3 mr-2 text-primary" />
                          <div className="text-[10px] leading-tight">
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-bold">{l.tree}</p>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded flex items-center">
                          <TrendingUp className="w-3 h-3 mr-2 text-primary" />
                          <div className="text-[10px] leading-tight">
                            <p className="text-muted-foreground">Qty</p>
                            <p className="font-bold">{l.qty} kg</p>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
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