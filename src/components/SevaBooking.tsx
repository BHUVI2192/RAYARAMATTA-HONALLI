import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, BookOpen, FileText, CreditCard, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { Seva, BookingData } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SevaBookingProps {
  selectedSeva: Seva;
  onComplete: () => void;
  onCancel: () => void;
}

export const SevaBooking: React.FC<SevaBookingProps> = ({ selectedSeva, onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
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
              {step > s.id ? <CheckCircle size={18} className="sm:w-5 sm:h-5" /> : React.cloneElement(s.icon as React.ReactElement, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
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

  const renderPayment = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <CreditCard size={40} />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('booking.payment.title')}</h3>
      <p className="text-gray-500 mb-12 max-w-md mx-auto">
        {t('booking.payment.desc')}
        <span className="font-bold text-[#8B0000]"> ₹{(formData.seva?.price || 0) * (formData.poojaDetails?.count || 1)}</span>.
      </p>
      
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-12">
        <button onClick={onComplete} className="p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all flex flex-col items-center gap-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-6" alt="UPI" />
          <span className="text-xs font-bold text-gray-400">UPI</span>
        </button>
        <button onClick={onComplete} className="p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all flex flex-col items-center gap-2">
          <Landmark size={24} className="text-blue-600" />
          <span className="text-xs font-bold text-gray-400">Net Banking</span>
        </button>
      </div>

      <button onClick={prevStep} className="text-gray-400 font-bold hover:text-gray-600 transition-colors">{t('booking.btn.back')}</button>
    </motion.div>
  );

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
            {step === 1 && renderUserDetails()}
            {step === 2 && renderPoojaDetails()}
            {step === 3 && renderSummary()}
            {step === 4 && renderPayment()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Landmark: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 22h18" />
    <path d="M6 18v-7" />
    <path d="M10 18v-7" />
    <path d="M14 18v-7" />
    <path d="M18 18v-7" />
    <path d="M2 11h20" />
    <path d="m2 7 10-5 10 5" />
  </svg>
);
