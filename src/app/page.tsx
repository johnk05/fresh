
"use client";

import { useState, useEffect } from "react";
import { MangoDrop } from "@/components/intro/MangoDrop";
import { LanguageToggle } from "@/components/LanguageToggle";
import { RoleSelector } from "@/components/RoleSelector";
import { TreeRegistration } from "@/components/owner/TreeRegistration";
import { ContractorDashboard } from "@/components/contractor/Dashboard";
import { ListingsView } from "@/components/contractor/ListingsView";
import { AccountPage } from "@/components/profile/AccountPage";
import { Language } from "@/lib/translations";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ClipboardList, Map as MapIcon, User } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

type AppView = 'landing' | 'owner-form' | 'owner-done' | 'contractor-dash' | 'listings' | 'account';

export default function FreshApp() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [language, setLanguage] = useState<Language>('manglish');
  const [view, setView] = useState<AppView>('landing');

  useEffect(() => {
    const savedView = localStorage.getItem('fresh_view');
    const savedLang = localStorage.getItem('fresh_lang');
    
    if (savedView) setView(savedView as any);
    if (savedLang) setLanguage(savedLang as any);
    
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('fresh_view', view);
      localStorage.setItem('fresh_lang', language);
    }
  }, [view, language, isHydrated]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('fresh_seen_intro', 'true');
  };

  if (!isHydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  if (showIntro) {
    return <MangoDrop onComplete={handleIntroComplete} />;
  }

  return (
    <div className="max-w-md mx-auto relative min-h-screen">
      <header className="p-6 pt-12">
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-headline font-bold text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Fresh
          </motion.h1>
          <LanguageToggle language={language} setLanguage={setLanguage} />
        </div>
      </header>

      <main className="px-6 pb-32">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RoleSelector 
                language={language} 
                onSelect={(role) => setView(role === 'owner' ? 'owner-form' : 'contractor-dash')} 
              />
            </motion.div>
          )}

          {view === 'owner-form' && (
            <motion.div
              key="owner-form"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="pt-4"
            >
              <TreeRegistration language={language} onComplete={() => setView('owner-done')} />
            </motion.div>
          )}

          {view === 'owner-done' && (
            <motion.div
              key="owner-done"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center pt-20 space-y-6"
            >
              <div className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center text-white shadow-xl">
                <Home className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold">Successfully Listed!</h2>
              <p className="text-muted-foreground">Local contractors will be notified on WhatsApp shortly.</p>
              <button 
                onClick={() => {
                  localStorage.removeItem('fresh_tree_form');
                  localStorage.removeItem('fresh_tree_step');
                  setView('owner-form');
                }}
                className="text-primary font-bold hover:underline"
              >
                Register another tree
              </button>
            </motion.div>
          )}

          {view === 'contractor-dash' && (
            <motion.div
              key="contractor-dash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ContractorDashboard language={language} />
            </motion.div>
          )}

          {view === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ListingsView language={language} />
            </motion.div>
          )}

          {view === 'account' && (
            <motion.div
              key="account"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <AccountPage language={language} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {(view !== 'landing') && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-border flex justify-around items-center h-24 px-6 z-40">
          <NavButton 
            icon={<Home className="w-6 h-6" />} 
            active={view === 'owner-form' || view === 'owner-done'} 
            onClick={() => setView('owner-form')} 
          />
          <NavButton 
            icon={<MapIcon className="w-6 h-6" />} 
            active={view === 'contractor-dash'} 
            onClick={() => setView('contractor-dash')} 
          />
          <NavButton 
            icon={<ClipboardList className="w-6 h-6" />} 
            active={view === 'listings'} 
            onClick={() => setView('listings')} 
          />
          <NavButton 
            icon={<User className="w-6 h-6" />} 
            active={view === 'account'} 
            onClick={() => setView('account')} 
          />
        </nav>
      )}

      <Toaster />
    </div>
  );
}

function NavButton({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center ${active ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110 -translate-y-2' : 'text-muted-foreground hover:bg-muted'}`}
    >
      {icon}
      {active && <motion.div layoutId="nav-dot" className="w-1.5 h-1.5 bg-white rounded-full mt-1" />}
    </button>
  );
}
