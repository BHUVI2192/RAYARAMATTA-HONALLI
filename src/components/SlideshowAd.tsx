import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const POSTERS = [
  '/images/aradhana_poster_1.jpg',
  '/images/aradhana_poster_2.jpg'
];

export const SlideshowAd: React.FC = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % POSTERS.length);
    }, 10000); // 10 seconds
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + POSTERS.length) % POSTERS.length);
    startTimer(); // Reset the 10-second timer
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % POSTERS.length);
    startTimer(); // Reset the 10-second timer
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
    startTimer();
  };

  return (
    <section className="py-12 bg-gradient-to-b from-amber-50/30 to-amber-50/80">
      <div className="max-w-4xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-6">
          <p className="text-yellow-600 font-semibold uppercase tracking-widest text-xs mb-1">
            {t('common.announcements') || 'Announcements / ಪ್ರಕಟಣೆಗಳು'}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#8B0000]">
            355ನೇ ಆರಾಧನಾ ಮಹೋತ್ಸವ ಪ್ರಕಟಣೆ
          </h2>
          <div className="w-12 h-0.5 bg-yellow-500 rounded-full mx-auto mt-2" />
        </div>

        {/* Carousel Container */}
        <div 
          className="relative group w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-600/20 bg-black cursor-pointer aspect-[4/3] md:aspect-[16/10]"
          onClick={() => setLightboxOpen(true)}
        >
          {/* Slides */}
          <div className="w-full h-full relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={POSTERS[currentIndex]}
                alt={`Aradhana Poster ${currentIndex + 1}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-contain"
              />
            </AnimatePresence>
          </div>

          {/* Hover zoom icon overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 text-white p-3 rounded-full backdrop-blur-sm">
              <Maximize2 size={24} />
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 active:scale-95 transition duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 active:scale-95 transition duration-200"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {POSTERS.map((_, index) => (
              <button
                key={index}
                onClick={(e) => handleDotClick(index, e)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-yellow-500 scale-125 w-6' 
                    : 'bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox / Bigger Image Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 z-[210] p-3 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition duration-200"
            >
              <X size={28} />
            </button>

            {/* Modal Image Wrapper */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-5xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={POSTERS[currentIndex]}
                alt={`Aradhana Poster ${currentIndex + 1} Full Size`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />

              {/* Lightbox Nav Arrows */}
              <button
                onClick={handlePrev}
                className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition duration-200 hidden md:flex items-center justify-center"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={handleNext}
                className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition duration-200 hidden md:flex items-center justify-center"
              >
                <ChevronRight size={28} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
