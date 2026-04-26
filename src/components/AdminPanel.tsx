import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Clock,
  Heart
} from 'lucide-react';

interface Booking {
  id: number;
  seva_name: string;
  seva_price: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  count: number;
  gothra: string;
  nakshathra: string;
  rashi: string;
  vedha: string;
  message: string;
  transaction_id: string;
  payment_status: string;
  created_at: string;
}

interface GodanaPayment {
  id: number;
  name: string;
  phone: string;
  email: string;
  amount: number;
  payment_id: string;
  created_at: string;
}

interface GeneralDonation {
  id: number;
  name: string;
  phone: string;
  email: string;
  amount: number;
  payment_id: string;
  created_at: string;
}

interface AdminPanelProps {
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'sevas' | 'godana' | 'donations'>('sevas');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [godanaPayments, setGodanaPayments] = useState<GodanaPayment[]>([]);
  const [donations, setDonations] = useState<GeneralDonation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Step 1: Validate password via dedicated login endpoint (no Supabase dependency)
      const loginRes = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      let loginData;
      const loginCt = loginRes.headers.get('content-type');
      if (loginCt && loginCt.includes('application/json')) {
        loginData = await loginRes.json();
      } else {
        const text = await loginRes.text();
        throw new Error(`Server error (${loginRes.status}): ${text.substring(0, 200)}`);
      }

      if (loginRes.status === 401 || !loginData.success) {
        setError('Invalid admin password. Please try again.');
        return;
      }

      // Step 2: Authenticated — now fetch data
      setIsAuthenticated(true);
      const headers: Record<string, string> = { 'x-admin-password': password };

