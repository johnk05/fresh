"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TreePine, Truck, ShoppingBag } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface RoleSelectorProps {
  language: Language;
  onSelect: (role: 'owner' | 'contractor') => void;
}

export function RoleSelector({ language, onSelect }: RoleSelectorProps) {
  const t = translations[language];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 space-y-12">
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-headline font-bold text-accent">
          {t.question}
        </h2>
        <p className="text-xl font-body text-muted-foreground">
          {t.questionSub}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 w-full max-w-md">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="w-full h-32 text-xl flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20"
            onClick={() => onSelect('owner')}
          >
            <TreePine className="w-10 h-10" />
            {t.ctaTree}
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="outline" 
            className="w-full h-32 text-xl flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-muted-foreground/20 hover:bg-muted text-muted-foreground shadow-lg"
            onClick={() => onSelect('contractor')}
          >
            <div className="flex gap-4">
              <Truck className="w-8 h-8" />
              <ShoppingBag className="w-8 h-8" />
            </div>
            {t.ctaOther}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}