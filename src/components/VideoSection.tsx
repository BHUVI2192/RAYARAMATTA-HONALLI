import React, { useRef, useState, useEffect } from 'react';
import { Play, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const VIDEO_SRC = '/videos/WhatsApp%20Video%202026-03-07%20at%206.19.02%20PM.mp4';

export const VideoSection: React.FC = () => {
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const openModal = () => setModalOpen(true);

  const closeModal = () => {
    setModalOpen(false);
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
    }
  };

  // Auto-play when modal opens
  useEffect(() => {
    if (modalOpen && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {});
    }
  }, [modalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const toggleMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-16 bg-amber-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <p className="text-yellow-600 font-semibold uppercase tracking-widest text-sm mb-3">Sacred Ritual</p>
            <h2 className="text-4xl font-bold text-[#8B0000] mb-6 leading-tight">
              Panchamruta<br />Abhisheka
            </h2>
            <div className="w-16 h-1 bg-yellow-500 rounded-full mb-6 mx-auto lg:mx-0" />
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Witness the divine Panchamruta Abhisheka of Sri Raghavendra Swamy at Rayara Matta, Honalli.
              This sacred ritual is performed with five holy substances —
              milk, curd, ghee, honey, and sugar.
            </p>
            <p className="text-gray-500 italic text-sm">
              "Gurubhyo Namaha" — May the blessings of Sri Guru flow eternally.
            </p>
          </motion.div>

          {/* Right: Thumbnail with play button */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2 w-full flex justify-center"
          >
            {/* Portrait thumbnail */}
            <div
              className="relative w-64 md:w-72 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group bg-gray-900"
              style={{ aspectRatio: '9/16' }}
              onClick={openModal}
            >
              <video
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              >
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>
              {/* Dark overlay + play button */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-all flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-20 h-20 bg-yellow-500 text-[#8B0000] rounded-full flex items-center justify-center shadow-xl"
                >
                  <Play size={34} className="ml-1" />
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Full-screen modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Stop click propagation on the video wrapper so clicking video doesn't close */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative flex items-center justify-center"
              style={{ maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={modalVideoRef}
                controls={false}
                muted={isMuted}
                playsInline
                loop
                className="rounded-2xl shadow-2xl"
                style={{ maxHeight: '88vh', maxWidth: '95vw', objectFit: 'contain' }}
              >
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>

              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>

              {/* Mute toggle */}
              <button
                onClick={toggleMute}
                className="absolute bottom-3 right-3 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
