import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, BookOpen, FileText, Smartphone, ChevronRight, ChevronLeft, CheckCircle, ExternalLink, ArrowLeft, CreditCard, Loader2, Landmark } from 'lucide-react';
import { Seva, BookingData } from '../types';
import { useLanguage } from '../context/LanguageContext';


interface SevaBookingProps {
  selectedSeva: Seva;
  onComplete: () => void;
  onCancel: () => void;
}

export const SevaBooking: React.FC<SevaBookingProps> = ({ selectedSeva, onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [returnedFromPayment, setReturnedFromPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const visibilityHandlerRef = useRef<(() => void) | null>(null);
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<BookingData>>({
    seva: selectedSeva,
    userDetails: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
    poojaDetails: {
      date: '',
      count: 1,
      gothra: '',
      nakshathra: '',
      rashi: '',
      vedha: '',
      message: '',
    }
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('razorpay_payment_id');
    const orderId = urlParams.get('razorpay_order_id');
    const signature = urlParams.get('razorpay_signature');

    if (paymentId) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      
      const savedForm = localStorage.getItem('sevaBookingForm');
      if (savedForm) {
        const parsedForm = JSON.parse(savedForm);
        setFormData(parsedForm);
        setStep(4); // Advance to payment step
        verifyAndSaveBooking({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        }, parsedForm);
        localStorage.removeItem('sevaBookingForm');
      }
    }
  }, []);

  const verifyAndSaveBooking = async (response: any, formInfo: any) => {
    setIsSubmitting(true);
    const paymentId = response.razorpay_payment_id;
    try {
      const saveResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formInfo,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          poojaDetails: {
            ...formInfo.poojaDetails,
            transactionId: paymentId,
            payment_status: 'Confirmed'
          }
        }),
      });

      let saveData: any = { success: false, error: 'Server error' };
      try {
        saveData = await saveResponse.json();
      } catch {
        saveData.error = `Server returned status ${saveResponse.status}`;
      }

      if (saveData.success) {
        // ✅ DB saved — show success
        setTransactionId(paymentId);
        setShowSuccess(true);
      } else {
        // ❌ DB failed — payment went through but record wasn't saved
        const totalAmount = (formInfo.seva?.price || 0) * (formInfo.poojaDetails?.count || 1);
        alert(
          `Your payment of ₹${totalAmount} was received by Razorpay (ID: ${paymentId}), but we couldn't save your booking details due to a server error.\n\nPlease contact the Mutt at +91-XXXXX-XXXXX and share this Payment ID. Your booking is confirmed.`
        );
      }
    } catch (err: any) {
      console.error('Post-payment error:', err);
      alert(
        `Your payment was received (ID: ${paymentId}), but we encountered a network error saving your details.\n\nPlease contact the Mutt and share this Payment ID.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const updateUserDetails = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      userDetails: { ...prev.userDetails!, [field]: value }
    }));
  };

  const updatePoojaDetails = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      poojaDetails: { ...prev.poojaDetails!, [field]: value }
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[
        { id: 1, icon: <User size={18} />, label: t('booking.steps.user') },
        { id: 2, icon: <BookOpen size={18} />, label: t('booking.steps.pooja') },
        { id: 3, icon: <FileText size={18} />, label: t('booking.steps.summary') },
        { id: 4, icon: <CreditCard size={18} />, label: t('booking.steps.payment') },
      ].map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center relative">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
              step >= s.id ? 'bg-[#8B0000] text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              {step > s.id ? <CheckCircle size={18} className="sm:w-5 sm:h-5" /> : React.cloneElement(s.icon as React.ReactElement<any>, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
            </div>
            <span className={`absolute -bottom-6 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
              step >= s.id ? 'text-[#8B0000]' : 'text-gray-400'
            }`}>
              {s.label}
            </span>
          </div>
          {i < 3 && (
            <div className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 ${step > s.id ? 'bg-[#8B0000]' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderUserDetails = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.form.name')}</label>
          <input
            type="text"
            required
            value={formData.userDetails?.name}
            onChange={(e) => updateUserDetails('name', e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
            placeholder={t('booking.form.name.placeholder')}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.form.phone')}</label>
          <input
            type="tel"
            required
            value={formData.userDetails?.phone}
            onChange={(e) => updateUserDetails('phone', e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
            placeholder={t('booking.form.phone.placeholder')}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.form.email')}</label>
        <input
          type="email"
          required
          value={formData.userDetails?.email}
          onChange={(e) => updateUserDetails('email', e.target.value)}
          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
          placeholder={t('booking.form.email.placeholder')}
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.form.address')}</label>
        <textarea
          required
          rows={3}
          value={formData.userDetails?.address}
          onChange={(e) => updateUserDetails('address', e.target.value)}
          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all resize-none"
          placeholder={t('booking.form.address.placeholder')}
        ></textarea>
      </div>
      <div className="flex flex-col sm:flex-row justify-between pt-8 gap-4">
        <button onClick={onCancel} className="text-gray-400 font-bold hover:text-gray-600 transition-colors order-2 sm:order-1">{t('booking.btn.cancel')}</button>
        <button
          onClick={nextStep}
          disabled={!formData.userDetails?.name || !formData.userDetails?.phone || !formData.userDetails?.email || !formData.userDetails?.address}
          className="bg-[#8B0000] text-white px-10 py-4 rounded-full font-bold hover:bg-[#6B0000] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto order-1 sm:order-2"
        >
          {t('booking.btn.next')} <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  const renderPoojaDetails = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-[#8B0000] mb-6">{t('booking.pooja.title')}</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.pooja.date')}</label>
          <input
            type="date"
            required
            value={formData.poojaDetails?.date}
            onChange={(e) => updatePoojaDetails('date', e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.pooja.count')}</label>
          <input
            type="number"
            min="1"
            required
            value={formData.poojaDetails?.count}
            onChange={(e) => updatePoojaDetails('count', parseInt(e.target.value))}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.pooja.gothra')}</label>
          <input
            type="text"
            value={formData.poojaDetails?.gothra}
            onChange={(e) => updatePoojaDetails('gothra', e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
            placeholder="e.g. Rama"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.pooja.nakshathra')}</label>
          <input
            type="text"
            value={formData.poojaDetails?.nakshathra}
            onChange={(e) => updatePoojaDetails('nakshathra', e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
            placeholder="e.g. Ashwini"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.pooja.rashi')}</label>
          <input
            type="text"
            value={formData.poojaDetails?.rashi}
            onChange={(e) => updatePoojaDetails('rashi', e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
            placeholder="e.g. Dhanu"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.pooja.vedha')}</label>
          <input
            type="text"
            value={formData.poojaDetails?.vedha}
            onChange={(e) => updatePoojaDetails('vedha', e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
            placeholder="e.g. Govinda"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('booking.pooja.message')}</label>
        <textarea
          rows={3}
          value={formData.poojaDetails?.message}
          onChange={(e) => updatePoojaDetails('message', e.target.value)}
          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all resize-none"
          placeholder={t('booking.pooja.message.placeholder')}
        ></textarea>
      </div>
      <div className="flex flex-col sm:flex-row justify-between pt-8 gap-4">
        <button onClick={prevStep} className="flex items-center justify-center gap-2 text-gray-400 font-bold hover:text-gray-600 transition-colors order-2 sm:order-1">
          <ChevronLeft size={18} /> {t('booking.btn.back')}
        </button>
        <button
          onClick={nextStep}
          disabled={!formData.poojaDetails?.date}
          className="bg-[#8B0000] text-white px-10 py-4 rounded-full font-bold hover:bg-[#6B0000] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto order-1 sm:order-2"
        >
          {t('booking.btn.next')} <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  const renderSummary = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
        <h3 className="text-xl font-bold text-[#8B0000] mb-6">{t('booking.summary.title')}</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('booking.steps.user')}</h4>
            <div className="text-sm space-y-2">
              <p><span className="font-bold">{t('booking.form.name')}:</span> {formData.userDetails?.name}</p>
              <p><span className="font-bold">{t('booking.form.phone')}:</span> {formData.userDetails?.phone}</p>
              <p><span className="font-bold">{t('booking.form.email')}:</span> {formData.userDetails?.email}</p>
              <p><span className="font-bold">{t('booking.form.address')}:</span> {formData.userDetails?.address}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('booking.steps.pooja')}</h4>
            <div className="text-sm space-y-2">
              <p><span className="font-bold">Seva:</span> {formData.seva?.name}</p>
              <p><span className="font-bold">{t('booking.pooja.date')}:</span> {formData.poojaDetails?.date}</p>
              <p><span className="font-bold">{t('booking.pooja.count')}:</span> {formData.poojaDetails?.count}</p>
              <p><span className="font-bold">{t('booking.pooja.gothra')}:</span> {formData.poojaDetails?.gothra || '-'}</p>
              <p><span className="font-bold">{t('booking.pooja.nakshathra')}:</span> {formData.poojaDetails?.nakshathra || '-'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-center">
          <p className="text-gray-500">{t('booking.summary.total')}:</p>
          <p className="text-3xl font-bold text-[#8B0000]">₹{(formData.seva?.price || 0) * (formData.poojaDetails?.count || 1)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between pt-8 gap-4">
        <button onClick={prevStep} className="flex items-center justify-center gap-2 text-gray-400 font-bold hover:text-gray-600 transition-colors order-2 sm:order-1">
          <ChevronLeft size={18} /> {t('booking.btn.back')}
        </button>
        <button
          onClick={nextStep}
          className="bg-[#8B0000] text-white px-10 py-4 rounded-full font-bold hover:bg-[#6B0000] transition-all shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
        >
          {t('booking.btn.payment')} <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );


  const handleOnlinePayment = async () => {
    const totalAmount = (formData.seva?.price || 0) * (formData.poojaDetails?.count || 1);
    setIsSubmitting(true);
    try {
      // Explicitly persist route state so App.tsx restores correctly on mobile redirect
      localStorage.setItem('currentPage', 'booking');
      if (formData.seva) localStorage.setItem('selectedSeva', JSON.stringify(formData.seva));
      // Save full form state in case Razorpay redirects
      localStorage.setItem('sevaBookingForm', JSON.stringify(formData));

      // 1. Create Order
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, type: 'seva' }),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        throw new Error(`Server error (${orderResponse.status}): ${errorText || 'Unknown error'}`);
      }

      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error(orderData.error || 'Order creation failed');

      const options = {
        key: orderData.keyId,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Trust Donation',
        description: `${formData.seva?.name} Booking`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          verifyAndSaveBooking(response, formData);
        },
        prefill: {
          name: formData.userDetails?.name,
          email: formData.userDetails?.email,
          contact: formData.userDetails?.phone,
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
            localStorage.removeItem('sevaBookingForm');
            fetch('/api/notify-failure', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: formData.userDetails?.name,
                email: formData.userDetails?.email,
                amount: (formData.seva?.price || 0) * (formData.poojaDetails?.count || 1),
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
      alert(`Could not initiate payment: ${error.message}`);
      localStorage.removeItem('sevaBookingForm');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} />
      </div>
      <h2 className="text-3xl font-bold text-[#8B0000] mb-4">Seva Booked Successfully!</h2>
      <p className="text-gray-600 mb-8 px-4">
        Your booking for <strong>{formData.seva?.name}</strong> has been received. 
        A confirmation email has been sent to <strong>{formData.userDetails?.email}</strong>.
      </p>
      
      <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 mb-10 max-w-sm mx-auto text-left">
        <div className="flex justify-between items-center pb-4 border-b border-stone-200">
          <span className="text-gray-600 font-bold tracking-wide">Amount Paid</span>
          <span className="text-[#8B0000] font-bold text-lg">₹{(formData.seva?.price || 0) * (formData.poojaDetails?.count || 1)}</span>
        </div>
        <div className="pt-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction Reference</p>
          <p className="font-mono font-bold text-gray-700 text-sm break-all">{transactionId}</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="bg-[#8B0000] text-white px-12 py-4 rounded-full font-bold shadow-xl hover:bg-[#6B0000] transition-all"
      >
        Done
      </button>
    </motion.div>
  );

  const renderPayment = () => {
    const totalAmount = (formData.seva?.price || 0) * (formData.poojaDetails?.count || 1);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-4"
      >
        <div className="bg-[#8B0000] text-white rounded-3xl p-6 text-center mb-8 shadow-xl">
          <p className="text-sm opacity-80 uppercase tracking-widest font-bold mb-1">Total Amount</p>
          <p className="text-5xl font-black">₹{totalAmount}</p>
          <p className="text-sm opacity-80 mt-2 font-medium">{formData.seva?.name} × {formData.poojaDetails?.count}</p>
        </div>

        <div className="text-center py-8">
          <div className="mb-10">
            <div className="w-20 h-20 bg-[#8B0000]/10 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Secure Online Payment</h3>
            <p className="text-gray-500 font-medium mt-3">Click below to pay ₹{totalAmount} via Razorpay</p>
          </div>

          <button
            onClick={handleOnlinePayment}
            disabled={isSubmitting}
            className="w-full max-w-md bg-[#8B0000] text-white py-7 rounded-[30px] font-black shadow-[0_20px_50px_rgba(139,0,0,0.2)] hover:bg-[#6B0000] transition-all flex items-center justify-center gap-4 disabled:opacity-50 mx-auto text-xl uppercase tracking-wide"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <ExternalLink size={24} />
                Pay Now
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-4 mt-12 opacity-30">
            <div className="h-px w-12 bg-gray-300"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secured by Razorpay</span>
            <div className="h-px w-12 bg-gray-300"></div>
          </div>
        </div>

        <div className="flex justify-start pt-8">
          <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-600 transition-colors">
            <ChevronLeft size={18} /> {t('booking.btn.back')}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-50">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#8B0000] mb-2">{t('booking.title')}</h2>
              <p className="text-gray-400 font-medium">{selectedSeva.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{t('booking.price')}</p>
              <p className="text-2xl font-bold text-[#8B0000]">₹{selectedSeva.price}</p>
            </div>
          </div>

          {renderStepIndicator()}

          <AnimatePresence mode="wait">
            {showSuccess ? renderSuccess() : (
              <>
                {step === 1 && renderUserDetails()}
                {step === 2 && renderPoojaDetails()}
                {step === 3 && renderSummary()}
                {step === 4 && renderPayment()}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

