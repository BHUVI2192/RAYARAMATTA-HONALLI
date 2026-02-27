import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Bell, ArrowRight, Newspaper } from 'lucide-react';

const events = [
  {
    title: "Sri Raghavendra Swamy Aradhana Mahotsava",
    date: "August 23-25, 2024",
    desc: "The grand annual celebration of our Guru's Aradhana with special poojas and cultural programs.",
    type: "Major Event"
  },
  {
    title: "Mahalaya Paksha",
    date: "September 18 - October 2, 2024",
    desc: "A sacred period for offering prayers to ancestors with special rituals at the Mutt.",
    type: "Ritual"
  },
  {
    title: "Navaratri Celebrations",
    date: "October 3-12, 2024",
    desc: "Ten days of divine celebrations with special alankaras and evening bhajans.",
    type: "Festival"
  }
];

const news = [
  {
    title: "New Goshala Wing Inaugurated",
    date: "Feb 15, 2024",
    excerpt: "The trust has successfully completed the construction of the new wing for our Goshala..."
  },
  {
    title: "Free Eye Camp Success",
    date: "Jan 20, 2024",
    excerpt: "Over 200 people benefited from the free eye checkup and surgery camp conducted by..."
  },
  {
    title: "Veda Patashala Admissions Open",
    date: "Jan 05, 2024",
    excerpt: "Applications are invited for the new batch of students for our traditional Veda Patashala..."
  }
];

export const Events: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-12">
              <Calendar className="text-[#8B0000]" size={32} />
              <h1 className="text-3xl font-bold text-[#8B0000]">Upcoming Events</h1>
            </div>

            <div className="space-y-8">
              {events.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative pl-8 border-l-2 border-gray-100 hover:border-[#8B0000] transition-colors pb-8"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-gray-200 group-hover:border-[#8B0000] transition-colors" />
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                    {event.type}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#8B0000] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#8B0000] font-bold mb-3 flex items-center gap-2">
                    <Calendar size={14} /> {event.date}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                    {event.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-80 lg:w-96">
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <Newspaper className="text-[#8B0000]" size={24} />
                <h2 className="text-xl font-bold text-[#8B0000]">Latest News</h2>
              </div>

              <div className="space-y-6">
                {news.map((item, i) => (
                  <div key={i} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{item.date}</p>
                    <h4 className="font-bold text-gray-800 mb-2 hover:text-[#8B0000] cursor-pointer transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item.excerpt}
                    </p>
                    <button className="mt-3 text-[#8B0000] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                      Read More <ArrowRight size={10} />
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <Bell size={16} /> View All News
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
