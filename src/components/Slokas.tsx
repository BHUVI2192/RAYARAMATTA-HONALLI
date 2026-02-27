import React from 'react';
import { motion } from 'motion/react';
import { Book, Music, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const slokas = [
  {
    title: "Sri Raghavendra Stotra",
    sanskrit: "श्री राघवेन्द्र स्तोत्रम्",
    meaning: "The sacred hymn praising Guru Raghavendra, written by Sri Appannacharya.",
    content: "Pujyaya Raghavendraya Satya Dharma Ratayacha | Bhajatam Kalpavrikshaya Namatam Kamadhenave ||"
  },
  {
    title: "Guru Stotram",
    sanskrit: "गुरु स्तोत्रम्",
    meaning: "Salutations to the Guru who is the embodiment of the Trinity.",
    content: "Gurur Brahma Gurur Vishnu Gurur Devo Maheshwarah | Gurur Sakshat Parabrahma Tasmai Shri Gurave Namah ||"
  }
];

export const Slokas: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="pt-24 pb-16 bg-orange-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            className="inline-block p-4 bg-orange-100 text-orange-600 rounded-2xl mb-4"
          >
            <Book size={48} />
          </motion.div>
          <h1 className="text-4xl font-bold text-[#8B0000] mb-4">{t('sloka.title')}</h1>
          <p className="text-gray-600">{t('sloka.desc')}</p>
        </div>

        <div className="space-y-8">
          {slokas.map((sloka, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-orange-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Music size={120} />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#8B0000] mb-1">{sloka.title}</h2>
                    <p className="text-orange-600 font-bold text-lg">{sloka.sanskrit}</p>
                  </div>
                  <button className="p-3 bg-orange-50 text-orange-600 rounded-full hover:bg-[#8B0000] hover:text-white transition-all shadow-sm">
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>

                <div className="bg-orange-50/50 p-8 rounded-2xl mb-8 text-center italic text-xl text-gray-800 leading-relaxed font-serif">
                  "{sloka.content}"
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('sloka.meaning')}</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {sloka.meaning}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-[#8B0000] text-white rounded-3xl text-center shadow-2xl">
          <h3 className="text-xl font-bold mb-4">{t('sloka.download.title')}</h3>
          <p className="text-sm opacity-80 mb-8 max-w-md mx-auto">
            {t('sloka.download.desc')}
          </p>
          <button className="bg-yellow-500 text-[#8B0000] px-8 py-3 rounded-full font-bold hover:bg-yellow-600 transition-all shadow-lg">
            {t('sloka.download.btn')}
          </button>
        </div>
      </div>
    </div>
  );
};
