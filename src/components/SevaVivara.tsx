import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Seva } from '../types';
import { useLanguage } from '../context/LanguageContext';

const dailyPoojas = [
  { time: "07:30 AM", name: "Nirmalya Visarjana" },
  { time: "09:00 AM", name: "Panchamruta Abhisheka" },
  { time: "12:00 PM", name: "Mahamangalarathi" },
  { time: "12:30 PM", name: "Hasthodaka" },
  { time: "06:30 PM", name: "Evening Mangalarathi" },
  { time: "06:30 PM", name: "Pallakki Utsava (Thursday's only)" },
];

const sevas: { id: string; key: string; price: number }[] = [
  { id: '1', key: 'seva.sarva_samarpana', price: 5000 },
  { id: '2', key: 'seva.kanaka_mahapooja', price: 3000 },
  { id: '3', key: 'seva.rajatha_rathotsava', price: 2500 },
  { id: '4', key: 'seva.suvarna_paduka', price: 2000 },
  { id: '5', key: 'seva.mahapooja', price: 1500 },
  { id: '6', key: 'seva.suvarna_kavacha', price: 1000 },
  { id: '7', key: 'seva.kanakabhisheka', price: 1000 },
  { id: '8', key: 'seva.sarva_seva', price: 750 },
  { id: '9', key: 'seva.rajatha_kavacha', price: 500 },
  { id: '10', key: 'seva.ghee_nandadeepa', price: 500 },
  { id: '11', key: 'seva.oil_nandadeepa', price: 350 },
  { id: '12', key: 'seva.brindavana_alankara', price: 300 },
  { id: '13', key: 'seva.tulabhara', price: 250 },
  { id: '14', key: 'seva.panchamruta', price: 200 },
  { id: '15', key: 'seva.hasthodaka', price: 100 },
  { id: '16', key: 'seva.padapooja', price: 100 },
  { id: '17', key: 'seva.pallakki_utsava', price: 100 },
  { id: '18', key: 'seva.ksheerabhisheka', price: 100 },
  { id: '19', key: 'seva.archane', price: 100 },
];

interface SevaVivaraProps {
  onSelectSeva?: (seva: Seva) => void;
}

export const SevaVivara: React.FC<SevaVivaraProps> = ({ onSelectSeva }) => {
  const { t } = useLanguage();
  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="bg-[#8B0000] text-white p-6 sm:p-10 rounded-3xl shadow-xl sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <Clock size={24} className="text-yellow-500" />
                <h2 className="text-2xl font-black">{t('pooja.schedule')}</h2>
              </div>
              <div className="space-y-6">
                {dailyPoojas.map((pooja, i) => (
                  <div key={i} className="flex gap-4 items-start border-l-2 border-yellow-500/30 pl-4 relative">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-yellow-500" />
                    <div>
                      <p className="text-yellow-500 font-mono text-sm font-bold">{pooja.time}</p>
                      <p className="font-medium">{pooja.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 p-4 bg-white/10 rounded-xl text-xs leading-relaxed italic opacity-80">
                * Timings are subject to change during festivals and special occasions.
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100">
              <div className="flex items-center justify-between mb-8 sm:mb-12">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#8B0000] mb-2 tracking-tight">{t('pooja.book.title')}</h1>
                  <p className="text-sm sm:text-base text-gray-500 font-medium">{t('pooja.book.subtitle')}</p>
                </div>
                <Calendar size={48} className="text-gray-100 hidden md:block" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {sevas.map((seva, i) => {
                  const translatedSeva: Seva = {
                    id: seva.id,
                    name: t(seva.key),
                    price: seva.price
                  };
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectSeva?.(translatedSeva)}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-yellow-500 hover:bg-yellow-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#8B0000] group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="font-black text-gray-800 text-sm sm:text-base">{translatedSeva.name}</p>
                          <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">Sacred Offering</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#8B0000]">₹{seva.price}</p>
                        <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-yellow-600" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-12 p-8 bg-yellow-50 rounded-2xl border border-yellow-100 text-center">
                <h3 className="text-xl font-bold text-[#8B0000] mb-4">{t('pooja.assistance.title')}</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {t('pooja.assistance.desc')}
                </p>
                <button className="bg-[#8B0000] text-white px-8 py-3.5 rounded-full font-black hover:bg-[#6B0000] transition-all shadow-[0_10px_20px_rgba(139,0,0,0.2)] active:scale-95">
                  {t('pooja.contact')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
