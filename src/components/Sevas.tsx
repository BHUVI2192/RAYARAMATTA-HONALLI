import React from 'react';
import { motion } from 'motion/react';
import { Heart, Droplets, GraduationCap, IndianRupee } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Seva } from '../types';

interface SevasProps {
  onSelectSeva: (seva: Seva) => void;
}

export const Sevas: React.FC<SevasProps> = ({ onSelectSeva }) => {
  const { t } = useLanguage();
  
  const sevaActivities = [
    {
      id: 1,
      icon: <Heart className="text-emerald-600" size={32} />,
      title: t('seva.1.title'),
      desc: t('seva.1.desc'),
      image: '/images/469465619_611496361215238_5830762216394880863_n.jpg'
    },
    {
      id: 2,
      icon: <Droplets className="text-red-600" size={32} />,
      title: t('seva.2.title'),
      desc: t('seva.2.desc'),
      image: '/images/469528604_611496204548587_255201209616566963_n.jpg'
    },
    {
      id: 3,
      icon: <GraduationCap className="text-blue-600" size={32} />,
      title: t('seva.3.title'),
      desc: t('seva.3.desc'),
      image: '/images/469620894_611496427881898_1884497419873373850_n.jpg'
    }
  ];


  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#8B0000] mb-4">{t('seva.title')}</h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
        </div>

        <div className="space-y-16">
          {sevaActivities.map((seva, i) => (
            <motion.div
              key={seva.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}
            >
              <div className="flex-1">
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl inline-block">
                  {seva.icon}
                </div>
                <h2 className="text-3xl font-bold text-[#8B0000] mb-6">{seva.title}</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {seva.desc}
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video rounded-3xl overflow-hidden shadow-xl border-8 border-gray-50">
                  <img 
                    src={seva.image} 
                    alt={seva.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
