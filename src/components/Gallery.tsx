import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Video, FileText, X, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const photos = [
  '/images/469068261_609127548118786_3086100465586628981_n.jpg',
  '/images/469072055_609756388055902_7005467819425736701_n.jpg',
  '/images/469138810_609126958118845_8650880760494388940_n.jpg',
  '/images/469260819_609774168054124_3699722170139197903_n.jpg',
  '/images/469465619_611496361215238_5830762216394880863_n.jpg',
  '/images/469528604_611496204548587_255201209616566963_n.jpg',
  '/images/469565261_611496367881904_8215471119611863969_n.jpg',
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
                  <img src={src} className="w-full h-full object-cover" />
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
              {[
                '/videos/VID-20260302-WA0026.mp4',
                '/videos/WhatsApp%20Video%202026-03-07%20at%206.14.38%20PM.mp4',
                '/videos/WhatsApp%20Video%202026-03-07%20at%206.14.39%20PM.mp4',
                '/videos/WhatsApp%20Video%202026-03-07%20at%206.14.59%20PM.mp4',
                '/videos/WhatsApp%20Video%202026-03-07%20at%206.19.02%20PM.mp4',
                '/videos/WhatsApp%20Video%202026-03-07%20at%206.19.03%20PM.mp4',
              ].map((src, i) => (
                <div key={i} className="aspect-video rounded-3xl overflow-hidden bg-gray-900 shadow-xl">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    <source src={src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
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
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
