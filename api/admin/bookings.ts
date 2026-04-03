import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.headers['x-admin-password'] !== 'admin123') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, bookings: data });
  } catch (error: any) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
