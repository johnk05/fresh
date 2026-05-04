
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
import { CalendarIcon, Sparkles } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { getDynamicPricingSuggestion, TreeOwnerDynamicPricingOutput } from "@/ai/flows/tree-owner-dynamic-pricing";

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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('fresh_tree_form');
    const savedStep = localStorage.getItem('fresh_tree_step');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.date) parsed.date = new Date(parsed.date);
        setFormData(parsed);
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
    if (savedStep) setStep(parseInt(savedStep));
    if (!formData.date) setFormData(prev => ({ ...prev, date: new Date() }));
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

  const handleFinalSubmit = () => {
    const listingData = {
      id: Math.random().toString(36).substr(2, 9),
      ownerName: formData.name,
      phone: formData.phone,
      treeType: formData.treeType,
      estimatedQuantityKg: formData.quantity,
      preferredClearanceDate: formData.date?.toISOString().split('T')[0],
      location: formData.location,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    // Save locally
    const existing = localStorage.getItem('fresh_local_listings');
    const listings = existing ? JSON.parse(existing) : [];
    listings.push(listingData);
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
            max={500}
            min={10}
            step={10}
            className="mt-4"
          />
        </div>
      </div>
    )},
    { title: t.preferredDate, component: (
      <div className="space-y-4">
        <div>
          <Label>{t.preferredDate}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : <span>Loading date...</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date || undefined}
                onSelect={(d) => d && setFormData({...formData, date: d})}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>{t.notes}</Label>
          <Input 
            value={formData.notes} 
            onChange={e => setFormData({...formData, notes: e.target.value})}
            placeholder="Tree near gate, morning harvest preferred..."
            className="mt-1"
          />
        </div>
      </div>
    )},
    { title: "Review", component: (
      <div className="space-y-6">
        <div className="p-4 bg-muted rounded-lg border border-primary/20">
          <h3 className="font-bold flex items-center mb-2">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            {t.suggestedPrice}
          </h3>
          {aiPrice ? (
            <div className="space-y-2">
              <p className="text-3xl font-headline font-bold text-primary">₹{aiPrice.suggestedPricePerKg}/kg</p>
              <p className="text-xs text-muted-foreground">{aiPrice.reasoning}</p>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full border-dashed"
              onClick={handlePricing}
              disabled={isPricingLoading}
            >
              {isPricingLoading ? "Calculating..." : t.getPricing}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Type</p><p className="font-medium">{formData.treeType}</p></div>
          <div><p className="text-muted-foreground">Qty</p><p className="font-medium">{formData.quantity} kg</p></div>
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
          <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded-full">Step {step}/4</span>
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
            {steps[step - 1].component}
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
              if (step < 4) {
                setStep(step + 1);
              } else {
                handleFinalSubmit();
              }
            }}
          >
            {step === 4 ? t.submit : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
