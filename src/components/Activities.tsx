import React from 'react';
import { motion } from 'motion/react';
import { Heart, Info, BookOpen, Globe, Droplets } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const bloodDonationImage = '/images/blood-donation-camp.jpg';

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

        <div className="grid md:grid-cols-3 gap-8 mb-16">
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

        {/* Blood Donation Camp Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-20 bg-red-50 rounded-3xl p-8 md:p-12 border border-red-100"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video lg:aspect-auto lg:h-80">
            <img
              src={bloodDonationImage}
              alt="Blood Donation Camp at Rayara Matta Honalli"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-red-700/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
              <Droplets size={14} />
              Blood Donation Camp
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-xs mb-4 bg-red-100 px-3 py-1.5 rounded-full">
              <Heart size={14} fill="currentColor" />
              <span>Community Service</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#8B0000] mb-4">
              Blood Donation Camp
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-sm sm:text-base">
              Rayara Matta Honalli regularly organises blood donation camps as a noble act of community service. 
              Devotees and volunteers come together to donate blood, saving countless lives and embodying the 
              Mutt's commitment to humanitarian values and social welfare rooted in the teachings of 
              Sri Raghavendra Swamiji.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm text-center">
                <p className="text-2xl font-black text-red-700 mb-1">100+</p>
                <p className="text-xs text-red-500 font-bold uppercase tracking-wide">Units Donated</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm text-center">
                <p className="text-2xl font-black text-red-700 mb-1">Annual</p>
                <p className="text-xs text-red-500 font-bold uppercase tracking-wide">Camps Organised</p>
              </div>
            </div>
          </div>
        </motion.div>

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

