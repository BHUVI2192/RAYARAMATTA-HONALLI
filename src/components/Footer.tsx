import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Youtube, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2D0000] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-500">About the Trust</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Shri Raghavendra Swamy Seva Trust, Honali is dedicated to the service of Guru Raghavendra and the welfare of the community through spiritual and social activities.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-[#2D0000] rounded-full transition-all"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-[#2D0000] rounded-full transition-all"><Youtube size={18} /></a>
              <a href="#" className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-[#2D0000] rounded-full transition-all"><Twitter size={18} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-500">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <MapPin size={18} className="text-yellow-500 shrink-0" />
                <span>Venkateswara Nagar (West), Honali, Karnataka - 577217</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-yellow-500 shrink-0" />
                <span>+91 99403 83604 / 72993 17877</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-yellow-500 shrink-0" />
                <span>honali.mutt@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-500">Darsana Timings</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <Clock size={18} className="text-yellow-500 shrink-0" />
                <div>
                  <p className="font-bold text-gray-200">Morning</p>
                  <p>06:30 AM to 11:00 AM</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock size={18} className="text-yellow-500 shrink-0" />
                <div>
                  <p className="font-bold text-gray-200">Evening</p>
                  <p>04:30 PM to 07:00 PM</p>
                  <p className="text-xs italic">(Open till 08:00 PM on Thursdays)</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-500">Location</h3>
            <div className="rounded-xl overflow-hidden h-48 bg-gray-800">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.603417724121!2d75.6421!3d14.2415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDE0JzI5LjQiTiA3NcKwMzgnMzEuNiJF!5e0!3m2!1sen!2sin!4v1630000000000!5m2!1sen!2sin" 
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
          <p>© 2024 Shri Raghavendra Swamy Seva Trust, Honali. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
