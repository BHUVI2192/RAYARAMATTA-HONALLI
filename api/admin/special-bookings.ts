import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../api/_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  const adminPassword = req.headers['x-admin-password'];
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabase!
      .from('special_seva_bookings')
      .select('*, special_notifications(title)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/special-bookings] Supabase error:', error);
      throw error;
    }

    return res.status(200).json({ success: true, special_bookings: data || [] });
  } catch (error: any) {
    console.error('[admin/special-bookings] Unexpected error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch special bookings' });
  }
}
