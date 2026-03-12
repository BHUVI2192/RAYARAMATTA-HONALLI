import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ContactFeedback: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'message' | 'feedback'>('message');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { t } = useLanguage();

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#8B0000] mb-4">{t('contact.title')}</h1>
          <p className="text-gray-600">{t('contact.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-[#8B0000] mb-8">{t('contact.getInTouch')}</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#8B0000] shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t('contact.address')}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Venkateswara Nagar (West), Honali, Karnataka - 577217
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#8B0000] shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t('contact.phone')}</p>
                    <p className="text-sm text-gray-700">+91 99403 83604</p>
                    <p className="text-sm text-gray-700">+91 72993 17877</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#8B0000] shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t('contact.email')}</p>
                    <p className="text-sm text-gray-700">honali.mutt@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#8B0000] text-white p-8 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={24} className="text-yellow-500" />
                <h3 className="text-xl font-bold">{t('contact.officeHours')}</h3>
              </div>
              <div className="space-y-3 text-sm opacity-80">
                <div className="flex justify-between">
                  <span>Monday - Sunday</span>
                  <span>06:30 AM - 08:00 PM</span>
                </div>
                <p className="text-xs italic mt-4 border-t border-white/10 pt-4">
                  * Office remains closed during afternoon break (01:00 PM - 04:00 PM)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Merged Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 mb-10 border-b border-gray-100 pb-6">
                <button
                  onClick={() => setActiveForm('message')}
                  className={`flex items-center justify-center gap-2 px-6 py-3 sm:py-2 rounded-full font-bold transition-all ${
                    activeForm === 'message' 
                      ? 'bg-[#8B0000] text-white shadow-lg' 
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Send size={18} />
                  {t('contact.tabs.message')}
                </button>
                <button
                  onClick={() => setActiveForm('feedback')}
                  className={`flex items-center justify-center gap-2 px-6 py-3 sm:py-2 rounded-full font-bold transition-all ${
                    activeForm === 'feedback' 
                      ? 'bg-[#8B0000] text-white shadow-lg' 
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare size={18} />
                  {t('contact.tabs.feedback')}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeForm === 'message' ? (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-2xl font-bold text-[#8B0000] mb-8">{t('contact.form.title')}</h3>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('contact.form.name')}</label>
                          <input 
                            type="text" 
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
                            placeholder={t('contact.form.name.placeholder')}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('contact.form.email')}</label>
                          <input 
                            type="email" 
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
                            placeholder={t('contact.form.email.placeholder')}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('contact.form.subject')}</label>
                        <input 
                          type="text" 
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
                          placeholder={t('contact.form.subject.placeholder')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('contact.form.message')}</label>
                        <textarea 
                          rows={6}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all resize-none"
                          placeholder={t('contact.form.message.placeholder')}
                        ></textarea>
                      </div>
                      <button className="w-full md:w-auto px-12 py-4 bg-[#8B0000] text-white rounded-full font-bold hover:bg-[#6B0000] transition-all shadow-lg flex items-center justify-center gap-2">
                        <Send size={18} /> {t('contact.form.submit')}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-2xl font-bold text-[#8B0000] mb-8">{t('feedback.title')}</h3>
                    
                    <div className="mb-10 text-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t('feedback.rate')}</p>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="p-2 transition-transform hover:scale-125"
                          >
                            <Star 
                              size={32} 
                              className={`${
                                (hoveredRating || rating) >= star 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-gray-200'
                              } transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="mt-4 text-sm font-medium text-gray-500">
                        {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : rating === 1 ? 'Poor' : 'Select a rating'}
                      </p>
                    </div>

                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('feedback.form.name')}</label>
                          <input 
                            type="text" 
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
                            placeholder={t('feedback.form.name.placeholder')}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('feedback.form.location')}</label>
                          <input 
                            type="text" 
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
                            placeholder={t('feedback.form.location.placeholder')}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('feedback.form.comments')}</label>
                        <textarea 
                          rows={5}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all resize-none"
                          placeholder={t('feedback.form.comments.placeholder')}
                        ></textarea>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <ThumbsUp className="text-blue-600 shrink-0" size={20} />
                        <p className="text-xs text-blue-800 leading-relaxed">
                          {t('feedback.note')}
                        </p>
                      </div>

                      <button className="w-full py-4 bg-[#8B0000] text-white rounded-full font-bold hover:bg-[#6B0000] transition-all shadow-lg">
                        {t('feedback.form.submit')}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
