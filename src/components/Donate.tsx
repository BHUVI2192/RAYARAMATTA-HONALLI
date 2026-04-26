import React from 'react';
import { motion } from 'motion/react';
import { Heart, CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Donate: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    amount: '501'
  });
  const [loading, setLoading] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [paymentId, setPaymentId] = React.useState('');

  React.useEffect(() => {
    // Check for Razorpay redirect
    const urlParams = new URLSearchParams(window.location.search);
    const pId = urlParams.get('razorpay_payment_id');
    const oId = urlParams.get('razorpay_order_id');
    const signature = urlParams.get('razorpay_signature');
    
    if (pId) {
      // Clear URL
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      
      const savedForm = localStorage.getItem('donationForm');
      if (savedForm) {
        const parsedForm = JSON.parse(savedForm);
        setFormData(parsedForm);
        verifyAndSaveDonation({
          razorpay_payment_id: pId,
          razorpay_order_id: oId,
          razorpay_signature: signature
        }, parsedForm);
        localStorage.removeItem('donationForm');
      }
    }
  }, []);

  const verifyAndSaveDonation = async (response: any, formInfo: any) => {
    setLoading(true);
    const pId = response.razorpay_payment_id;
    try {
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'donation',
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          amount: parseInt(formInfo.amount),
          ...formInfo
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) throw new Error('Payment verification failed');

      setPaymentId(pId);
      setShowSuccess(true);
      setFormData({ name: '', email: '', phone: '', amount: '501' });
    } catch (err: any) {
      console.error('Verification Error:', err);
      alert('Payment verified but failed to save record. Please contact admin with Payment ID: ' + pId);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(formData.amount);
    if (!formData.name || !formData.phone || isNaN(amount) || amount < 1) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      // Persist state for mobile redirects
      localStorage.setItem('currentPage', 'donate');
      localStorage.setItem('donationForm', JSON.stringify(formData));

      // 1. Create Order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: formData.amount,
          type: 'donation'
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create order');

      // 2. Open Razorpay Modal
      const options = {
        key: orderData.keyId,
        amount: amount * 100,
        currency: 'INR',
        name: "Rayara Matta Honalli",
        description: "General Donation",
        order_id: orderData.order_id,
        handler: async (response: any) => {
          verifyAndSaveDonation(response, formData);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            fetch('/api/notify-failure', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                amount: formData.amount,
                errorMsg: 'Transaction cancelled by user'
              })
            });
          }
        },
        theme: { color: "#8B0000" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Donation Error:', err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-[40px] shadow-2xl max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-[#8B0000] mb-4">Thank You!</h2>
          <p className="text-gray-500 font-medium leading-relaxed mb-6">
            Your generous donation has been received. Your support helps us continue our sacred mission.
          </p>
          {paymentId && (
            <div className="bg-emerald-50 rounded-2xl p-4 mb-8 border border-emerald-100">
               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Payment ID</p>
               <p className="font-mono font-bold text-emerald-800 text-xs break-all">{paymentId}</p>
            </div>
          )}
          <button 
            onClick={() => setShowSuccess(false)}
            className="w-full bg-[#8B0000] text-white py-5 rounded-2xl font-bold hover:bg-[#6B0000] transition-all shadow-xl active:scale-95"
          >
            Make Another Donation
          </button>
        </motion.div>
      </div>
    );
  }

  // Full-screen loading state for verification (mobile redirects)
  if (loading && window.location.search.includes('razorpay_payment_id')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-20 h-20 border-4 border-[#8B0000]/20 border-t-[#8B0000] rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black text-[#8B0000] mb-2 uppercase tracking-tight">Verifying Donation</h2>
        <p className="text-gray-500 font-bold text-sm text-center max-w-xs leading-relaxed">
          Please wait a moment while we confirm your transaction with Razorpay...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-5 bg-red-100 text-[#8B0000] rounded-3xl mb-6 shadow-sm"
          >
            <Heart size={40} fill="currentColor" />
          </motion.div>
          <h1 className="text-5xl font-black text-[#8B0000] mb-6 tracking-tight">{t('donate.title')}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            {t('donate.desc')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Online Payment Card - Now Centered and Main Focus */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100"
          >
            <div className="flex items-center justify-center gap-4 mb-10 text-[#8B0000]">
              <div className="p-4 bg-red-50 rounded-3xl">
                <CreditCard size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight">{t('donate.online.title')}</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Secure via Razorpay</p>
              </div>
            </div>

            <form onSubmit={handleDonate} className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Donor Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[24px] focus:ring-4 focus:ring-[#8B0000]/10 outline-none font-bold text-gray-800 transition-all focus:bg-white text-lg"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[24px] focus:ring-4 focus:ring-[#8B0000]/10 outline-none font-bold text-gray-800 transition-all focus:bg-white"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email ID (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[24px] focus:ring-4 focus:ring-[#8B0000]/10 outline-none font-bold text-gray-800 transition-all focus:bg-white"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select or Enter Amount (₹) *</label>
                <div className="grid grid-cols-4 gap-3">
                  {['501', '1001', '2501', '5001'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, amount: amt }))}
                      className={`py-4 rounded-2xl font-black text-sm transition-all ${
                        formData.amount === amt 
                        ? 'bg-[#8B0000] text-white shadow-xl scale-105' 
                        : 'bg-gray-50 text-gray-500 hover:bg-stone-100 border border-stone-100'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <div className="relative group">
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[#8B0000] font-black text-2xl group-focus-within:scale-110 transition-transform">₹</span>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-stone-100 rounded-[30px] focus:ring-8 focus:ring-[#8B0000]/5 focus:border-[#8B0000]/20 outline-none text-4xl font-black text-[#8B0000] transition-all focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B0000] text-white py-7 rounded-[30px] font-black hover:bg-[#6B0000] transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(139,0,0,0.3)] disabled:opacity-50 active:scale-95 mt-8 text-xl tracking-wide uppercase"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <Heart size={28} fill="white" className="animate-pulse" />
                    DONATE NOW
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 pt-8">
                <div className="h-px flex-1 bg-stone-100"></div>
                <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Checkout</span>
                </div>
                <div className="h-px flex-1 bg-stone-100"></div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
