import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Video, X, Maximize2, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const photos = [
  '/images/blood donation.jpeg',
  '/images/blood-donation-camp.jpg',
  '/images/BLOOD DONATION 2.jpeg',
  '/images/BLOOD DONATION 3.jpeg',
  '/images/BLOOD DONATION 4.jpeg',
  '/images/BLOOD DONATION 5.jpeg',
  '/images/PHOTO 1.jpeg',
  '/images/PHOTO 2.jpeg',
  '/images/PHOTO 3.jpeg',
  '/images/PHOTO 4.jpeg',
  '/images/469068261_609127548118786_3086100465586628981_n.jpg',
  '/images/469072055_609756388055902_7005467819425736701_n.jpg',
  '/images/469138810_609126958118845_8650880760494388940_n.jpg',
  '/images/469583847_611496104548597_30826172631232671_n.jpg',
  '/images/469620894_611496427881898_1884497419873373850_n.jpg',
  '/images/469639136_611496407881900_8611187158501325730_n.jpg',
  '/images/469864323_611496421215232_6826778829493628708_n.jpg',
  '/images/486973907_693895086354728_5870470351651792592_n.jpg',
  '/images/487367997_693894936354743_2289428756857934428_n.jpg',
  '/images/488504163_696163352794568_2389405504010046181_n.jpg',
  '/images/488505039_693895166354720_8100618291408477348_n.jpg',
  '/images/488601372_693895203021383_4713706625015829855_n.jpg',
  '/images/529710803_18093477652639429_5830789645073796337_n.webp',
  '/images/530618472_18093605002639429_1532166081922685035_n.webp',
  '/images/530830813_18093605047639429_3380500334174600398_n.webp',
  '/images/530843281_18093604984639429_1449346656347248637_n.webp',
  '/images/530863497_18093605029639429_3453030396845106587_n.webp',
  '/images/530985758_18093605020639429_4615635884927217154_n.webp',
  '/images/531187493_18093605011639429_8909573816403726880_n.webp',
  '/images/531286051_18093605038639429_6413714965315958363_n.webp',
  '/images/531978017_18093604990639429_2204854191744847342_n.webp',
  '/images/532121467_18093604996639429_2802365550660209698_n.webp',
  '/images/IMG-20260302-WA0029.jpg',
  '/images/IMG-20260302-WA0030.jpg',
];

const videos = [
  '/videos/VIDEO%201%20.mp4',
  '/videos/VID-20260302-WA0026.mp4',
  '/videos/WhatsApp%20Video%202026-03-07%20at%206.14.38%20PM.mp4',
  '/videos/WhatsApp%20Video%202026-03-07%20at%206.14.39%20PM.mp4',
  '/videos/WhatsApp%20Video%202026-03-07%20at%206.14.59%20PM.mp4',
  '/videos/WhatsApp%20Video%202026-03-07%20at%206.19.02%20PM.mp4',
  '/videos/WhatsApp%20Video%202026-03-07%20at%206.19.03%20PM.mp4',
];

const getMediaTitle = (src: string) => {
  const filename = decodeURIComponent(src.split('/').pop() || '');
  if (filename.toUpperCase().includes('BLOOD')) return 'Blood Donation Camp';
  if (filename.toUpperCase().includes('PHOTO')) return 'Mutt Devotional Event';
  if (filename.toUpperCase().includes('WA0026') || filename.toUpperCase().includes('WA0029') || filename.toUpperCase().includes('WA0030')) return 'Aarti & Daily Puja';
  if (filename.toUpperCase().includes('VIDEO 1')) return 'Panchamruta Abhisheka Recital';
  if (filename.toUpperCase().includes('6.14.59')) return 'Panchamruta Abhisheka';
  return 'Rayara Matta Darshan & Seva';
};

