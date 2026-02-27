import React from 'react';
import { motion } from 'motion/react';
import { History, Award, Users } from 'lucide-react';

export const About: React.FC = () => {
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
              <span>Our Legacy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#8B0000] mb-8 leading-tight">
              The History of Honali Rayara Mutt
            </h1>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                In the early 1980s, two philanthropic devotees of Sri Raghavendra Swamy offered more than two grounds of land at Honali free of cost with a specific request to construct a temple for Sri Raghavendra Swamy to benefit a large number of public living in and around the area.
              </p>
              <p>
                A committee of like-minded persons was formed and the site donated was taken over by the entity in the name and style of "Shri Raghavendra Swamy Seva Trust, Honali" and got the organization registered in December 1983.
              </p>
              <p>
                Appeals were made soliciting donations for taking up the construction of the Brindavana by various means including conducting of Bhajans, Unchivathis at various parts of the city, newspaper advertisements, door to door collection from devotees, celebration of Sri Raghavendra Swamy Aradhana, conduct of fund raising cultural programmes, etc.
              </p>
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
              <p className="text-sm font-bold uppercase tracking-wider">Years of Devotion</p>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Award className="text-yellow-600" size={32} />,
              title: "Spiritual Excellence",
              desc: "Maintaining the highest standards of Vedic rituals and traditions."
            },
            {
              icon: <Users className="text-yellow-600" size={32} />,
              title: "Community Service",
              desc: "Supporting the local community through various social initiatives."
            },
            {
              icon: <History className="text-yellow-600" size={32} />,
              title: "Rich Heritage",
              desc: "Preserving the legacy of Guru Raghavendra for future generations."
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
