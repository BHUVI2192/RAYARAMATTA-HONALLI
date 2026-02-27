import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Info, BookOpen, Globe } from 'lucide-react';

const goshalaImages = [
  'https://picsum.photos/seed/cow1/800/600',
  'https://picsum.photos/seed/cow2/800/600',
  'https://picsum.photos/seed/cow3/800/600',
];

export const Activities: React.FC = () => {
  const [currentImg, setCurrentImg] = useState(0);

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
          <h1 className="text-4xl font-bold text-[#8B0000] mb-4">Our Activities</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Beyond spiritual rituals, we are committed to social welfare and preservation of our cultural values.
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
              <span>Goshala Seva</span>
            </div>
            <h2 className="text-3xl font-bold text-[#8B0000] mb-6">Preserving the Sacred Cow</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our Goshala is home to over 50 indigenous cows. We provide them with nutritious fodder, clean water, and medical care. Godhana Seva is considered one of the most meritorious acts in our tradition.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-700 mb-1">50+</p>
                <p className="text-xs text-emerald-600 font-bold uppercase">Cows Protected</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-2xl font-bold text-orange-700 mb-1">Daily</p>
                <p className="text-xs text-orange-600 font-bold uppercase">Fresh Fodder</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Globe className="text-blue-600" size={32} />,
              title: "Virtual Seva",
              desc: "Participate in poojas and rituals from anywhere in the world through our live streaming services."
            },
            {
              icon: <BookOpen className="text-purple-600" size={32} />,
              title: "Veda Patashala",
              desc: "Traditional education for young students to preserve and propagate our ancient Vedic knowledge."
            },
            {
              icon: <Info className="text-yellow-600" size={32} />,
              title: "Social Welfare",
              desc: "Free medical camps, educational support for the needy, and community feeding programs."
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
