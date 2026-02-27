import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Info, BookOpen, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const goshalaImages = [
  'https://picsum.photos/seed/cow1/800/600',
  'https://picsum.photos/seed/cow2/800/600',
  'https://picsum.photos/seed/cow3/800/600',
];

export const Activities: React.FC = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % goshalaImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#8B0000] mb-4">{t('act.title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('act.desc')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImg}
                src={goshalaImages[currentImg]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[#8B0000] font-bold text-sm shadow-lg">
              Honali Goshala
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">
              <Heart size={16} />
              <span>{t('act.goshala.label')}</span>
            </div>
            <h2 className="text-3xl font-bold text-[#8B0000] mb-6">{t('act.goshala.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {t('act.goshala.desc')}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-700 mb-1">50+</p>
                <p className="text-xs text-emerald-600 font-bold uppercase">{t('act.goshala.cows')}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-2xl font-bold text-orange-700 mb-1">Daily</p>
                <p className="text-xs text-orange-600 font-bold uppercase">{t('act.goshala.fodder')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Globe className="text-blue-600" size={32} />,
              title: t('act.virtual.title'),
              desc: t('act.virtual.desc')
            },
            {
              icon: <BookOpen className="text-purple-600" size={32} />,
              title: t('act.veda.title'),
              desc: t('act.veda.desc')
            },
            {
              icon: <Info className="text-yellow-600" size={32} />,
              title: t('act.social.title'),
              desc: t('act.social.desc')
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold text-[#8B0000] mb-4">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
