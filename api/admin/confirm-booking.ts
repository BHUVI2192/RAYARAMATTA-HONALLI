import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (req.headers['x-admin-password'] !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { bookingId, status } = req.body;

  if (!bookingId) {
    return res.status(400).json({ success: false, message: 'Booking ID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ payment_status: status || 'Confirmed' })
      .eq('id', bookingId)
      .select();

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Booking status updated', booking: data[0] });
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
