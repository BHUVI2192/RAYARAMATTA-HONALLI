import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, BookOpen, FileText, Smartphone, ChevronRight, ChevronLeft, CheckCircle, ExternalLink, ArrowLeft, CreditCard, Loader2, Landmark } from 'lucide-react';
import { Seva, BookingData } from '../types';
import { useLanguage } from '../context/LanguageContext';

const UPI_ID = 'honali.mutt@sbi';
const PAYEE_NAME = 'Shri Raghavendra Swamy Seva Trust';

const BANK_DETAILS = {
  accountName: "Shri Raghavendra Swamy Seva Trust",
  accountNumber: "3102500101501101",
  bankName: "KARNATAKA BANK LTD",
  branch: "Honnali- 577217",
  ifscCode: "KARB0000310",
  upiId: "honali.mutt@sbi"
};

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

    if (paymentId && orderId && signature) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      
      const savedForm = sessionStorage.getItem('sevaBookingForm');
      if (savedForm) {
        const parsedForm = JSON.parse(savedForm);
        setFormData(parsedForm);
        setStep(4); // Advance to payment step
        verifyAndSaveBooking({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        }, parsedForm);
        sessionStorage.removeItem('sevaBookingForm');
      }
    }
  }, []);

  const verifyAndSaveBooking = async (response: any, formInfo: any) => {
    setIsSubmitting(true);
    try {
      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      });
      
      if (!verifyResponse.ok) throw new Error('Verification request failed');
      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        const saveResponse = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formInfo,
            poojaDetails: {
              ...formInfo.poojaDetails,
              transactionId: response.razorpay_payment_id,
              payment_status: 'Confirmed'
            }
          }),
        });
        
        if (!saveResponse.ok) throw new Error('Saving booking failed');
        const saveData = await saveResponse.json();
        
        if (saveData.success) {
          setTransactionId(response.razorpay_payment_id);
          setShowSuccess(true);
        } else {
          throw new Error(saveData.error || 'Failed to save booking details');
        }
      } else {
        alert('Payment verification failed.');
      }
    } catch (err: any) {
      console.error('Post-payment error:', err);
      alert(`Error: ${err.message}. Please save your Payment ID: ${response.razorpay_payment_id}`);
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

  const [paymentMode, setPaymentMode] = useState<'online' | 'manual' | null>(null);

  const handleOnlinePayment = async () => {
    const totalAmount = (formData.seva?.price || 0) * (formData.poojaDetails?.count || 1);
    setIsSubmitting(true);
    try {
      // Save form state in case Razorpay redirects
      sessionStorage.setItem('sevaBookingForm', JSON.stringify(formData));

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
        key: orderData.keyId || 'rzp_live_SX8dAraaIbrAei',
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'Rayara Matta Honalli',
        description: `${formData.seva?.name} Booking`,
        order_id: orderData.order.id,
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
            sessionStorage.removeItem('sevaBookingForm');
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
      sessionStorage.removeItem('sevaBookingForm');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!formData.poojaDetails?.transactionId) {
      alert(t('booking.manual.field.utr.placeholder'));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          poojaDetails: {
            ...formData.poojaDetails,
            payment_status: 'Pending Verification'
          }
        }),
      });
      if (!response.ok) throw new Error('Failed to save booking');
      setTransactionId(formData.poojaDetails.transactionId);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('There was an error saving your booking. Please contact the Mutt administrator.');
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
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction Reference</p>
        <p className="font-mono font-bold text-gray-700 text-sm break-all">{transactionId}</p>
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

        {!paymentMode ? (
          <div className="space-y-4">
            <p className="text-center text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">Select Payment Method</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMode('online')}
                className="flex flex-col items-center justify-center gap-4 p-8 bg-white border-2 border-stone-100 rounded-3xl hover:border-[#8B0000] hover:bg-stone-50 transition-all group"
              >
                <div className="p-4 bg-stone-50 rounded-2xl group-hover:bg-[#8B0000]/10 transition-all">
                  <CreditCard size={32} className="text-[#8B0000]" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">Online Payment</p>
                  <p className="text-xs text-gray-400 mt-1">UPI, Cards, Netbanking</p>
                </div>
              </button>
              <button
                onClick={() => setPaymentMode('manual')}
                className="flex flex-col items-center justify-center gap-4 p-8 bg-white border-2 border-stone-100 rounded-3xl hover:border-[#8B0000] hover:bg-stone-50 transition-all group"
              >
                <div className="p-4 bg-stone-50 rounded-2xl group-hover:bg-[#8B0000]/10 transition-all">
                  <Landmark size={32} className="text-[#8B0000]" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">Manual Transfer</p>
                  <p className="text-xs text-gray-400 mt-1">Bank Transfer & UTR</p>
                </div>
              </button>
            </div>
          </div>
        ) : paymentMode === 'online' ? (
          <div className="text-center py-8">
            <div className="mb-8">
              <div className="w-16 h-16 bg-[#8B0000]/10 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Online Secure Payment</h3>
              <p className="text-gray-500 text-sm mt-2">Proceed to pay ₹{totalAmount} via Razorpay</p>
            </div>
            <button
              onClick={handleOnlinePayment}
              disabled={isSubmitting}
              className="w-full max-w-sm bg-[#8B0000] text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-[#6B0000] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <ExternalLink size={20} />}
              {isSubmitting ? 'Processing...' : 'Pay Now'}
            </button>
            <button onClick={() => setPaymentMode(null)} className="mt-6 text-sm font-bold text-gray-400 hover:text-gray-600">
              Change Payment Method
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bank Details */}
              <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6">
                <h3 className="text-[#8B0000] font-bold mb-4 flex items-center gap-2">
                  <Landmark size={20} /> {t('booking.manual.bank.title')}
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'A/C Name', value: BANK_DETAILS.accountName },
                    { label: 'A/C No', value: BANK_DETAILS.accountNumber },
                    { label: 'Bank', value: BANK_DETAILS.bankName },
                    { label: 'IFSC', value: BANK_DETAILS.ifscCode },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-stone-200 pb-2">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">{item.label}</span>
                      <span className="font-bold text-gray-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* UPI QR / ID */}
              <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 text-center flex flex-col items-center justify-center">
                <h3 className="text-[#8B0000] font-bold mb-4 flex items-center gap-2">
                  <Smartphone size={20} /> {t('booking.manual.upi.title')}
                </h3>
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 border border-stone-100">
                  <div className="w-32 h-32 bg-stone-100 flex items-center justify-center text-stone-300 rounded-lg">
                    <p className="text-[10px] px-2">Scan QR code in app</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">UPI ID</p>
                <p className="font-bold text-[#8B0000]">{BANK_DETAILS.upiId}</p>
              </div>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-2">
                  <CreditCard size={14} /> {t('booking.manual.field.utr')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.poojaDetails?.transactionId || ''}
                  onChange={(e) => updatePoojaDetails('transactionId', e.target.value)}
                  placeholder={t('booking.manual.field.utr.placeholder')}
                  className="w-full px-8 py-5 bg-stone-50 border border-stone-200 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-[#8B0000]/10 transition-all font-bold text-center text-lg"
                />
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-3 w-full bg-[#8B0000] hover:bg-[#6B0000] text-white font-bold py-5 px-6 rounded-[24px] shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle size={24} />}
                {isSubmitting ? 'Confirming...' : t('booking.manual.btn.confirm')}
              </button>
              
              <div className="text-center">
                <button onClick={() => setPaymentMode(null)} className="text-sm font-bold text-gray-400 hover:text-gray-600">
                  Change Payment Method
                </button>
              </div>
            </div>
          </div>
        )}

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

