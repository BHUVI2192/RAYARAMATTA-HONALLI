import React from 'react';
import { motion } from 'motion/react';
import { Heart, CreditCard, Landmark, Copy } from 'lucide-react';

export const Donate: React.FC = () => {
  const bankDetails = {
    accountName: "Shri Raghavendra Swamy Seva Trust",
    accountNumber: "1234567890",
    bankName: "State Bank of India",
    branch: "Honali Branch",
    ifscCode: "SBIN0001234",
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
          <h1 className="text-4xl font-bold text-[#8B0000] mb-4">Support the Trust</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your generous contributions help us maintain the temple, conduct daily poojas, 
            and support our various social activities including the Goshala.
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
              <h2 className="text-xl font-bold">Bank Transfer</h2>
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
            className="bg-[#8B0000] text-white p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <CreditCard size={24} />
              <h2 className="text-xl font-bold">Online Payment</h2>
            </div>
            
            <div className="bg-white p-4 rounded-xl mb-6 flex justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=honali.mutt@sbi&pn=Shri%20Raghavendra%20Swamy%20Seva%20Trust&cu=INR" 
                alt="UPI QR Code"
                className="w-48 h-48"
              />
            </div>

            <div className="text-center">
              <p className="text-sm opacity-80 mb-2">Scan QR code to pay via any UPI app</p>
              <p className="font-mono font-bold text-lg tracking-wider">UPI ID: {bankDetails.upiId}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-xs opacity-60 leading-relaxed">
                * All donations are exempt under section 80G of the Income Tax Act. 
                Please share your transaction details to our email for the receipt.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
