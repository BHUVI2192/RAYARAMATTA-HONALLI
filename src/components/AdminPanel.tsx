import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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

export const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'sevas' | 'godana'>('sevas');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [godanaPayments, setGodanaPayments] = useState<GodanaPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple local check
      setIsAuthenticated(true);
      fetchData();
    } else {
      setError('Invalid password');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'x-admin-password': password };
      
      const [bookingsRes, godanaRes] = await Promise.all([
        fetch('/api/admin/bookings', { headers }),
        fetch('/api/admin/godana', { headers })
      ]);

      const bookingsData = await bookingsRes.json();
      const godanaData = await godanaRes.json();

      if (bookingsData.success) {
        setBookings(bookingsData.bookings);
      } else {
        setError(bookingsData.error || 'Failed to fetch bookings');
      }

      if (godanaRes.ok && godanaData.success) {
        setGodanaPayments(godanaData.godana);
      } else {
        console.warn('Godana payments fetch failed or table not found');
      }
      
      if (!bookingsData.success || !godanaData.success) {
        setError('Partial data fetch failure');
      }
    } catch (err) {
      setError('Server connection failed. Make sure the backend is running.');
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

  const sevaRevenue = bookings.reduce((acc, b) => acc + (b.seva_price * b.count), 0);
  const godanaRevenue = godanaPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalRevenue = sevaRevenue + godanaRevenue;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-stone-200"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#8B0000] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
            <p className="text-gray-400 text-sm">Honali Rayara Matta Management</p>
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
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button className="w-full bg-[#8B0000] text-white py-4 rounded-full font-bold shadow-xl hover:bg-[#6B0000] transition-all transform active:scale-95">
              Unlock Terminal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#8B0000]">Admin Dashboard</h1>
            <p className="text-gray-400 font-medium">Monitoring Seva Bookings & Payments</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchData}
              className="p-3 bg-white text-[#8B0000] rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-500 rounded-xl shadow-sm border border-gray-100 hover:bg-red-50 hover:text-red-600 transition-all font-bold"
            >
              <LogOut size={18} /> Exit
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1.5 bg-stone-200/50 w-fit rounded-2xl mb-8 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('sevas')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'sevas' 
                ? 'bg-[#8B0000] text-white shadow-lg' 
                : 'text-stone-500 hover:bg-stone-200'
            }`}
          >
            Seva Bookings
          </button>
          <button
            onClick={() => setActiveTab('godana')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'godana' 
                ? 'bg-[#8B0000] text-white shadow-lg' 
                : 'text-stone-500 hover:bg-stone-200'
            }`}
          >
            Godana Seva
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Seva Bookings', value: bookings.length, icon: <Calendar className="text-blue-600" />, color: 'bg-blue-50' },
            { label: 'Godana Seva', value: godanaPayments.length, icon: <Heart className="text-rose-600" />, color: 'bg-rose-50' },
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <BarChart3 className="text-emerald-600" />, color: 'bg-emerald-50' },
            { label: 'Total Donors', value: new Set([...bookings.map(b => b.email), ...godanaPayments.map(p => p.email)]).size, icon: <Users className="text-amber-600" />, color: 'bg-amber-50' },
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
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
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
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gray-50 text-gray-600 rounded-full font-bold border border-gray-100 hover:bg-gray-100 transition-all text-sm">
                <Filter size={16} /> Filters
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#8B0000] text-white rounded-full font-bold shadow-lg hover:bg-[#6B0000] transition-all text-sm">
                <Download size={16} /> Export CSV
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
                            <Clock size={12} /> {new Date(booking.created_at).toLocaleDateString()} at {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                          <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded truncate w-32" title={booking.transaction_id || booking.payment_id}>
                            UTR: {booking.transaction_id || booking.payment_id || 'N/A'}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold w-fit ${
                            booking.payment_status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {booking.payment_status === 'confirmed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            {booking.payment_status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
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
                ) : (
                  filteredGodana.length > 0 ? filteredGodana.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{payment.name}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Clock size={12} /> {new Date(payment.created_at).toLocaleDateString()} at {new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
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
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-gray-50/30 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Showing {activeTab === 'sevas' ? filteredBookings.length : filteredGodana.length} total entries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