export const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  // Swiping Touch Gestures State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50; // Threshold of 50px
    if (isSwipe) {
      if (distance > 0) {
        onSwipeLeft(); // Swipe Left -> Next Item
      } else {
        onSwipeRight(); // Swipe Right -> Prev Item
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === 'photos' && selectedPhotoIndex !== null) {
        if (e.key === 'ArrowRight') {
          setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
        } else if (e.key === 'ArrowLeft') {
          setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
        } else if (e.key === 'Escape') {
          setSelectedPhotoIndex(null);
        }
      } else if (activeTab === 'videos' && selectedVideoIndex !== null) {
        if (e.key === 'ArrowRight') {
          setSelectedVideoIndex((selectedVideoIndex + 1) % videos.length);
        } else if (e.key === 'ArrowLeft') {
          setSelectedVideoIndex((selectedVideoIndex - 1 + videos.length) % videos.length);
        } else if (e.key === 'Escape') {
          setSelectedVideoIndex(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, selectedPhotoIndex, selectedVideoIndex]);

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleNextVideo = () => {
    if (selectedVideoIndex !== null) {
      setSelectedVideoIndex((selectedVideoIndex + 1) % videos.length);
    }
  };

  const handlePrevVideo = () => {
    if (selectedVideoIndex !== null) {
      setSelectedVideoIndex((selectedVideoIndex - 1 + videos.length) % videos.length);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-[#8B0000] mb-4 tracking-tight">{t('nav.gallery')}</h1>
          <div className="flex justify-center gap-4 mt-8">
            {[
              { id: 'photos', label: t('gallery.photos'), icon: <ImageIcon size={18} /> },
              { id: 'videos', label: t('gallery.videos'), icon: <Video size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedPhotoIndex(null);
                  setSelectedVideoIndex(null);
                }}
                className={`flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-black text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#8B0000] text-white shadow-[0_10px_20px_rgba(139,0,0,0.2)]' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {photos.map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedPhotoIndex(i)}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
                >
                  <img src={src} className="w-full h-full object-cover" alt={getMediaTitle(src)} loading="lazy" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="text-white" size={32} />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-[10px] font-black uppercase tracking-wider drop-shadow">{getMediaTitle(src)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {videos.map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedVideoIndex(i)}
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-gray-900 group shadow-lg"
                >
                  <video className="w-full h-full object-cover pointer-events-none" preload="metadata">
                    <source src={src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 bg-yellow-500 text-[#8B0000] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play fill="currentColor" size={24} className="ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-black drop-shadow-md truncate">{getMediaTitle(src)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unified Media Lightbox Modals */}
      <AnimatePresence>
        {/* Photo Lightbox */}
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(handleNextPhoto, handlePrevPhoto)}
            onClick={() => setSelectedPhotoIndex(null)}
          >
            {/* Close */}
            <button 
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-6 right-6 text-white hover:text-yellow-500 transition-colors z-[110]"
            >
              <X size={36} />
            </button>

            {/* Left Control */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-4 sm:left-8 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-[110]"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Lightbox Center Content */}
            <div 
              className="relative max-w-5xl max-h-[80vh] px-4 flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedPhotoIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                src={photos[selectedPhotoIndex]}
                className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl object-contain border border-white/10"
              />
              <div className="text-center mt-6 text-white max-w-xl">
                <h4 className="text-base sm:text-lg font-black tracking-tight">{getMediaTitle(photos[selectedPhotoIndex])}</h4>
                <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-widest">
                  Photo {selectedPhotoIndex + 1} of {photos.length}
                </p>
              </div>
            </div>

            {/* Right Control */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-4 sm:right-8 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-[110]"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}

        {/* Video Lightbox */}
        {selectedVideoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(handleNextVideo, handlePrevVideo)}
            onClick={() => setSelectedVideoIndex(null)}
          >
            {/* Close */}
            <button 
              onClick={() => setSelectedVideoIndex(null)}
              className="absolute top-6 right-6 text-white hover:text-yellow-500 transition-colors z-[110]"
            >
              <X size={36} />
            </button>

            {/* Left Control */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevVideo();
              }}
              className="absolute left-4 sm:left-8 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-[110]"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Video Lightbox Center Content */}
            <div 
              className="relative max-w-5xl max-h-[80vh] px-4 flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={selectedVideoIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="aspect-video max-w-full max-h-[70vh] rounded-3xl overflow-hidden bg-gray-900 shadow-2xl border border-white/10"
              >
                <video
                  key={selectedVideoIndex}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                >
                  <source src={videos[selectedVideoIndex]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
              <div className="text-center mt-6 text-white max-w-xl">
                <h4 className="text-base sm:text-lg font-black tracking-tight">{getMediaTitle(videos[selectedVideoIndex])}</h4>
                <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-widest">
                  Video {selectedVideoIndex + 1} of {videos.length}
                </p>
              </div>
            </div>

            {/* Right Control */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextVideo();
              }}
              className="absolute right-4 sm:right-8 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-[110]"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
