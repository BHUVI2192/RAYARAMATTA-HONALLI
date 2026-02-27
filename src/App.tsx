import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoSection } from './components/VideoSection';
import { About } from './components/About';
import { Activities } from './components/Activities';
import { Poojas } from './components/Poojas';
import { Events } from './components/Events';
import { Gallery } from './components/Gallery';
import { Slokas } from './components/Slokas';
import { ContactFeedback } from './components/ContactFeedback';
import { Donate } from './components/Donate';
import { SevaBooking } from './components/SevaBooking';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { Seva } from './types';

export default function App() {
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
            <div className="bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-[#8B0000] mb-8">Welcome to Honali Rayara Mutt</h2>
                <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
                  Shri Raghavendra Swamy Seva Trust, Honali is a spiritual oasis dedicated to the teachings and grace of Guru Raghavendra. 
                  Located in the serene town of Honali, our Mutt serves as a center for devotion, Vedic learning, and social service.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#8B0000] mb-4">Daily Poojas</h3>
                    <p className="text-sm text-gray-500 mb-6">Experience the divine presence through our meticulously performed daily rituals.</p>
                    <button onClick={() => setCurrentPage('poojas')} className="text-[#8B0000] font-bold text-sm hover:underline">View Schedule →</button>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#8B0000] mb-4">Goshala</h3>
                    <p className="text-sm text-gray-500 mb-6">Support our mission to protect and care for the sacred cows in our Goshala.</p>
                    <button onClick={() => setCurrentPage('activities')} className="text-[#8B0000] font-bold text-sm hover:underline">Learn More →</button>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#8B0000] mb-4">Online Seva</h3>
                    <p className="text-sm text-gray-500 mb-6">Book your sevas and offerings from the comfort of your home.</p>
                    <button onClick={() => setCurrentPage('poojas')} className="text-[#8B0000] font-bold text-sm hover:underline">Book Now →</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'about': return <About />;
      case 'activities': return <Activities />;
      case 'poojas': return <Poojas onSelectSeva={handleSelectSeva} />;
      case 'events': return <Events />;
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
              setCurrentPage('poojas');
              setSelectedSeva(null);
            }}
          />
        ) : <Poojas onSelectSeva={handleSelectSeva} />;
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
