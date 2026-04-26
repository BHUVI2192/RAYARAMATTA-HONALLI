import React from 'react';
import { motion } from 'motion/react';
import { History, Award, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main About Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 text-yellow-600 font-bold uppercase tracking-widest text-sm mb-4">
              <History size={16} />
              <span>{t('about.legacy')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#8B0000] mb-6 sm:mb-8 leading-tight tracking-tight">
              {t('about.title')}
            </h1>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/images/530863497_18093605029639429_3453030396845106587_n.webp" 
                alt="Temple History" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-yellow-500 text-[#8B0000] p-8 rounded-2xl shadow-xl hidden md:block">
              <p className="text-4xl font-bold mb-1">40+</p>
              <p className="text-sm font-bold uppercase tracking-wider">{t('about.years')}</p>
            </div>
          </motion.div>
        </div>

        {/* History Section */}
        <motion.section 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-24 bg-stone-50 p-6 sm:p-10 md:p-12 rounded-3xl border border-stone-200"
        >
          <h2 className="text-3xl font-bold text-[#8B0000] mb-6 flex items-center gap-3">
            <History className="text-yellow-600" /> {t('about.history.title')}
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="font-medium text-lg text-gray-800">{t('about.history.desc1')}</p>
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-xl font-bold text-[#8B0000] mb-4 italic underline decoration-yellow-500 underline-offset-4">
                {t('about.history.q')}
              </h3>
              <p>{t('about.history.desc2')}</p>
            </div>
          </div>
        </motion.section>

        {/* Miracles Section */}
        <motion.section 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#8B0000] mb-4">{t('about.miracle.title')}</h2>
            <p className="text-yellow-700 font-bold italic">{t('about.miracle.q')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <motion.div 
                key={num}
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm">
                  {num}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">{t(`about.miracle.${num}`)}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trustees Section */}
        <motion.section 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-24 bg-[#8B0000] text-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Users className="text-yellow-400" /> {t('about.trustees.title')}
            </h2>
            <p className="text-white/80 mb-12 max-w-3xl leading-relaxed">
              {t('about.trustees.desc')}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <div key={num} className="flex items-center gap-3 py-2 border-b border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="text-sm font-medium">{t(`about.trustee.${num}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Award className="text-yellow-600" size={32} />,
              title: t('about.excellence'),
              desc: t('about.excellence.desc')
            },
            {
              icon: <Users className="text-yellow-600" size={32} />,
              title: t('about.community'),
              desc: t('about.community.desc')
            },
            {
              icon: <History className="text-yellow-600" size={32} />,
              title: t('about.heritage'),
              desc: t('about.heritage.desc')
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
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
