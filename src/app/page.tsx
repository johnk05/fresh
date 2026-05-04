
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
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    const savedView = localStorage.getItem('fresh_view');
    const savedLang = localStorage.getItem('fresh_lang');
    const savedProfile = localStorage.getItem('fresh_user_profile');
    
    if (savedLang) setLanguage(savedLang as any);
    
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        // Only consider returning user if they have basic info
        if (parsed.name || parsed.phone) {
          setIsReturningUser(true);
          setView('contractor-dash');
        } else {
          setView('landing');
        }
      } catch (e) {
        setView('landing');
      }
    } else if (savedView) {
      setView(savedView as any);
    } else {
      setView('landing');
    }
    
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
  };

  if (!isHydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  if (showIntro) {
    return <MangoDrop onComplete={handleIntroComplete} />;
  }

  return (
    <div className="max-w-md mx-auto relative min-h-screen">
      {/* Conditionally hide standard header for the full-screen map dashboard */}
      {view !== 'contractor-dash' && view !== 'listings' && (
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
      )}

      {/* Adjust main padding for the full-screen views */}
      <main className={`${(view === 'contractor-dash' || view === 'listings') ? 'px-6 pt-12' : 'px-6'} pb-32`}>
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
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-border/50 flex justify-around items-end h-28 px-8 z-40 rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          {/* Only show Home and Account if NOT a returning user with data */}
          {!isReturningUser && (
            <NavButton 
              icon={<Home className="w-6 h-6" />} 
              active={view === 'owner-form' || view === 'owner-done'} 
              onClick={() => setView('owner-form')} 
            />
          )}
          
          <NavButton 
            icon={<MapIcon className="w-7 h-7" />} 
            active={view === 'contractor-dash'} 
            onClick={() => setView('contractor-dash')} 
          />
          
          <NavButton 
            icon={<ClipboardList className="w-7 h-7" />} 
            active={view === 'listings'} 
            onClick={() => setView('listings')} 
          />
          
          {!isReturningUser && (
            <NavButton 
              icon={<User className="w-6 h-6" />} 
              active={view === 'account'} 
              onClick={() => setView('account')} 
            />
          )}
        </nav>
      )}

      <Toaster />
    </div>
  );
}

function NavButton({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <div className="flex flex-col items-center pb-6">
      <button 
        onClick={onClick}
        className={`relative p-5 rounded-[2rem] transition-all duration-300 flex items-center justify-center ${
          active 
            ? 'bg-primary text-white shadow-[0_15px_30px_-5px_rgba(253,183,20,0.4)] scale-105 -translate-y-2' 
            : 'text-muted-foreground hover:bg-muted/50'
        }`}
      >
        {icon}
      </button>
      <div className="h-1.5 mt-2">
        {active && (
          <motion.div 
            layoutId="nav-dot" 
            className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(253,183,20,0.8)]" 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </div>
    </div>
  );
}
