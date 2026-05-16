import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CreditCard, IndianRupee } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Notification {
  id: string;
  title: string;
  description: string;
  amount: number;
}

export const NotificationBar: React.FC = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (data.success && data.notifications.length > 0) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
  }, []);

  if (notifications.length === 0) return null;

  const handleBookNow = (notification: Notification) => {
    setActiveNotification(notification);
    setIsModalOpen(true);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNotification) return;

    setLoading(true);
    setError('');

    try {
      const res = await loadRazorpay();
      if (!res) {
        throw new Error('Razorpay SDK failed to load');
      }

      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activeNotification.amount,
          type: 'special_seva'
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || 'Order creation failed');

      const callbackUrl = new URL(window.location.origin + '/api/verify-payment');
      callbackUrl.searchParams.append('redirect', 'true');
      callbackUrl.searchParams.append('redirect_url', window.location.pathname);
      callbackUrl.searchParams.append('type', 'special_seva');
      callbackUrl.searchParams.append('notification_id', activeNotification.id);
      callbackUrl.searchParams.append('name', formData.name);
      callbackUrl.searchParams.append('phone', formData.phone);
      callbackUrl.searchParams.append('email', formData.email);
      callbackUrl.searchParams.append('amount', activeNotification.amount.toString());

      const options = {
        key: orderData.keyId,
        amount: activeNotification.amount * 100,
        currency: 'INR',
        name: 'Sri Raghavendra Swamy Mutt',
        description: activeNotification.title,
        order_id: orderData.order_id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#8B0000' },
        callback_url: callbackUrl.toString(),
        redirect: true,
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();

    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
    } finally {
      // Keep loading true while Razorpay handles the redirect
      // setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#6B0000] via-[#8B0000] to-[#6B0000] border-b border-red-900/20 w-full z-40 relative overflow-hidden shadow-2xl">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 py-3 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-white flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full animate-[aura_2s_infinite] blur-md opacity-50" />
                <div className="bg-white/20 p-2.5 rounded-xl mr-4 backdrop-blur-sm relative border border-white/20">
                  <Bell className="animate-bounce" size={24} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-[#8B0000] shadow-sm" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg tracking-tight uppercase">{notifications[0].title}</span>
                  <span className="bg-yellow-400 text-red-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Special Seva</span>
                </div>
                <span className="text-sm font-medium opacity-80 line-clamp-1">{notifications[0].description}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-black text-yellow-400 flex items-center bg-black/20 px-5 py-2.5 rounded-2xl backdrop-blur-md border border-white/10">
                <IndianRupee size={18} className="mr-1" />
                {notifications[0].amount}
              </div>
              <button
                onClick={() => handleBookNow(notifications[0])}
                className="bg-yellow-500 text-red-900 px-8 py-2.5 rounded-xl font-black hover:bg-yellow-400 transition-all shadow-[0_4px_20px_rgba(234,179,8,0.3)] active:scale-95 whitespace-nowrap uppercase tracking-wider text-sm"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isModalOpen && activeNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#8B0000]">Book Special Seva</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
                <h4 className="font-bold text-gray-800">{activeNotification.title}</h4>
                <div className="text-xl font-bold text-[#8B0000] mt-2 flex items-center">
                  <IndianRupee size={20} className="mr-1" />
                  {activeNotification.amount}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition-all outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition-all outline-none"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition-all outline-none"
                    placeholder="For payment receipt"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8B0000] text-white py-4 rounded-xl font-bold text-lg hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20 mt-6 flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CreditCard className="mr-2" />
                      Pay ₹{activeNotification.amount}
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
