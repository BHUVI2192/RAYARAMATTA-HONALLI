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
      image: 'https://picsum.photos/seed/goshala/800/600'
    },
    {
      id: 2,
      icon: <Droplets className="text-red-600" size={32} />,
      title: t('seva.2.title'),
      desc: t('seva.2.desc'),
      image: 'https://picsum.photos/seed/blood/800/600'
    },
    {
      id: 3,
      icon: <GraduationCap className="text-blue-600" size={32} />,
      title: t('seva.3.title'),
      desc: t('seva.3.desc'),
      image: 'https://picsum.photos/seed/scholars/800/600'
    }
  ];

  const godanaSevas: Seva[] = [
    { id: 'godana-madhyama', name: t('seva.godana.madhyama'), price: 5000 },
    { id: 'godana-uttama', name: t('seva.godana.uttama'), price: 10000 },
    { id: 'godana-salankruta', name: t('seva.godana.salankruta'), price: 20000 },
  ];

  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#8B0000] mb-4">{t('seva.title')}</h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
        </div>

        <div className="space-y-16 mb-24">
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

        {/* Godana Sevas Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-orange-50 rounded-3xl p-8 md:p-12 border border-orange-100"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#8B0000] mb-4">{t('seva.godana.title')}</h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">{t('seva.godana.desc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {godanaSevas.map((seva) => (
              <div key={seva.id} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 mb-4 flex-1">{seva.name}</h3>
                <div className="text-2xl font-bold text-[#8B0000] mb-6 flex items-center">
                  <IndianRupee size={24} className="mr-1" />
                  {seva.price}
                </div>
                <button
                  onClick={() => onSelectSeva(seva)}
                  className="w-full bg-yellow-500 text-[#8B0000] py-2 rounded-full font-bold hover:bg-yellow-600 transition-colors"
                >
                  {t('seva.book')}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
