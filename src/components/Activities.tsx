import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Info, BookOpen, Globe, CreditCard, User, Phone, Mail, IndianRupee, CheckCircle, Loader2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const goshalaImages = [
  'https://picsum.photos/seed/cow1/800/600',
  'https://picsum.photos/seed/cow2/800/600',
  'https://picsum.photos/seed/cow3/800/600',
];

export const Activities: React.FC = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const [showGodanaModal, setShowGodanaModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successPaymentId, setSuccessPaymentId] = useState('');
  const [godanaForm, setGodanaForm] = useState({
    name: '',
    phone: '',
    email: '',
    amount: '501'
  });
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % goshalaImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleGodanaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(godanaForm.amount);
    if (isNaN(amount) || amount < 1) {
      alert('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Order on Server
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type: 'godana' }),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        throw new Error(`Server error (${orderResponse.status}): ${errorText || 'Unknown error'}`);
      }

      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error(orderData.error || 'Order creation failed');

      const options = {
        key: orderData.keyId || 'rzp_live_SX8dAraaIbrAei', // Fallback or from server
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'Rayara Matta Honalli',
        description: 'Godana Seva Contribution',
        order_id: orderData.order.id,
        handler: async (response: any) => {
          setIsSubmitting(true);
          try {
            // 2. Verify Payment on Server
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            
            if (!verifyResponse.ok) throw new Error('Verification request failed');
            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // 3. Save Godana Payment
              const saveResponse = await fetch('/api/godana', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...godanaForm,
                  amount,
                  payment_id: response.razorpay_payment_id
                }),
              });
              
              if (!saveResponse.ok) throw new Error('Saving payment failed');
              const saveData = await saveResponse.json();
              
              if (saveData.success) {
                setSuccessPaymentId(response.razorpay_payment_id);
                setShowSuccess(true);
                setGodanaForm({ name: '', phone: '', email: '', amount: '501' });
              } else {
                throw new Error(saveData.error || 'Failed to save contribution details');
              }
            } else {
              alert('Payment verification failed. Please contact support if your money was deducted.');
            }
          } catch (err: any) {
            console.error('Post-payment error:', err);
            alert(`Error: ${err.message}. Please save your Payment ID: ${response.razorpay_payment_id}`);
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: godanaForm.name,
          email: godanaForm.email,
          contact: godanaForm.phone,
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
            fetch('/api/notify-failure', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: godanaForm.name,
                email: godanaForm.email,
                amount,
                errorMsg: 'Transaction cancelled by user'
              })
            });
          }
        },
        theme: {
          color: '#8B0000',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Razorpay Error:', error);
      alert(`Could not initiate payment: ${error.message}. Please ensure the server is running.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#8B0000] mb-4">{t('act.title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('act.desc')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImg}
                src={goshalaImages[currentImg]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[#8B0000] font-bold text-sm shadow-lg">
              Honali Goshala
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">
              <Heart size={16} />
              <span>{t('act.goshala.label')}</span>
            </div>
            <h2 className="text-3xl font-bold text-[#8B0000] mb-6">{t('act.goshala.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {t('act.goshala.desc')}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-700 mb-1">50+</p>
                <p className="text-xs text-emerald-600 font-bold uppercase">{t('act.goshala.cows')}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-2xl font-bold text-orange-700 mb-1">Daily</p>
                <p className="text-xs text-orange-600 font-bold uppercase">{t('act.goshala.fodder')}</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowGodanaModal(true)}
              className="mt-8 w-full sm:w-auto bg-[#8B0000] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-[#6B0000] transition-all flex items-center justify-center gap-3"
            >
              <Heart size={20} fill="currentColor" />
              {t('act.goshala.btn')}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showGodanaModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-y-auto max-h-[90vh] relative mx-4"
              >
                <button 
                  onClick={() => setShowGodanaModal(false)}
                  className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-10"
                >
                  <X size={24} />
                </button>

                  <div className="p-6 sm:p-12">
                    <AnimatePresence mode="wait">
                      {!showSuccess ? (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="text-center mb-8 sm:mb-10">
                            <div className="inline-block p-2.5 sm:p-3 bg-emerald-100 text-emerald-600 rounded-2xl mb-4">
                              <Heart size={28} fill="currentColor" className="sm:w-8 sm:h-8" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#8B0000]">{t('act.goshala.mdl.title')}</h2>
                            <p className="text-sm sm:text-base text-gray-500 mt-2 px-2">{t('act.goshala.mdl.desc')}</p>
                          </div>

                          <form onSubmit={handleGodanaPayment} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                  <User size={14} /> {t('act.goshala.form.name')}
                                </label>
                                <input
                                  required
                                  type="text"
                                  value={godanaForm.name}
                                  onChange={(e) => setGodanaForm({...godanaForm, name: e.target.value})}
                                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
                                  placeholder="John Doe"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                  <Phone size={14} /> {t('act.goshala.form.phone')}
                                </label>
                                <input
                                  required
                                  type="tel"
                                  value={godanaForm.phone}
                                  onChange={(e) => setGodanaForm({...godanaForm, phone: e.target.value})}
                                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
                                  placeholder="+91 99000 00000"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Mail size={14} /> {t('act.goshala.form.email')}
                              </label>
                              <input
                                required
                                type="email"
                                value={godanaForm.email}
                                onChange={(e) => setGodanaForm({...godanaForm, email: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
                                placeholder="john@example.com"
                              />
                            </div>

                            <div className="space-y-4">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <IndianRupee size={14} /> {t('act.goshala.form.amount')}
                              </label>
                              <div className="grid grid-cols-4 gap-2">
                                {['501', '1001', '5001', '10001'].map((val) => (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => setGodanaForm({...godanaForm, amount: val})}
                                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                                      godanaForm.amount === val 
                                        ? 'bg-[#8B0000] text-white border-[#8B0000]' 
                                        : 'bg-white text-gray-600 border-gray-100 hover:border-[#8B0000]'
                                    }`}
                                  >
                                    ₹{val}
                                  </button>
                                ))}
                              </div>
                              <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input
                                  required
                                  type="number"
                                  value={godanaForm.amount}
                                  onChange={(e) => setGodanaForm({...godanaForm, amount: e.target.value})}
                                  className="w-full pl-10 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all font-bold text-lg"
                                  placeholder="Other amount"
                                />
                              </div>
                            </div>

                            <button
                              disabled={isSubmitting}
                              className="w-full bg-[#8B0000] text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-[#6B0000] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                            >
                              {isSubmitting ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
                              {isSubmitting ? t('act.goshala.form.processing') : `${t('act.goshala.form.submit')} ₹${godanaForm.amount}`}
                            </button>
                          </form>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-6"
                        >
                          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                          </div>
                          <h2 className="text-2xl font-bold text-[#8B0000] mb-2">Contribution Received!</h2>
                          <p className="text-gray-500 mb-8">{t('act.goshala.success')}</p>
                          
                          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 mb-8 text-left">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Transaction ID</p>
                            <p className="font-mono font-bold text-emerald-800 text-sm break-all">{successPaymentId}</p>
                          </div>

                          <button
                            onClick={() => {
                              setShowGodanaModal(false);
                              setShowSuccess(false);
                            }}
                            className="bg-[#8B0000] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-[#6B0000] transition-all w-full"
                          >
                            Close
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <Globe className="text-blue-600" size={32} />,
              title: t('act.virtual.title'),
              desc: t('act.virtual.desc')
            },
            {
              icon: <BookOpen className="text-purple-600" size={32} />,
              title: t('act.veda.title'),
              desc: t('act.veda.desc')
            },
            {
              icon: <Info className="text-yellow-600" size={32} />,
              title: t('act.social.title'),
              desc: t('act.social.desc')
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold text-[#8B0000] mb-4">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Festivals Section */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-stone-50 p-8 md:p-12 rounded-3xl border border-stone-200"
        >
          <h2 className="text-3xl font-bold text-[#8B0000] mb-8 text-center">{t('act.festivals.title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#8B0000] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {num}
                </div>
                <p className="text-gray-700 font-medium">{t(`act.festivals.${num}`)}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};
