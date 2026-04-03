import React from 'react';
import { motion } from 'motion/react';
import { Heart, CreditCard, Landmark, Copy, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Donate: React.FC = () => {
  const { t } = useLanguage();

  const bankDetails = {
    accountName: "Shri Raghavendra Swamy Seva Trust",
    accountNumber: "3102500101501101",
    bankName: "KARNATAKA BANK LTD",
    branch: "Honnali- 577217",
    ifscCode: "KARB0000310",
    upiId: "honali.mutt@sbi"
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };


  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 bg-red-100 text-red-600 rounded-full mb-4"
          >
            <Heart size={48} fill="currentColor" />
          </motion.div>
          <h1 className="text-4xl font-bold text-[#8B0000] mb-4">{t('donate.title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('donate.desc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6 text-[#8B0000]">
              <Landmark size={24} />
              <h2 className="text-xl font-bold">{t('donate.bank.title')}</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(bankDetails).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="font-medium text-gray-800">{value}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(value)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-[#8B0000] text-white p-8 rounded-2xl shadow-xl space-y-8 flex flex-col justify-center"
          >
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-white/10 rounded-full mb-2">
                <Smartphone size={32} />
              </div>
              <h2 className="text-2xl font-bold">{t('donate.online.title')}</h2>
              <p className="text-red-100 opacity-80 text-sm">
                For quick donations, please use any UPI app (Google Pay, PhonePe, Paytm) to scan or enter our UPI ID.
              </p>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center space-y-4">
              <p className="text-xs font-bold text-red-200 uppercase tracking-widest">Official UPI ID</p>
              <p className="text-2xl font-bold select-all">{bankDetails.upiId}</p>
              <button 
                onClick={() => copyToClipboard(bankDetails.upiId)}
                className="inline-flex items-center gap-2 bg-white text-[#8B0000] px-6 py-2 rounded-full font-bold text-sm hover:bg-red-50 transition-all"
              >
                <Copy size={16} /> Copy UPI ID
              </button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs opacity-60 uppercase tracking-widest leading-relaxed">
                Thank you for your support.<br/>
                Online payment gateway will be enabled soon.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
