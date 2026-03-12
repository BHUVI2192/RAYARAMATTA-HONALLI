import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Video, FileText, X, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const photos = [
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1600080972464-8e5fce84662f?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1560179406-1c6c60e0dc26?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1580227146864-1c2f60625ea1?auto=format&fit=crop&q=80&w=800&h=600',
];

export const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#8B0000] mb-4">{t('nav.gallery')}</h1>
          <div className="flex justify-center gap-4 mt-8">
            {[
              { id: 'photos', label: t('gallery.photos'), icon: <ImageIcon size={18} /> },
              { id: 'videos', label: t('gallery.videos'), icon: <Video size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#8B0000] text-white shadow-lg' 
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
                  onClick={() => setSelectedImg(src)}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <img src={src} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="text-white" size={32} />
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
              className="grid md:grid-cols-2 gap-8"
            >
              {[1, 2].map((i) => (
                <div key={i} className="aspect-video rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-8 right-8 text-white hover:text-yellow-500 transition-colors">
              <X size={48} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImg}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
