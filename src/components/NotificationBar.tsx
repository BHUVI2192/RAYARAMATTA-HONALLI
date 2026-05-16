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
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                type: 'special_seva',
                notification_id: activeNotification.id,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                amount: activeNotification.amount
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert('Payment Successful! Thank you for your Seva.');
              setIsModalOpen(false);
              setFormData({ name: '', phone: '', email: '' });
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Payment was successful but verification failed. Please contact admin.');
          }
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();

    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-yellow-50 border-b border-yellow-200 w-full z-40 relative">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-[#8B0000] font-medium flex-1">
              <Bell className="animate-bounce mr-3" size={24} />
              <div className="flex flex-col">
                <span className="font-bold text-lg">{notifications[0].title}</span>
                <span className="text-sm opacity-90">{notifications[0].description}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-bold text-[#8B0000] flex items-center bg-yellow-100 px-4 py-2 rounded-full">
                <IndianRupee size={18} className="mr-1" />
                {notifications[0].amount}
              </div>
              <button
                onClick={() => handleBookNow(notifications[0])}
                className="bg-[#8B0000] text-white px-6 py-2 rounded-full font-bold hover:bg-red-800 transition-colors shadow-md whitespace-nowrap"
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
