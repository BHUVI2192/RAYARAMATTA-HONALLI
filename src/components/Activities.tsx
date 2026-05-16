import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Info, BookOpen, Globe, CreditCard, User, Phone, Mail, IndianRupee, CheckCircle, Loader2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const goshalaImage = '/images/469864323_611496421215232_6826778829493628708_n.jpg';

export const Activities: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-black text-[#8B0000] mb-4 leading-tight">{t('act.title')}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base font-medium px-4">
            {t('act.desc')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
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

        {/* Festivals Section */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-stone-50 p-8 md:p-12 rounded-3xl border border-stone-200"
        >
          <h2 className="text-3xl font-bold text-[#8B0000] mb-8 text-center">{t('act.festivals.title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#8B0000] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {num}
                </div>
                <p className="text-gray-700 font-medium">{t(`act.festivals.${num}`)}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};
