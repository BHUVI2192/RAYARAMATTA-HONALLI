import React, { useState, useEffect, useRef } from 'react';
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
  Heart,
  Loader
} from 'lucide-react';
import { translateToKannada } from '../utils/translator';

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

interface SpecialNotification {
  id: string;
  title: string;
  description: string;
  amount: number;
  is_active: boolean;
  created_at: string;
}

interface SpecialBooking {
  id: string;
  notification_id: string;
  name: string;
  phone: string;
  email: string;
  amount: number;
  payment_id: string;
  status: string;
  created_at: string;
  special_notifications?: {
    title: string;
  };
}

interface AdminPanelProps {
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'sevas' | 'godana' | 'donations' | 'notifications' | 'special_bookings'>('sevas');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [godanaPayments, setGodanaPayments] = useState<GodanaPayment[]>([]);
  const [donations, setDonations] = useState<GeneralDonation[]>([]);
  const [notifications, setNotifications] = useState<SpecialNotification[]>([]);
  const [specialBookings, setSpecialBookings] = useState<SpecialBooking[]>([]);
  const [newNotification, setNewNotification] = useState({ title: '', titleKn: '', description: '', descKn: '', amount: '' });
  const [newNotification2, setNewNotification2] = useState({ title: '', titleKn: '', description: '', descKn: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [translatingNotif1Title, setTranslatingNotif1Title] = useState(false);
  const [translatingNotif1Desc, setTranslatingNotif1Desc] = useState(false);
  const [translatingNotif2Title, setTranslatingNotif2Title] = useState(false);
  const [translatingNotif2Desc, setTranslatingNotif2Desc] = useState(false);
  const translationTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = { 'x-admin-password': password };
      const [bookingsRes, godanaRes, donationsRes, notifRes, specialBookRes] = await Promise.all([
        fetch('/api/admin/bookings', { headers }),
        fetch('/api/admin/godana', { headers }),
        fetch('/api/admin/donations', { headers }),
        fetch('/api/admin/notifications', { headers }),
        fetch('/api/admin/special-bookings', { headers })
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
      const notifData = await getJson(notifRes);
      const specialBookData = await getJson(specialBookRes);

      if (bookingsData.success) {
        setBookings(bookingsData.bookings);
      } else {
        setError(bookingsData.error || 'Failed to sync bookings');
      }

      if (godanaData.success) setGodanaPayments(godanaData.godana);
      if (donationsData.success) setDonations(donationsData.donations);
      if (notifData.success) setNotifications(notifData.notifications);
      if (specialBookData.success) setSpecialBookings(specialBookData.special_bookings);

      setLastUpdated(new Date());

    } catch (err: any) {
      console.error('Sync Error:', err);
      setError('Data sync failed: ' + (err.message || 'Check connection'));
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch data when authenticated state becomes true
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Auto-refresh when browser tab becomes visible again (e.g. returning from Razorpay redirect)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        fetchData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const headers: Record<string, string> = { 'x-admin-password': password };

      // Step 1: Validate password directly via the bookings data endpoint
      // Bypasses the dedicated /api/admin/login to reduce network dependencies.
      // If the server is overloaded, we gracefully catch it.
      let bookingsRes;
      try {
        bookingsRes = await fetch('/api/admin/bookings', { headers });
      } catch (networkErr) {
        // If the server is fully unreachable, we can still "log in" locally to show the UI
        // Data fetch will just show an error inside the dashboard.
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      if (bookingsRes.status === 401) {
        setError('Invalid admin password. Please try again.');
        return;
      }

      setIsAuthenticated(true);
      // Data will be fetched automatically by the useEffect watching isAuthenticated

    } catch (err: any) {
      console.error('Login Error:', err);
      if (!isAuthenticated) setIsAuthenticated(false);
      setError(`Login failed: ${err.message || 'Connection error. Please check your network.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-translation handlers with debouncing
  const handleTitleChange = (newTitle: string, isNotif2 = false) => {
    if (isNotif2) {
      setNewNotification2({ ...newNotification2, title: newTitle });
    } else {
      setNewNotification({ ...newNotification, title: newTitle });
    }

    // Clear existing timeout
    const timeoutKey = isNotif2 ? 'notif2-title' : 'notif1-title';
    const existingTimeout = translationTimeoutRef.current.get(timeoutKey);
    if (existingTimeout) clearTimeout(existingTimeout);

    // Set loading state
    if (isNotif2) setTranslatingNotif2Title(true);
    else setTranslatingNotif1Title(true);

    // Debounce translation call
    const timeout = setTimeout(async () => {
      if (newTitle.trim()) {
        const translated = await translateToKannada(newTitle);
        if (translated && isNotif2) {
          setNewNotification2((prev) => ({ ...prev, titleKn: translated }));
        } else if (translated) {
          setNewNotification((prev) => ({ ...prev, titleKn: translated }));
        }
      }
      if (isNotif2) setTranslatingNotif2Title(false);
      else setTranslatingNotif1Title(false);
    }, 800); // 800ms debounce

    translationTimeoutRef.current.set(timeoutKey, timeout);
  };

  const handleDescriptionChange = (newDesc: string, isNotif2 = false) => {
    if (isNotif2) {
      setNewNotification2({ ...newNotification2, description: newDesc });
    } else {
      setNewNotification({ ...newNotification, description: newDesc });
    }

    // Clear existing timeout
    const timeoutKey = isNotif2 ? 'notif2-desc' : 'notif1-desc';
    const existingTimeout = translationTimeoutRef.current.get(timeoutKey);
    if (existingTimeout) clearTimeout(existingTimeout);

    // Set loading state
    if (isNotif2) setTranslatingNotif2Desc(true);
    else setTranslatingNotif1Desc(true);

    // Debounce translation call
    const timeout = setTimeout(async () => {
      if (newDesc.trim()) {
        const translated = await translateToKannada(newDesc);
        if (translated && isNotif2) {
          setNewNotification2((prev) => ({ ...prev, descKn: translated }));
        } else if (translated) {
          setNewNotification((prev) => ({ ...prev, descKn: translated }));
        }
      }
      if (isNotif2) setTranslatingNotif2Desc(false);
      else setTranslatingNotif1Desc(false);
    }, 800); // 800ms debounce

    translationTimeoutRef.current.set(timeoutKey, timeout);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      translationTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const isWithinDateRange = (dateStr: string) => {
    if (!startDate && !endDate) return true;
    const date = new Date(dateStr);
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (date < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (date > end) return false;
    }
    return true;
  };

  const filteredBookings = bookings.filter(b =>
    (b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.seva_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    isWithinDateRange(b.created_at)
  );

  const filteredGodana = godanaPayments.filter(p =>
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)) &&
    isWithinDateRange(p.created_at)
  );

  const filteredDonations = donations.filter(d =>
    (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm)) &&
    isWithinDateRange(d.created_at)
  );

  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    isWithinDateRange(n.created_at)
  );

  const filteredSpecialBookings = specialBookings.filter(b =>
    (b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm)) &&
    isWithinDateRange(b.created_at)
  );

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Encode bilingual content: "English value||ಕನ್ನಡ ಮೌಲ್ಯ"
      // If no Kannada provided, just store the English value as-is.
      const encodeField = (en: string, kn: string) =>
        kn.trim() ? `${en}||${kn.trim()}` : en;

      // Build array of notifications to create (always include first, optionally second)
      const toCreate = [{
        title: encodeField(newNotification.title, newNotification.titleKn),
        description: encodeField(newNotification.description, newNotification.descKn),
        amount: newNotification.amount,
      }];
      const hasSecond = newNotification2.title.trim() && newNotification2.amount;
      if (hasSecond) toCreate.push({
        title: encodeField(newNotification2.title, newNotification2.titleKn),
        description: encodeField(newNotification2.description, newNotification2.descKn),
        amount: newNotification2.amount,
      });

      const results = await Promise.all(
        toCreate.map((notif) =>
          fetch('/api/admin/notifications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': password
            },
            body: JSON.stringify({
              title: notif.title,
              description: notif.description,
              amount: parseFloat(notif.amount),
              is_active: true
            })
          }).then(r => r.json())
        )
      );

      const added: typeof notifications = [];
      for (const data of results) {
        if (data.success) added.push(data.notification);
        else alert(data.error || 'Failed to create notification');
      }
      if (added.length > 0) {
        setNotifications([...added, ...notifications]);
      }
      setNewNotification({ title: '', titleKn: '', description: '', descKn: '', amount: '' });
      setNewNotification2({ title: '', titleKn: '', description: '', descKn: '', amount: '' });
    } catch (err) {
      alert('Error creating notification');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications?id=' + id, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(notifications.filter(n => n.id !== id));
      } else {
        alert(data.error || 'Failed to delete notification');
      }
    } catch (err) {
      alert('Error deleting notification');
    } finally {
      setLoading(false);
    }
  };

  const toggleNotificationStatus = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({ id, is_active: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_active: !currentStatus } : n));
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    const dataToExport = activeTab === 'sevas' ? filteredBookings : activeTab === 'godana' ? filteredGodana : filteredDonations;
    if (dataToExport.length === 0) {
      alert('No data available to export with current filters');
      return;
    }

    let csvContent = "";
    if (activeTab === 'sevas') {
      const headers = ["ID", "Name", "Seva Name", "Price", "Quantity", "Total", "Date", "Phone", "Email", "Address", "Gothra", "Nakshathra", "Rashi", "UTR", "Status", "Booking Date"];
      csvContent = [
        headers.join(","),
        ...dataToExport.map(b => {
          const booking = b as Booking;
          return [
            booking.id,
            `"${booking.name}"`,
            `"${booking.seva_name}"`,
            booking.seva_price,
            booking.count,
            booking.seva_price * booking.count,
            `"${booking.date}"`,
            `"${booking.phone}"`,
            `"${booking.email}"`,
            `"${(booking.address || '').replace(/"/g, '""')}"`,
            `"${booking.gothra}"`,
            `"${booking.nakshathra}"`,
            `"${booking.rashi}"`,
            `"${booking.transaction_id}"`,
            `"${booking.payment_status}"`,
            `"${new Date(booking.created_at).toLocaleString()}"`
          ].join(",");
        })
      ].join("\n");
    } else {
      const headers = ["ID", "Name", "Amount", "Phone", "Email", "Transaction ID", "Date"];
      csvContent = [
        headers.join(","),
        ...dataToExport.map(p => {
          const item = p as (GodanaPayment | GeneralDonation);
          return [
            item.id,
            `"${item.name}"`,
            item.amount,
            `"${item.phone}"`,
            `"${item.email}"`,
            `"${item.payment_id}"`,
            `"${new Date(item.created_at).toLocaleString()}"`
          ].join(",");
        })
      ].join("\n");
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const filename = `${activeTab}_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const sevaRevenue = filteredBookings.reduce((acc, b) => acc + (b.seva_price * b.count), 0);
  const godanaRevenue = filteredGodana.reduce((acc, p) => acc + p.amount, 0);
  const generalDonationRevenue = filteredDonations.reduce((acc, d) => acc + d.amount, 0);
  const specialSevaRevenue = filteredSpecialBookings.reduce((acc, b) => acc + b.amount, 0);
  const totalRevenue = sevaRevenue + godanaRevenue + generalDonationRevenue + specialSevaRevenue;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-6 sm:p-10 border border-stone-100"
        >
          <div className="text-center mb-8">
            <img 
              src="/images/LOGO.jpeg" 
              alt="Mutt Logo" 
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-lg border border-stone-200"
            />
            <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
            <p className="text-gray-400 text-sm">Honnali Rayara Mutt Management</p>
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
            className={`flex-1 sm:flex-none whitespace-nowrap px-6 sm:px-8 py-3.5 rounded-xl font-black text-sm transition-all ${activeTab === 'sevas'
              ? 'bg-[#8B0000] text-white shadow-lg'
              : 'text-stone-500 hover:bg-stone-200'
              }`}
          >
            Sevas
          </button>
          <button
            onClick={() => setActiveTab('godana')}
            className={`flex-1 sm:flex-none whitespace-nowrap px-6 sm:px-8 py-3.5 rounded-xl font-black text-sm transition-all ${activeTab === 'godana'
              ? 'bg-[#8B0000] text-white shadow-lg'
              : 'text-stone-500 hover:bg-stone-200'
              }`}
          >
            Godana
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`flex-1 sm:flex-none whitespace-nowrap px-6 sm:px-8 py-3.5 rounded-xl font-black text-sm transition-all ${activeTab === 'donations'
              ? 'bg-[#8B0000] text-white shadow-lg'
              : 'text-stone-500 hover:bg-stone-200'
              }`}
          >
            Donations
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 sm:flex-none whitespace-nowrap px-6 sm:px-8 py-3.5 rounded-xl font-black text-sm transition-all ${activeTab === 'notifications'
              ? 'bg-[#8B0000] text-white shadow-lg'
              : 'text-stone-500 hover:bg-stone-200'
              }`}
          >
            Special Notifications
          </button>
          <button
            onClick={() => setActiveTab('special_bookings')}
            className={`flex-1 sm:flex-none whitespace-nowrap px-6 sm:px-8 py-3.5 rounded-xl font-black text-sm transition-all ${activeTab === 'special_bookings'
              ? 'bg-[#8B0000] text-white shadow-lg'
              : 'text-stone-500 hover:bg-stone-200'
              }`}
          >
            Special Bookings
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
            <div className="flex flex-wrap gap-4 w-full md:w-auto items-center">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full">
                <Calendar size={14} className="text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-none text-xs focus:outline-none"
                  placeholder="Start Date"
                />
                <span className="text-gray-300">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-none text-xs focus:outline-none"
                  placeholder="End Date"
                />
                {(startDate || endDate) && (
                  <button
                    onClick={() => { setStartDate(''); setEndDate(''); }}
                    className="ml-2 text-xs text-red-500 hover:text-red-700 font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <button
                onClick={handleDownloadCSV}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#8B0000] text-white rounded-full font-bold shadow-md hover:bg-[#6B0000] transition-all text-sm"
              >
                <Download size={16} /> Export CSV
              </button>
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
                    {activeTab === 'notifications' ? 'Notification Title' : (activeTab === 'sevas' ? 'Booking Info' : 'Donor Info')}
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {activeTab === 'notifications' ? 'Description' : (activeTab === 'special_bookings' ? 'Seva Details' : (activeTab === 'sevas' ? 'Seva Details' : 'Contact Details'))}
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {activeTab === 'notifications' ? 'Status' : (activeTab === 'sevas' || activeTab === 'special_bookings' ? 'Transaction / Status' : 'Transaction ID')}
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
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold w-fit shadow-sm border ${booking.payment_status === 'Confirmed'
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
                ) : activeTab === 'donations' ? (
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
                ) : activeTab === 'notifications' ? (
                  <>
                    <tr className="bg-stone-50 border-b border-gray-100">
                      <td colSpan={5} className="px-8 py-6">
                        <form onSubmit={handleCreateNotification} className="space-y-4">
                          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Add Special Seva Notifications</p>

                          {/* Notification 1 */}
                          <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3">
                            <p className="text-xs font-bold text-[#8B0000] uppercase tracking-wider">Notification 1 *</p>
                            {/* English row */}
                            <div className="flex flex-wrap gap-3 items-end">
                              <div className="flex-1 min-w-[180px]">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Title (English) *</label>
                                <input required type="text" value={newNotification.title} onChange={e => handleTitleChange(e.target.value, false)} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="e.g., Raghavendra Aradhana" />
                              </div>
                              <div className="flex-[2] min-w-[260px]">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Description (English) *</label>
                                <input required type="text" value={newNotification.description} onChange={e => handleDescriptionChange(e.target.value, false)} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Short description..." />
                              </div>
                              <div className="w-28">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Amount (₹) *</label>
                                <input required type="number" min="1" value={newNotification.amount} onChange={e => setNewNotification({ ...newNotification, amount: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="501" />
                              </div>
                            </div>
                            {/* Kannada row */}
                            <div className="flex flex-wrap gap-3 items-end border-t border-dashed border-orange-100 pt-3">
                              <div className="flex items-center gap-1.5 w-full mb-1">
                                <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">ಕನ್ನಡ Translation</span>
                                <span className="text-[10px] text-gray-400">(Auto-translated from English)</span>
                                {(translatingNotif1Title || translatingNotif1Desc) && (
                                  <span className="ml-auto text-[10px] text-orange-600 flex items-center gap-1">
                                    <Loader size={12} className="animate-spin" /> Translating...
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-[180px]">
                                <label className="block text-xs font-bold text-gray-500 mb-1">ಶೀರ್ಷಿಕೆ (Title in Kannada)</label>
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    value={newNotification.titleKn} 
                                    onChange={e => setNewNotification({ ...newNotification, titleKn: e.target.value })} 
                                    disabled={translatingNotif1Title}
                                    className="w-full px-4 py-2 rounded-lg border border-orange-200 text-sm disabled:bg-orange-50" 
                                    placeholder="ಉದಾ: ರಾಘವೇಂದ್ರ ಆರಾಧನೆ" 
                                  />
                                  {translatingNotif1Title && (
                                    <Loader size={14} className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-orange-500" />
                                  )}
                                </div>
                              </div>
                              <div className="flex-[2] min-w-[260px]">
                                <label className="block text-xs font-bold text-gray-500 mb-1">ವಿವರಣೆ (Description in Kannada)</label>
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    value={newNotification.descKn} 
                                    onChange={e => setNewNotification({ ...newNotification, descKn: e.target.value })} 
                                    disabled={translatingNotif1Desc}
                                    className="w-full px-4 py-2 rounded-lg border border-orange-200 text-sm disabled:bg-orange-50" 
                                    placeholder="ಸಣ್ಣ ವಿವರಣೆ..." 
                                  />
                                  {translatingNotif1Desc && (
                                    <Loader size={14} className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-orange-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Notification 2 (optional) */}
                          <div className="p-4 bg-white border border-dashed border-gray-300 rounded-2xl space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notification 2 (Optional)</p>
                            {/* English row */}
                            <div className="flex flex-wrap gap-3 items-end">
                              <div className="flex-1 min-w-[180px]">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Title (English)</label>
                                <input type="text" value={newNotification2.title} onChange={e => handleTitleChange(e.target.value, true)} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="e.g., Vishnu Sahasranama Seva" />
                              </div>
                              <div className="flex-[2] min-w-[260px]">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Description (English)</label>
                                <input type="text" value={newNotification2.description} onChange={e => handleDescriptionChange(e.target.value, true)} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Short description..." />
                              </div>
                              <div className="w-28">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Amount (₹)</label>
                                <input type="number" min="1" value={newNotification2.amount} onChange={e => setNewNotification2({ ...newNotification2, amount: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="251" />
                              </div>
                            </div>
                            {/* Kannada row */}
                            <div className="flex flex-wrap gap-3 items-end border-t border-dashed border-orange-100 pt-3">
                              <div className="flex items-center gap-1.5 w-full mb-1">
                                <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">ಕನ್ನಡ Translation</span>
                                <span className="text-[10px] text-gray-400">(Auto-translated from English)</span>
                                {(translatingNotif2Title || translatingNotif2Desc) && (
                                  <span className="ml-auto text-[10px] text-orange-600 flex items-center gap-1">
                                    <Loader size={12} className="animate-spin" /> Translating...
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-[180px]">
                                <label className="block text-xs font-bold text-gray-500 mb-1">ಶೀರ್ಷಿಕೆ (Title in Kannada)</label>
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    value={newNotification2.titleKn} 
                                    onChange={e => setNewNotification2({ ...newNotification2, titleKn: e.target.value })} 
                                    disabled={translatingNotif2Title}
                                    className="w-full px-4 py-2 rounded-lg border border-orange-200 text-sm disabled:bg-orange-50" 
                                    placeholder="ಉದಾ: ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಸೇವೆ" 
                                  />
                                  {translatingNotif2Title && (
                                    <Loader size={14} className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-orange-500" />
                                  )}
                                </div>
                              </div>
                              <div className="flex-[2] min-w-[260px]">
                                <label className="block text-xs font-bold text-gray-500 mb-1">ವಿವರಣೆ (Description in Kannada)</label>
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    value={newNotification2.descKn} 
                                    onChange={e => setNewNotification2({ ...newNotification2, descKn: e.target.value })} 
                                    disabled={translatingNotif2Desc}
                                    className="w-full px-4 py-2 rounded-lg border border-orange-200 text-sm disabled:bg-orange-50" 
                                    placeholder="ಸಣ್ಣ ವಿವರಣೆ..." 
                                  />
                                  {translatingNotif2Desc && (
                                    <Loader size={14} className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-orange-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button disabled={loading} type="submit" className="bg-[#8B0000] text-white px-8 py-2.5 rounded-xl font-bold disabled:opacity-50 text-sm flex items-center gap-2">
                              {loading ? 'Adding...' : newNotification2.title ? 'Add Both Notifications' : 'Add Notification'}
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                    {filteredNotifications.length > 0 ? filteredNotifications.map(notif => (
                      <tr key={notif.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6 font-bold text-gray-800">
                          {/* Show English part (before ||) in admin table */}
                          {notif.title.split('||')[0]}
                          {notif.title.includes('||') && (
                            <span className="ml-2 text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold">KN ✓</span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-600 truncate max-w-xs">{notif.description.split('||')[0]}</td>
                        <td className="px-8 py-6 text-sm font-bold text-[#8B0000]">₹{notif.amount}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${notif.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                            {notif.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right space-x-3">
                          <button onClick={() => toggleNotificationStatus(notif.id, notif.is_active)} className="text-sm font-bold text-blue-600 hover:underline">
                            {notif.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => handleDeleteNotification(notif.id)} className="text-sm font-bold text-red-600 hover:underline">
                            Delete
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400">No special notifications found. Create one above!</td></tr>
                    )}
                  </>
                ) : (
                  filteredSpecialBookings.length > 0 ? filteredSpecialBookings.map(booking => (
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
                          <span className="text-sm font-semibold text-gray-700">{booking.special_notifications?.title || 'Deleted Notification'}</span>
                          <span className="text-xs text-gray-400 font-bold">{booking.phone} | {booking.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-[#8B0000]">₹{booking.amount}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded truncate w-32" title={booking.payment_id}>
                            UTR: {booking.payment_id}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold w-fit shadow-sm border ${booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                            {booking.status === 'Confirmed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {booking.status || 'Pending Verification'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-[#8B0000]/10 rounded-lg text-[#8B0000] transition-colors">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400">No special bookings found.</td></tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-gray-50/30 border-t border-gray-50 text-center flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-400 font-medium">
              Showing {activeTab === 'sevas' ? filteredBookings.length : activeTab === 'godana' ? filteredGodana.length : activeTab === 'donations' ? filteredDonations.length : activeTab === 'notifications' ? filteredNotifications.length : filteredSpecialBookings.length} total entries
            </p>
            {lastUpdated && (
              <p className="text-xs text-gray-300 font-medium">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
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
                        <span className={`px-4 py-2 rounded-full text-xs font-bold ${selectedBooking.payment_status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
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
