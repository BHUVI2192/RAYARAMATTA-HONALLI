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
import { AdminPanel } from './components/AdminPanel';
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
  const [currentPage, setCurrentPageState] = useState(() => {
    const saved = localStorage.getItem('currentPage');
    // Never restore admin from localStorage — must use #admin hash
    if (saved === 'admin') return 'home';
    return saved || 'home';
  });
  const [selectedSeva, setSelectedSevaState] = useState<Seva | null>(() => {
    const saved = localStorage.getItem('selectedSeva');
    return saved ? JSON.parse(saved) : null;
  });

  const setCurrentPage = (page: string) => {
    setCurrentPageState(page);
    // Don't persist admin in localStorage — it's a secret route
    if (page !== 'admin') {
      localStorage.setItem('currentPage', page);
    }
  };

  const setSelectedSeva = (seva: Seva | null) => {
    setSelectedSevaState(seva);
    if (seva) {
      localStorage.setItem('selectedSeva', JSON.stringify(seva));
    } else {
      localStorage.removeItem('selectedSeva');
    }
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Handle secret admin access via URL hash (#admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentPage('admin');
      } else if (window.location.hash === '#home') {
        setCurrentPage('home');
      }
    };

    // Check on initial load only if hash exists
    if (window.location.hash) {
      handleHashChange();
    }

    // Check for Razorpay redirect signatures
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('razorpay_payment_id') || urlParams.has('razorpay_payment_link_id')) {
        // If it's a redirect after godana payment, stay on activities page
        if (localStorage.getItem('currentPage') === 'activities') {
           setCurrentPage('activities');
        } else {
           // Booking flow — ensure selectedSeva is recovered so SevaBooking mounts
           const savedSevaRaw = localStorage.getItem('selectedSeva');
           if (!savedSevaRaw) {
             // Try to recover from sevaBookingForm
             const savedFormRaw = localStorage.getItem('sevaBookingForm');
             if (savedFormRaw) {
               try {
                 const parsedForm = JSON.parse(savedFormRaw);
                 if (parsedForm?.seva) {
                   setSelectedSeva(parsedForm.seva);
                 }
               } catch (e) { /* ignore parse errors */ }
             }
           }
           setCurrentPage('booking');
        }
    }

    // Listen for changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
              setCurrentPage('home');
              setSelectedSeva(null);
            }}
            onCancel={() => {
              setCurrentPage('seva-vivara');
              setSelectedSeva(null);
            }}
          />
        ) : <SevaVivara onSelectSeva={handleSelectSeva} />;
      case 'admin':
        return <AdminPanel />;
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
