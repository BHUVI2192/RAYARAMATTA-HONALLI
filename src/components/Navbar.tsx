import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'activities', label: 'Activities' },
    { id: 'poojas', label: 'Poojas' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'slokas', label: 'Slokas' },
    { id: 'contact', label: 'Contact & Feedback' },
    { id: 'donate', label: 'Donate' },
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
            <h1 className="text-lg md:text-xl font-bold leading-tight">Shri Raghavendra Seva Trust Honali</h1>
            <p className="text-[10px] md:text-xs opacity-80 uppercase tracking-wider">Rayara Matta Honali</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => handleNavigate('donate')}
            className="bg-yellow-500 hover:bg-yellow-600 text-[#8B0000] px-4 py-1.5 rounded-full font-bold text-sm transition-all transform hover:scale-105"
          >
            Donate
          </button>
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
                <h2 className="font-bold text-lg">Menu</h2>
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
                <p className="text-xs text-gray-400">© 2024 Shri Raghavendra Seva Trust Honali</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
