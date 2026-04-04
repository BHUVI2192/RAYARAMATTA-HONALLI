import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const slides = [
  {
    src: '/images/529710803_18093477652639429_5830789645073796337_n.webp',
    caption: 'ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿ ಮಠ, ಹೊನ್ನಾಳಿ',
  },
  {
    src: '/images/530985758_18093605020639429_4615635884927217154_n.webp',
    caption: 'ಶ್ರೀ ರಾಯರ ಬೃಂದಾವನ ದರ್ಶನ',
  },
  {
    src: '/images/469072055_609756388055902_7005467819425736701_n.jpg',
    caption: 'ಶ್ರೀ ರಾಯರ ಅಭಿಷೇಕ ಸೇವೆ',
  },
  {
    src: '/images/531286051_18093605038639429_6413714965315958363_n.webp',
    caption: 'ವಿಶೇಷ ಉತ್ಸವ ಅಲಂಕಾರ',
  },
  {
    src: '/images/530843281_18093604984639429_1449346656347248637_n.webp',
    caption: 'ಮಠದ ನಿತ್ಯ ಪೂಜೆ',
  },
  {
    src: '/images/531978017_18093604990639429_2204854191744847342_n.webp',
    caption: 'ಶ್ರೀ ರಾಯರ ಆರಾಧನೆ ಮಹೋತ್ಸವ',
  },
  {
    src: '/images/469260819_609774168054124_3699722170139197903_n.jpg',
    caption: 'ಭಕ್ತರ ಸೇವಾ ಸಮರ್ಪಣೆ',
  },
  {
    src: '/images/530618472_18093605002639429_1532166081922685035_n.webp',
    caption: 'ಪವಿತ್ರ ಬೃಂದಾವನ ಸನ್ನಿಧಿ',
  },
  {
    src: '/images/488504163_696163352794568_2389405504010046181_n.jpg',
    caption: 'ಶ್ರೀ ಮಠದ ವಿಶೇಷ ಸೇವೆ',
  },
  {
    src: '/images/IMG-20260302-WA0030.jpg',
    caption: 'ಹೊನ್ನಾಳಿ ರಾಯರ ಮಠ — ಭಕ್ತರ ಆರಾಧ್ಯ ಕ್ಷೇತ್ರ',
  },
];

export const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[60vh] md:h-[80vh] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={slides[currentIndex].src}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-6xl font-bold mb-4 drop-shadow-lg"
        >
          {t('hero.title')}
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg md:text-2xl max-w-2xl font-light italic opacity-90"
        >
          {t('hero.mantra')}
        </motion.p>
        <AnimatePresence mode="wait">
          <motion.p
            key={`caption-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-4 text-sm md:text-lg font-medium text-yellow-300 tracking-widest uppercase drop-shadow-md"
          >
            {slides[currentIndex].caption}
          </motion.p>
        </AnimatePresence>
      </div>

      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all"
      >
        <ChevronRight size={32} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === i ? 'w-8 bg-yellow-500' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
