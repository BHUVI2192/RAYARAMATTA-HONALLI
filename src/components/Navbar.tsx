import React, { useState } from 'react';
import { Menu, X, ChevronRight, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const menuItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'activities', label: t('nav.activities') },
    { id: 'seva-vivara', label: t('nav.seva-vivara') },
    { id: 'sevas', label: t('nav.sevas') },
    { id: 'gallery', label: t('nav.gallery') },
    { id: 'slokas', label: t('nav.slokas') },
    { id: 'contact', label: t('nav.contact') },
    { id: 'donate', label: t('nav.donate') },
  ];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#8B0000] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold leading-tight">{t('nav.title')}</h1>
            <p className="text-[10px] md:text-xs opacity-80 uppercase tracking-wider">{t('nav.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-medium border border-white/20"
          >
            <Languages size={16} />
            <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
          </button>
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => handleNavigate('donate')}
              className="bg-yellow-500 hover:bg-yellow-600 text-[#8B0000] px-4 py-1.5 rounded-full font-bold text-sm transition-all transform hover:scale-105"
            >
              {t('nav.donate')}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white text-[#8B0000] z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-bottom border-gray-100 flex justify-between items-center bg-[#8B0000] text-white">
                <h2 className="font-bold text-lg">{t('nav.menu')}</h2>
                <button onClick={() => setIsOpen(false)}><X size={24} /></button>
              </div>
              <div className="py-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      currentPage === item.id ? 'bg-gray-100 font-bold' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={16} className="opacity-30" />
                  </button>
                ))}
              </div>
              <div className="p-6 text-center">
                <p className="text-xs text-gray-400">© 2024 {t('nav.title')}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
