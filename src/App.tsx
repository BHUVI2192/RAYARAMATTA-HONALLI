import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoSection } from './components/VideoSection';
import { About } from './components/About';
import { Activities } from './components/Activities';
import { SevaVivara } from './components/SevaVivara';
import { Sevas } from './components/Sevas';
import { Gallery } from './components/Gallery';
import { Slokas } from './components/Slokas';
import { ContactFeedback } from './components/ContactFeedback';
import { Donate } from './components/Donate';
import { SevaBooking } from './components/SevaBooking';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { Seva } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSeva, setSelectedSeva] = useState<Seva | null>(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleSelectSeva = (seva: Seva) => {
    setSelectedSeva(seva);
    setCurrentPage('booking');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero />
            <VideoSection />
            <WelcomeSection onNavigate={setCurrentPage} />
          </motion.div>
        );
      case 'about': return <About />;
      case 'activities': return <Activities />;
      case 'seva-vivara': return <SevaVivara onSelectSeva={handleSelectSeva} />;
      case 'sevas': return <Sevas onSelectSeva={handleSelectSeva} />;
      case 'gallery': return <Gallery />;
      case 'slokas': return <Slokas />;
      case 'contact': return <ContactFeedback />;
      case 'donate': return <Donate />;
      case 'booking': 
        return selectedSeva ? (
          <SevaBooking 
            selectedSeva={selectedSeva} 
            onComplete={() => {
              alert('Booking Successful!');
              setCurrentPage('home');
              setSelectedSeva(null);
            }}
            onCancel={() => {
              setCurrentPage('seva-vivara');
              setSelectedSeva(null);
            }}
          />
        ) : <SevaVivara onSelectSeva={handleSelectSeva} />;
      default: return <Hero />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-yellow-200 selection:text-[#8B0000]">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <main>
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

interface WelcomeSectionProps {
  onNavigate: (page: string) => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[#8B0000] mb-8">{t('welcome.title')}</h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
          {t('welcome.desc')}
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#8B0000] mb-4">{t('welcome.seva-vivara.title')}</h3>
            <p className="text-sm text-gray-500 mb-6">{t('welcome.seva-vivara.desc')}</p>
            <button onClick={() => onNavigate('seva-vivara')} className="text-[#8B0000] font-bold text-sm hover:underline">{t('welcome.view')} →</button>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#8B0000] mb-4">{t('welcome.goshala.title')}</h3>
            <p className="text-sm text-gray-500 mb-6">{t('welcome.goshala.desc')}</p>
            <button onClick={() => onNavigate('activities')} className="text-[#8B0000] font-bold text-sm hover:underline">{t('welcome.more')} →</button>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#8B0000] mb-4">{t('welcome.online.title')}</h3>
            <p className="text-sm text-gray-500 mb-6">{t('welcome.online.desc')}</p>
            <button onClick={() => onNavigate('seva-vivara')} className="text-[#8B0000] font-bold text-sm hover:underline">{t('welcome.book')} →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
