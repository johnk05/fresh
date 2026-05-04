"use client";

import { Button } from "@/components/ui/button";
import { Language } from "@/lib/translations";
import { Languages } from "lucide-react";

interface LanguageToggleProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="fixed top-4 right-4 z-50 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white/80"
      onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
    >
      <Languages className="mr-2 h-4 w-4" />
      {language === 'en' ? 'മലയാളം' : 'English'}
    </Button>
  );
}