import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  // 1. Determine the route from query (injected by vercel.json) or path
  const route = req.query.route as string;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const providedPassword = req.headers['x-admin-password'] || req.body?.password || req.body?.adminPassword;

  // 2. Authentication Check (for all routes except maybe login, but we'll include it for consistency)
  if (route !== 'login' && providedPassword !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // 3. Routing Logic
  try {
    switch (route) {
      case 'login':
        return handleLogin(req, res, adminPassword);
      case 'bookings':
        return handleBookings(req, res);
      case 'confirm-booking':
        return handleConfirmBooking(req, res);
      case 'donations':
        return handleDonations(req, res);
      case 'godana':
        return handleGodana(req, res);
      case 'notifications':
        return handleNotifications(req, res);
      case 'special-bookings':
        return handleSpecialBookings(req, res);
      default:
        return res.status(404).json({ success: false, message: `Admin route '${route}' not found` });
    }
  } catch (error: any) {
    console.error(`[admin_api] Error in route ${route}:`, error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}

async function handleLogin(req: VercelRequest, res: VercelResponse, adminPassword: string) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const password = req.body?.password || req.headers['x-admin-password'];
  if (!password) return res.status(400).json({ success: false, message: 'Password is required' });
  if (password !== adminPassword) return res.status(401).json({ success: false, message: 'Invalid admin password' });
  return res.status(200).json({ success: true, message: 'Login successful' });
}

async function handleBookings(req: VercelRequest, res: VercelResponse) {
  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return res.status(200).json({ success: true, bookings: data || [] });
}

async function handleConfirmBooking(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });
  const { bookingId, status, bookingType } = req.body || {};
  if (!bookingId) return res.status(400).json({ success: false, message: 'Booking ID is required' });
  
  if (bookingType === 'special_seva') {
    const { data, error } = await supabase.from('special_seva_bookings').update({ status: status || 'Confirmed' }).eq('id', bookingId).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ success: false, message: 'Booking not found' });
    return res.status(200).json({ success: true, message: 'Booking status updated', booking: data[0] });
  } else {
    const { data, error } = await supabase.from('bookings').update({ payment_status: status || 'Confirmed' }).eq('id', bookingId).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ success: false, message: 'Booking not found' });
    return res.status(200).json({ success: true, message: 'Booking status updated', booking: data[0] });
  }
}

async function handleDonations(req: VercelRequest, res: VercelResponse) {
  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });
  const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return res.status(200).json({ success: true, donations: data || [] });
}

async function handleGodana(req: VercelRequest, res: VercelResponse) {
  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });
  const { data, error } = await supabase.from('godana_payments').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return res.status(200).json({ success: true, godana: data || [] });
}

async function handleNotifications(req: VercelRequest, res: VercelResponse) {
  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });
  
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('special_notifications').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return res.status(200).json({ success: true, notifications: data || [] });
  }

  if (req.method === 'POST') {
    const { title, description, amount, is_active } = req.body;
    const { data, error } = await supabase.from('special_notifications').insert([{ title, description, amount, is_active }]).select();
    if (error) throw error;
    return res.status(200).json({ success: true, notification: data?.[0] });
  }

  if (req.method === 'PUT') {
    const { id, title, description, amount, is_active } = req.body;
    const { data, error } = await supabase.from('special_notifications').update({ title, description, amount, is_active }).eq('id', id).select();
    if (error) throw error;
    return res.status(200).json({ success: true, notification: data?.[0] });
  }

  if (req.method === 'DELETE') {
    const id = req.query.id || req.body?.id;
    if (!id) return res.status(400).json({ success: false, error: 'Notification ID is required' });
    const { error } = await supabase.from('special_notifications').delete().eq('id', id);
    if (error) throw error;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}

async function handleSpecialBookings(req: VercelRequest, res: VercelResponse) {
  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const { data, error } = await supabase.from('special_seva_bookings').select('*, special_notifications(title)').order('created_at', { ascending: false });
  if (error) throw error;
  return res.status(200).json({ success: true, special_bookings: data || [] });
}
