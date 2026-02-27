import React from 'react';
import { motion } from 'motion/react';
import { History, Award, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
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
            <h1 className="text-4xl md:text-5xl font-bold text-[#8B0000] mb-8 leading-tight">
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
                src="https://picsum.photos/seed/history/800/1000" 
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
