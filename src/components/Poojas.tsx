import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Seva } from '../types';
import { useLanguage } from '../context/LanguageContext';

const dailyPoojas = [
  { time: "06:30 AM", name: "Nirmalya Visarjana" },
  { time: "07:30 AM", name: "Panchamruta Abhisheka" },
  { time: "09:30 AM", name: "Mahamangalarathi" },
  { time: "12:30 PM", name: "Hasthodaka" },
  { time: "06:30 PM", name: "Evening Mangalarathi" },
  { time: "07:30 PM", name: "Rathothsava (Thursdays)" },
];

const sevas: Seva[] = [
  { id: '1', name: "Panchamruta Abhisheka", price: 501 },
  { id: '2', name: "Kanakabhisheka", price: 1001 },
  { id: '3', name: "Phala Panchamruta", price: 251 },
  { id: '4', name: "Hasthodaka", price: 101 },
  { id: '5', name: "Sankalpa Seva", price: 51 },
  { id: '6', name: "Akshata Seva", price: 21 },
  { id: '7', name: "Godhana Seva (Daily)", price: 201 },
  { id: '8', name: "Annadana Seva", price: 1001 },
];

interface PoojasProps {
  onSelectSeva?: (seva: Seva) => void;
}

export const Poojas: React.FC<PoojasProps> = ({ onSelectSeva }) => {
  const { t } = useLanguage();
  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="bg-[#8B0000] text-white p-8 rounded-3xl shadow-xl sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <Clock size={24} className="text-yellow-500" />
                <h2 className="text-2xl font-bold">{t('pooja.schedule')}</h2>
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
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-3xl font-bold text-[#8B0000] mb-2">{t('pooja.book.title')}</h1>
                  <p className="text-gray-500">{t('pooja.book.subtitle')}</p>
                </div>
                <Calendar size={48} className="text-gray-100 hidden md:block" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {sevas.map((seva, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectSeva?.(seva)}
                    className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-yellow-500 hover:bg-yellow-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#8B0000] group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{seva.name}</p>
                        <p className="text-xs text-gray-400">Sacred Offering</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#8B0000]">₹{seva.price}</p>
                      <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-yellow-600" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-12 p-8 bg-yellow-50 rounded-2xl border border-yellow-100 text-center">
                <h3 className="text-xl font-bold text-[#8B0000] mb-4">{t('pooja.assistance.title')}</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {t('pooja.assistance.desc')}
                </p>
                <button className="bg-[#8B0000] text-white px-8 py-3 rounded-full font-bold hover:bg-[#6B0000] transition-colors shadow-lg">
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
