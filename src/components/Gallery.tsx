import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Video, FileText, X, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const photos = [
  'https://picsum.photos/seed/gall1/800/600',
  'https://picsum.photos/seed/gall2/800/600',
  'https://picsum.photos/seed/gall3/800/600',
  'https://picsum.photos/seed/gall4/800/600',
  'https://picsum.photos/seed/gall5/800/600',
  'https://picsum.photos/seed/gall6/800/600',
];

export const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'souvenirs'>('photos');
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
              { id: 'souvenirs', label: t('gallery.souvenirs'), icon: <FileText size={18} /> },
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

          {activeTab === 'souvenirs' && (
            <motion.div
              key="souvenirs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Annual Souvenir 202{i}</h4>
                    <p className="text-xs text-gray-400">PDF Document • 12MB</p>
                  </div>
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
