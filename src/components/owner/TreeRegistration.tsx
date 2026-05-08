
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Sparkles, MapPin, Loader2 } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { getDynamicPricingSuggestion, TreeOwnerDynamicPricingOutput } from "@/ai/flows/tree-owner-dynamic-pricing";
import { supabase } from "@/lib/supabase";

export function TreeRegistration({ language, onComplete }: { language: Language, onComplete: () => void }) {
  const t = translations[language];
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    treeType: string;
    quantity: number;
    date: Date | null;
    location: { lat: number; lng: number };
    notes: string;
  }>({
    name: "",
    phone: "",
    treeType: "Alphonso",
    quantity: 50,
    date: null,
    location: { lat: 10.8505, lng: 76.2711 },
    notes: ""
  });
  const [aiPrice, setAiPrice] = useState<TreeOwnerDynamicPricingOutput | null>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('fresh_tree_form');
    const savedStep = localStorage.getItem('fresh_tree_step');
    const savedProfile = localStorage.getItem('fresh_user_profile');
    
    let initialData = { ...formData };
    
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        initialData.name = profile.name || "";
        initialData.phone = profile.phone || "";
        if (profile.location) {
          initialData.location = profile.location;
        }
      } catch (e) {}
    }

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.date) parsed.date = new Date(parsed.date);
        initialData = { ...initialData, ...parsed };
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }

    setFormData(initialData);

    if (savedStep) {
      const parsedStep = parseInt(savedStep);
      setStep(Math.min(parsedStep, 2)); // Cap at current max steps
    } else if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.name && profile.phone) {
          setStep(2); // Skip Step 1 if profile is already set
        }
      } catch (e) {}
    }

    if (!initialData.date) setFormData(prev => ({ ...prev, date: new Date() }));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('fresh_tree_form', JSON.stringify(formData));
      localStorage.setItem('fresh_tree_step', step.toString());
    }
  }, [formData, step, isHydrated]);

  const handlePricing = async () => {
    setIsPricingLoading(true);
    try {
      const result = await getDynamicPricingSuggestion({
        treeType: formData.treeType,
        estimatedQuantity: formData.quantity,
        location: formData.location,
        qualityDescription: formData.notes,
        currentMarketPriceData: "Palakkad market Alphonso: 60-70 INR/kg, Ernakulam market Priyoor: 50-65 INR/kg",
        localDemandDescription: "Moderate demand, early season"
      });
      setAiPrice(result);
    } catch (error) {
      console.error("AI Pricing Error:", error);
    } finally {
      setIsPricingLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation not supported");
      return;
    }
    setIsLocating(true);
    setLocationStatus("Locating...");
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }));
        setLocationStatus("Location updated!");
        setIsLocating(false);
      },
      (err) => {
        setLocationStatus("Failed to get location");
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleFinalSubmit = async () => {
    const listingData = {
      name: formData.name,
      phone_number: formData.phone,
      tree_type: formData.treeType,
      quantity: formData.quantity,
      clearance_date: formData.date?.toISOString().split('T')[0],
      location: formData.location,
      notes: formData.notes,
      status: "open",
    };

    try {
      const { error } = await supabase
        .from('tree_listings')
        .insert([listingData]);

      if (error) throw error;
      
      console.log("Successfully saved to Supabase");

      // Save to user profile if not already set or updated
      const savedProfile = localStorage.getItem('fresh_user_profile');
      if (!savedProfile) {
        const profile = {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          locationName: "Registered Location"
        };
        localStorage.setItem('fresh_user_profile', JSON.stringify(profile));
      }
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      // Fallback to local storage if needed, or handle error
    }

    // Still save locally as a backup or for immediate UI updates if needed
    const existing = localStorage.getItem('fresh_local_listings');
    const listings = existing ? JSON.parse(existing) : [];
    listings.push({ ...listingData, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() });
    localStorage.setItem('fresh_local_listings', JSON.stringify(listings));

    localStorage.removeItem('fresh_tree_form');
    localStorage.removeItem('fresh_tree_step');
    onComplete();
  };

  const steps = [
    { title: t.name, component: (
      <div className="space-y-4">
        <div>
          <Label>{t.name}</Label>
          <Input 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Rahul Nair"
            className="mt-1"
          />
        </div>
        <div>
          <Label>{t.phone}</Label>
          <Input 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})}
            placeholder="+91 9876543210"
            className="mt-1"
          />
        </div>
        <div className="pt-2">
          <Label>Current Location (Current Location)</Label>
          <div className="flex items-center gap-2 mt-2">
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex-1 border-primary/30 hover:bg-primary/5 h-10"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 mr-2 text-primary" />
              )}
              {isLocating ? "Locating..." : "Use My Current Location"}
            </Button>
          </div>
          {locationStatus && (
            <p className={`text-xs mt-1.5 ${locationStatus.includes('Failed') ? 'text-destructive' : 'text-primary font-medium'}`}>
              {locationStatus} {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>
    )},
    { title: t.treeType, component: (
      <div className="space-y-4">
        <div>
          <Label>മാവ് Inam</Label>
          <Select value={formData.treeType} onValueChange={v => setFormData({...formData, treeType: v})}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alphonso">Alphonso</SelectItem>
              <SelectItem value="Priyoor">Priyoor</SelectItem>
              <SelectItem value="Neelum">Neelum</SelectItem>
              <SelectItem value="Mulgoba">Mulgoba</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="flex justify-between">
            {t.estimatedQuantity} <span>{formData.quantity} kg</span>
          </Label>
          <Slider 
            value={[formData.quantity]} 
            onValueChange={([v]) => setFormData({...formData, quantity: v})}
            max={200}
            min={1}
            step={1}
            className="mt-4"
          />
        </div>
      </div>
    )}
  ];

  if (!isHydrated) return null;

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-none shadow-xl">
      <CardHeader className="bg-primary/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Ente മാവ് register cheyyuka</CardTitle>
          <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded-full">Step {step}/2</span>
        </div>
        <CardDescription>{t.registerTreeSub}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="min-h-[220px]"
          >
            {steps[step - 1]?.component}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8 gap-4">
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              {t.back}
            </Button>
          )}
          <Button 
            className="flex-1 bg-accent hover:bg-accent/90 text-white" 
            onClick={() => {
              if (step < 2) {
                setStep(step + 1);
              } else {
                handleFinalSubmit();
              }
            }}
          >
            {step === 2 ? t.submit : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
