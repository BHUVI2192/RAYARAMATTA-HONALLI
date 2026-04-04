import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'application/json');

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const providedPassword = req.headers['x-admin-password'] || req.body?.password;

  if (providedPassword !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/bookings] Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: `Database error: ${error.message} (code: ${error.code})`
      });
    }

    return res.status(200).json({ success: true, bookings: data || [] });
  } catch (error: any) {
    console.error('[admin/bookings] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