      const parseJson = async (res: Response) => {
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) return res.json();
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text.substring(0, 200)}`);
      };

      const [bookingsRes, godanaRes, donationsRes] = await Promise.all([
        fetch('/api/admin/bookings', { headers }),
        fetch('/api/admin/godana', { headers }),
        fetch('/api/admin/donations', { headers }),
      ]);

      const bookingsData = await parseJson(bookingsRes);
      const godanaData = await parseJson(godanaRes);
      const donationsData = await parseJson(donationsRes);

      if (bookingsData.success) setBookings(bookingsData.bookings || []);
      else setError(bookingsData.error || 'Failed to load seva bookings');

      if (godanaData.success) setGodanaPayments(godanaData.godana || []);
      if (donationsData.success) setDonations(donationsData.donations || []);
      // Godana failure is non-fatal (bookings may still load)

    } catch (err: any) {
      console.error('Login Error:', err);
      if (!isAuthenticated) setIsAuthenticated(false);
      setError(`Login failed: ${err.message || 'Connection error. Please check your network.'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = { 'x-admin-password': password };
      const [bookingsRes, godanaRes, donationsRes] = await Promise.all([
        fetch('/api/admin/bookings', { headers }),
        fetch('/api/admin/godana', { headers }),
        fetch('/api/admin/donations', { headers })
      ]);

      if (bookingsRes.status === 401) {
        setIsAuthenticated(false);
        setError('Session expired. Please log in again.');
        return;
      }

      const getJson = async (res: Response) => {
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) return res.json();
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text.substring(0, 100)}`);
      };

      const bookingsData = await getJson(bookingsRes);
      const godanaData = await getJson(godanaRes);

      const donationsData = await getJson(donationsRes);

      if (bookingsData.success) {
        setBookings(bookingsData.bookings);
      } else {
        setError(bookingsData.error || 'Failed to sync bookings');
      }

      if (godanaData.success) {
        setGodanaPayments(godanaData.godana);
      }
      
      if (donationsData.success) {
        setDonations(donationsData.donations);
      }
      
    } catch (err: any) {
      console.error('Sync Error:', err);
      setError('Data sync failed: ' + (err.message || 'Check connection'));
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.seva_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGodana = godanaPayments.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  const filteredDonations = donations.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone.includes(searchTerm)
  );

  const confirmBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to mark this booking as Confirmed?')) return;
    
    setLoading(true);
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'x-admin-password': password 
      };
      const res = await fetch('/api/admin/confirm-booking', {
        method: 'POST',
        headers,
        body: JSON.stringify({ bookingId: id, status: 'Confirmed' })
      });
      
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, payment_status: 'Confirmed' } : b));
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, payment_status: 'Confirmed' });
        }
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error while updating status');
    } finally {
      setLoading(false);
    }
  };

  const sevaRevenue = bookings.reduce((acc, b) => acc + (b.seva_price * b.count), 0);
  const godanaRevenue = godanaPayments.reduce((acc, p) => acc + p.amount, 0);
  const generalDonationRevenue = donations.reduce((acc, d) => acc + d.amount, 0);
  const totalRevenue = sevaRevenue + godanaRevenue + generalDonationRevenue;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-6 sm:p-10 border border-stone-100"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#8B0000] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
            <p className="text-gray-400 text-sm">Honnali Rayara Matta Management</p>
            <button 
              onClick={onLogout}
              className="mt-4 text-stone-400 hover:text-[#8B0000] text-xs font-bold uppercase tracking-widest transition-colors"
            >
              ← Back to Website
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Access Key</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
                placeholder="Enter password"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
            <button 
              disabled={loading}
              className="w-full bg-[#8B0000] text-white py-4 rounded-full font-bold shadow-xl hover:bg-[#6B0000] transition-all transform active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin mx-auto" size={20} /> : 'Unlock Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-[#8B0000] tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm font-medium mt-1">Monitoring Seva Bookings & Payments</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={fetchData}
              className="p-3.5 bg-white text-[#8B0000] rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                if (onLogout) onLogout();
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-white text-gray-500 rounded-2xl shadow-sm border border-gray-100 hover:bg-red-50 hover:text-red-600 transition-all font-black text-sm active:scale-95"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 p-1.5 bg-stone-200/50 w-full sm:w-fit rounded-2xl mb-8 backdrop-blur-sm overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('sevas')}
            className={`flex-1 sm:flex-none whitespace-nowrap px-6 sm:px-8 py-3.5 rounded-xl font-black text-sm transition-all ${
              activeTab === 'sevas' 
                ? 'bg-[#8B0000] text-white shadow-lg' 
                : 'text-stone-500 hover:bg-stone-200'
            }`}
          >
            Sevas
          </button>
          <button
            onClick={() => setActiveTab('godana')}
            className={`flex-1 sm:flex-none whitespace-nowrap px-6 sm:px-8 py-3.5 rounded-xl font-black text-sm transition-all ${
              activeTab === 'godana' 
                ? 'bg-[#8B0000] text-white shadow-lg' 
                : 'text-stone-500 hover:bg-stone-200'
            }`}
          >
            Godana
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`flex-1 sm:flex-none whitespace-nowrap px-6 sm:px-8 py-3.5 rounded-xl font-black text-sm transition-all ${
              activeTab === 'donations' 
                ? 'bg-[#8B0000] text-white shadow-lg' 
                : 'text-stone-500 hover:bg-stone-200'
            }`}
          >
            Donations
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Seva Bookings', value: bookings.length, icon: <Calendar className="text-blue-600" />, color: 'bg-blue-50' },
            { label: 'Godana Seva', value: godanaPayments.length, icon: <Heart className="text-rose-600" />, color: 'bg-rose-50' },
            { label: 'General Donations', value: donations.length, icon: <CreditCard className="text-indigo-600" />, color: 'bg-indigo-50' },
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <BarChart3 className="text-emerald-600" />, color: 'bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`p-4 ${stat.color} rounded-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table Section */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email or seva..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B0000] text-sm"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={fetchData}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gray-50 text-gray-600 rounded-full font-bold border border-gray-100 hover:bg-gray-100 transition-all text-sm"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {activeTab === 'sevas' ? 'Booking Info' : 'Donor Info'}
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {activeTab === 'sevas' ? 'Seva Details' : 'Contact Details'}
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {activeTab === 'sevas' ? 'Transaction / Status' : 'Transaction ID'}
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeTab === 'sevas' ? (
                  filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{booking.name}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Clock size={12} /> {new Date(booking.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-700">{booking.seva_name}</span>
                          <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Qty: {booking.count}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-[#8B0000]">
                        ₹{(booking.seva_price * booking.count).toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded truncate w-32" title={booking.transaction_id}>
                            UTR: {booking.transaction_id || 'N/A'}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold w-fit shadow-sm border ${
                            booking.payment_status === 'Confirmed' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : booking.payment_status === 'Failed'
                              ? 'bg-red-50 text-red-700 border-red-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {booking.payment_status === 'Confirmed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {booking.payment_status || 'Pending Verification'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 hover:bg-[#8B0000]/10 rounded-lg text-[#8B0000] transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-gray-400">
                        <div className="flex flex-col items-center">
                          <Calendar size={48} className="opacity-10 mb-4" />
                          <p className="font-medium">No bookings found</p>
                        </div>
                      </td>
                    </tr>
                  )
                  ) : activeTab === 'godana' ? (
                    filteredGodana.length > 0 ? filteredGodana.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{payment.name}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <Clock size={12} /> {new Date(payment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-700">{payment.email}</span>
                            <span className="text-xs text-gray-400 font-bold">{payment.phone}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-[#8B0000]">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded">
                            {payment.payment_id}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 text-stone-300 cursor-not-allowed">
                            <ChevronRight size={20} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-gray-400">
                          <div className="flex flex-col items-center">
                            <Heart size={48} className="opacity-10 mb-4" />
                            <p className="font-medium">No Godana Seva contributions found</p>
                          </div>
                        </td>
                      </tr>
                    )
                  ) : (
                    filteredDonations.length > 0 ? filteredDonations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{donation.name}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <Clock size={12} /> {new Date(donation.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-700">{donation.email || 'N/A'}</span>
                            <span className="text-xs text-gray-400 font-bold">{donation.phone}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-[#8B0000]">
                          ₹{donation.amount.toLocaleString()}
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded">
                            {donation.payment_id}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 text-stone-300 cursor-not-allowed">
                            <ChevronRight size={20} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-gray-400">
                          <div className="flex flex-col items-center">
                            <CreditCard size={48} className="opacity-10 mb-4" />
                            <p className="font-medium">No general donations found</p>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-gray-50/30 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Showing {activeTab === 'sevas' ? filteredBookings.length : activeTab === 'godana' ? filteredGodana.length : filteredDonations.length} total entries
            </p>
          </div>
        </div>

        {/* Detailed Booking Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden"
              >
                <div className="p-6 sm:p-8 bg-[#8B0000] text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">Booking Details</h3>
                    <p className="opacity-70 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">UTR: {selectedBooking.transaction_id || 'N/A'}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 sm:p-3 hover:bg-white/10 rounded-2xl transition-colors font-bold text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-8 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Donor Details</h4>
                      <p className="font-bold text-gray-800 text-lg">{selectedBooking.name}</p>
                      <p className="text-sm text-gray-600">{selectedBooking.email || 'No email provided'}</p>
                      <p className="text-sm text-gray-600">{selectedBooking.phone}</p>
                      {selectedBooking.address && (
                        <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-sm italic">
                          \"{selectedBooking.address}\"
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ritual Info</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div className="p-3 bg-red-50/50 rounded-xl">
                          <p className="text-[9px] text-[#8B0000] font-bold uppercase">Gothra</p>
                          <p className="font-bold">{selectedBooking.gothra || '-'}</p>
                        </div>
                        <div className="p-3 bg-red-50/50 rounded-xl">
                          <p className="text-[9px] text-[#8B0000] font-bold uppercase">Nakshathra</p>
                          <p className="font-bold">{selectedBooking.nakshathra || '-'}</p>
                        </div>
                        <div className="p-3 bg-red-50/50 rounded-xl">
                          <p className="text-[9px] text-[#8B0000] font-bold uppercase">Rashi</p>
                          <p className="font-bold">{selectedBooking.rashi || '-'}</p>
                        </div>
                        <div className="p-3 bg-red-50/50 rounded-xl">
                          <p className="text-[9px] text-[#8B0000] font-bold uppercase">Vedha</p>
                          <p className="font-bold">{selectedBooking.vedha || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seva Details</h4>
                      <p className="font-bold text-gray-800">{selectedBooking.seva_name}</p>
                      <p className="text-sm text-gray-600">Scheduled for: {selectedBooking.date}</p>
                      <p className="text-sm text-gray-600">Quantity: {selectedBooking.count}</p>
                    </div>
                    <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Payment Status</h4>
                      <div className="text-center">
                        <p className="text-3xl font-black text-[#8B0000] mb-2">₹{(selectedBooking.seva_price * selectedBooking.count).toLocaleString()}</p>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                          selectedBooking.payment_status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {selectedBooking.payment_status || 'Pending Verification'}
                        </span>
                      </div>
                    </div>
                    {selectedBooking.message && (
                      <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Special Message</h4>
                        <p className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-xl">\"{selectedBooking.message}\"</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-8 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xs text-gray-400">
                    ID: {selectedBooking.id} • Registered: {new Date(selectedBooking.created_at).toLocaleString()}
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    {selectedBooking.payment_status !== 'Confirmed' && (
                      <button 
                        onClick={() => confirmBooking(selectedBooking.id)}
                        disabled={loading}
                        className="flex-1 sm:flex-none bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <ShieldCheck size={18} /> Confirm Payment
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedBooking(null)}
                      className="flex-1 sm:flex-none border border-gray-200 text-gray-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
