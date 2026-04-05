import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Youtube, Twitter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#2D0000] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-500">{t('footer.about.title')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('footer.about.desc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-[#2D0000] rounded-full transition-all"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-[#2D0000] rounded-full transition-all"><Youtube size={18} /></a>
              <a href="#" className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-[#2D0000] rounded-full transition-all"><Twitter size={18} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-500">{t('footer.contact.title')}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <MapPin size={18} className="text-yellow-500 shrink-0" />
                <span>{t('footer.contact.address')}</span>
              </li>
              <li className="flex gap-3 items-start">
                <Phone size={18} className="text-yellow-500 shrink-0 mt-1" />
                <div className="flex flex-col">
                  <span>Sri Mutt: 9035861049</span>
                  <span>G Vadiraj Kamarur: 9986511855</span>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-yellow-500 shrink-0" />
                <span>honali.mutt@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-500">{t('footer.timings.title')}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <Clock size={18} className="text-yellow-500 shrink-0" />
                <div>
                  <p className="font-bold text-gray-200">{t('footer.timings.morning')}</p>
                  <p>06:30 AM to 11:00 AM</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock size={18} className="text-yellow-500 shrink-0" />
                <div>
                  <p className="font-bold text-gray-200">{t('footer.timings.evening')}</p>
                  <p>04:30 PM to 07:00 PM</p>
                  <p className="text-xs italic">{t('footer.timings.thursday')}</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-500">{t('footer.location.title')}</h3>
            <div className="rounded-xl overflow-hidden h-48 bg-gray-800">
              <iframe 
                src="https://maps.google.com/maps?q=14.245028,75.648806&hl=en&z=15&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-xs text-gray-500">
          <p>© 2024 Shri Raghavendra Swamy Seva Trust, Honnali. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
