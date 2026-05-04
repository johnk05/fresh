
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, CheckCircle2, Loader2, User } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  phone: string;
  location: { lat: number; lng: number } | null;
  locationName: string;
}

export function AccountPage({ language }: { language: Language }) {
  const t = translations[language];
  const { toast } = useToast();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    phone: "",
    location: null,
    locationName: ""
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('fresh_user_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('fresh_user_profile', JSON.stringify(profile));
    }
  }, [profile, isHydrated]);

  const handleShareLocation = () => {
    setIsSharing(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          let locationName = "Current Shared Location";
          try {
            // Real Reverse Geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.lat}&lon=${newLocation.lng}`);
            const data = await response.json();
            const addr = data.address;
            const hood = addr.suburb || addr.neighbourhood || addr.village || addr.city_district;
            const city = addr.city || addr.town || addr.state;
            
            if (hood && city) {
              locationName = `${hood}, ${city}`;
            } else if (city) {
              locationName = city;
            }
          } catch (err) {
            console.error("Geocoding failed", err);
          }

          const updated = {
            ...profile,
            location: newLocation,
            locationName: locationName
          };
          setProfile(updated);
          setIsSharing(false);
          toast({
            title: t.locationShared,
            description: `Location saved: ${locationName}`,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsSharing(false);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Please enable location permissions in your browser.",
          });
        }
      );
    } else {
      setIsSharing(false);
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Your browser does not support geolocation.",
      });
    }
  };

  if (!isHydrated) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-none shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10 text-center pb-8 pt-10">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 relative overflow-hidden group">
            <User className="w-10 h-10 text-primary" />
            <motion.div 
              className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <CardTitle className="text-2xl font-headline text-accent">{t.profile}</CardTitle>
          <CardDescription>{t.personalInfo}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                placeholder="Rahul Nair"
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t.phone}</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">{t.location}</Label>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className={`w-full h-24 rounded-2xl border-2 flex flex-col gap-2 relative overflow-hidden group transition-all duration-300 ${
                  profile.location ? 'border-primary/50 bg-primary/5' : 'border-dashed border-muted-foreground/30'
                }`}
                onClick={handleShareLocation}
                disabled={isSharing}
              >
                <motion.div
                  className="absolute -right-4 -bottom-4 opacity-10 text-primary pointer-events-none"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Globe className="w-32 h-32" />
                </motion.div>

                {isSharing ? (
                  <>
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    <span className="font-medium text-sm">{t.sharingLocation}</span>
                  </>
                ) : profile.location ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <div className="text-center px-4">
                      <p className="font-bold text-primary truncate max-w-[200px]">{profile.locationName || t.locationShared}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {profile.location.lat.toFixed(4)}, {profile.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Globe className="w-8 h-8 text-primary" />
                    </motion.div>
                    <span className="font-medium text-sm">{t.shareLocation}</span>
                  </>
                )}
              </Button>
            </motion.div>
            
            <p className="text-[10px] text-center text-muted-foreground px-4">
              Your location is visible on the harvest map to help contractors find routes.
            </p>
          </div>

          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl py-6 mt-4 shadow-lg shadow-accent/20"
            onClick={() => {
              localStorage.setItem('fresh_user_profile', JSON.stringify(profile));
              toast({
                title: "Profile Updated",
                description: "Your settings have been saved locally.",
              });
            }}
          >
            {t.saveProfile}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
